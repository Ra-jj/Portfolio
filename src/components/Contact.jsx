import { Fragment, useEffect, useId, useRef, useState } from "react";
import { PiArrowUpRightBold, PiCheckBold, PiWarningBold } from "react-icons/pi";
import {
  AVAILABILITY,
  CONTACT_LINK_IDS,
  KEYS_BY_ID,
  LINKEDIN_URL,
} from "../constants/navigation";
import { usePressHold } from "../hooks/usePressHold";
import ExternalKeyLink from "./calculator/ExternalKeyLink";
import Led from "./calculator/Led";
import ContactLcd from "./contact/ContactLcd";

// Vite inlines VITE_* variables at build time, so this value is fixed for the
// lifetime of the bundle and only needs reading once.
const FORMSPREE_ENDPOINT = (import.meta.env.VITE_FORMSPREE_ENDPOINT ?? "").trim();

/** Where the form is after its last submit attempt. */
const PHASE = Object.freeze({
  READY: "ready",
  SENDING: "sending",
  SENT: "sent",
  FAILED: "failed",
  // VITE_FORMSPREE_ENDPOINT was empty at build time: nowhere to send to.
  UNCONFIGURED: "unconfigured",
});

/**
 * The phase the form starts in and returns to after a failed validation. A
 * build without an endpoint says so (USE LINKEDIN and its alert) from the
 * start, rather than waiting for a submit that can never be sent.
 */
const RESTING_PHASE = FORMSPREE_ENDPOINT ? PHASE.READY : PHASE.UNCONFIGURED;

/** Requires something on both sides of "@" and a dot in the domain. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The fields, in their existing order. `name` is both the id and the field
 * name Formspree receives; neither may change (design-rules 11).
 */
const FIELDS = Object.freeze([
  {
    name: "name",
    label: "Name",
    placeholder: "Your name",
    error: "Enter your name.",
    inputProps: { type: "text", autoComplete: "name" },
    isValid: (value) => value.trim() !== "",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "you@example.com",
    error: "Enter an email address like you@example.com.",
    inputProps: { type: "email", inputMode: "email", autoComplete: "email" },
    isValid: (value) => EMAIL_PATTERN.test(value.trim()),
  },
  {
    name: "message",
    label: "Message",
    placeholder: "What would you like to talk about?",
    error: "Write a message.",
    isMultiline: true,
    isValid: (value) => value.trim() !== "",
  },
]);

const FIELDS_BY_NAME = Object.freeze(
  Object.fromEntries(FIELDS.map((field) => [field.name, field])),
);

const NO_ERRORS = Object.freeze({});

/** Field name -> true for every field whose current value is invalid. */
function findInvalidFields(form) {
  const errors = {};
  for (const field of FIELDS) {
    const value = form.elements.namedItem(field.name)?.value ?? "";
    if (!field.isValid(value)) errors[field.name] = true;
  }
  return errors;
}

/** Row 2 of the contact LCD: the form's state, at most 16 characters. */
function lcdStatusRow(phase, errorCount) {
  if (phase === PHASE.SENDING) return "SENDING";
  if (errorCount > 0) return `CHECK ${errorCount} FIELD${errorCount === 1 ? "" : "S"}`;
  if (phase === PHASE.SENT) return "SENT. THANK YOU";
  if (phase === PHASE.FAILED) return "NOT SENT. RETRY";
  if (phase === PHASE.UNCONFIGURED) return "USE LINKEDIN";
  return "READY";
}

function LinkedInLink() {
  return (
    <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="contact-inline-link">
      LinkedIn<span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** One labelled field: label above, input, then its error (if shown). */
function ContactField({ field, hasError, onBlur, onChange }) {
  const errorId = `${field.name}-error`;
  const sharedProps = {
    id: field.name,
    name: field.name,
    required: true,
    placeholder: field.placeholder,
    "aria-invalid": hasError ? "true" : undefined,
    "aria-describedby": hasError ? errorId : undefined,
    onBlur,
    onChange,
    className: "contact-input",
  };

  return (
    <div className="contact-field">
      <label htmlFor={field.name} className="contact-label">
        {field.label} <span className="contact-label-hint">(required)</span>
      </label>
      {field.isMultiline ? (
        <textarea rows={5} {...sharedProps} />
      ) : (
        <input {...field.inputProps} {...sharedProps} />
      )}
      {hasError && (
        <p id={errorId} className="contact-field-error">
          <PiWarningBold aria-hidden="true" className="contact-status-icon" />
          {field.error}
        </p>
      )}
    </div>
  );
}

/**
 * The submit key: the panel's "=" key (signal orange), "=" printed on the cap
 * and hidden from assistive technology. Pointer presses travel through
 * `:active`; a keyboard press (or Enter in a field, which browsers turn into
 * a click on this button) holds the pressed state for the same 140 ms.
 * While sending it is aria-disabled, not disabled: a disabled button drops
 * focus to <body>, where Enter and "=" are page shortcuts. The cap stays
 * latched down until the result; the form ignores presses meanwhile.
 */
function SubmitKey({ isSending }) {
  const [isPressed, press] = usePressHold();

  return (
    <button
      type="submit"
      aria-disabled={isSending ? "true" : undefined}
      data-pressed={isPressed ? "" : undefined}
      // Keep focus in the field on mousedown: a blur error appearing above
      // would push the button out from under the pointer and lose the click.
      onMouseDown={(event) => event.preventDefault()}
      onClick={press}
      className="keycap keycap-signal contact-submit"
    >
      <span aria-hidden="true" className="keycap-glyph">
        =
      </span>
      <span>{isSending ? "Sending…" : "Send message"}</span>
    </button>
  );
}

/**
 * Contact (design-plan 7.6): the "=" output panel. One panel, two halves:
 * the display side (heading, intro, a 16x2 LCD that reports the form's
 * state, and "Or find me on" keys) and the input side (the form).
 *
 * The Formspree contract is unchanged: POST the form's FormData (name,
 * email, message) to VITE_FORMSPREE_ENDPOINT with Accept: application/json;
 * reset the form on success. With no endpoint configured nothing is sent,
 * the visitor keeps what they typed and is pointed to LinkedIn.
 *
 * Validation runs on blur (once a field has been edited, or after a submit
 * attempt) and on submit. A failed submit shows a focused error summary
 * linking to each field; each field's error is tied to it with
 * aria-describedby. Results are announced from two always-mounted regions
 * under the button: a polite status (sending, sent) and an alert (not sent,
 * not configured).
 */
const Contact = () => {
  const formRef = useRef(null);
  const summaryRef = useRef(null);
  const editedFields = useRef(new Set());
  const hasAttemptedSubmit = useRef(false);
  // The double-submit guard (the button stays enabled while sending). A ref,
  // not `phase`, so it does not depend on React having re-rendered with
  // SENDING before the next press arrives.
  const isSendingRef = useRef(false);
  const summaryTitleId = useId();
  const linksLabelId = useId();

  const [phase, setPhase] = useState(RESTING_PHASE);
  // Bumped on each submit of an unconfigured build: the alert is already on
  // screen, so its text is re-inserted to be announced again.
  const [unconfiguredNotice, setUnconfiguredNotice] = useState(0);
  const [errors, setErrors] = useState(NO_ERRORS);
  const [isSummaryShown, setIsSummaryShown] = useState(false);
  const [summaryFocusRequest, setSummaryFocusRequest] = useState(0);

  const invalidFields = FIELDS.filter((field) => errors[field.name]);
  // Once every field is fixed the summary is done; a later blur error does
  // not bring it back until the next failed submit.
  if (isSummaryShown && invalidFields.length === 0) setIsSummaryShown(false);
  const summaryFields = isSummaryShown ? invalidFields : [];
  const isSending = phase === PHASE.SENDING;
  const lcdRow = lcdStatusRow(phase, invalidFields.length);
  // The resting phase (READY, or USE LINKEDIN without an endpoint) waits on
  // the LCD for row 1 to finish typing, like READY always has.
  const isAtRest = phase === RESTING_PHASE && invalidFields.length === 0;

  // A failed submit moves focus to the summary once it is on the page.
  useEffect(() => {
    if (summaryFocusRequest > 0) summaryRef.current?.focus();
  }, [summaryFocusRequest]);

  const setFieldError = (name, hasError) => {
    setErrors((previous) => {
      if (Boolean(previous[name]) === hasError) return previous;
      const next = { ...previous };
      if (hasError) next[name] = true;
      else delete next[name];
      return next;
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    // Tabbing past an untouched field does not flag it.
    if (!editedFields.current.has(name) && !hasAttemptedSubmit.current) return;
    setFieldError(name, !FIELDS_BY_NAME[name].isValid(value));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    editedFields.current.add(name);
    // Starting a new message after a send: the LCD and status line stop
    // reporting the last one.
    if (phase === PHASE.SENT) setPhase(PHASE.READY);
    // While typing, an error can clear (as soon as the value is valid) but
    // never appear; new errors wait for blur or submit.
    if (errors[name] && FIELDS_BY_NAME[name].isValid(value)) setFieldError(name, false);
  };

  const focusField = (event, name) => {
    event.preventDefault();
    const form = formRef.current;
    form?.querySelector(`label[for="${name}"]`)?.scrollIntoView({ block: "center" });
    form?.elements.namedItem(name)?.focus({ preventScroll: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSendingRef.current) return;

    const form = event.currentTarget;
    const nextErrors = findInvalidFields(form);
    hasAttemptedSubmit.current = true;
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPhase(RESTING_PHASE);
      setIsSummaryShown(true);
      setSummaryFocusRequest((request) => request + 1);
      return;
    }
    setIsSummaryShown(false);

    // Without an endpoint there is nowhere to send the message. The form is not
    // reset, so the visitor keeps what they typed and can paste it elsewhere.
    if (!FORMSPREE_ENDPOINT) {
      console.warn(
        "Contact form: VITE_FORMSPREE_ENDPOINT is not set. The message was not sent.",
      );
      setPhase(PHASE.UNCONFIGURED);
      setUnconfiguredNotice((notice) => notice + 1);
      return;
    }

    const data = new FormData(form);
    isSendingRef.current = true;
    setPhase(PHASE.SENDING);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();
        editedFields.current.clear();
        hasAttemptedSubmit.current = false;
        setErrors(NO_ERRORS);
        setPhase(PHASE.SENT);
      } else {
        console.error(
          `Contact form: the endpoint answered HTTP ${response.status}. The message was not sent.`,
        );
        setPhase(PHASE.FAILED);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setPhase(PHASE.FAILED);
    } finally {
      isSendingRef.current = false;
    }
  };

  return (
    // At least one screen tall (minus the sticky bar), panel centred: Contact
    // is the last section, so without this a tall window runs out of page
    // before "=" can bring its top under the bar. svh, not dvh, so the
    // height does not change while a phone's address bar slides.
    <section
      id="contact"
      className="flex min-h-[calc(100svh-var(--bar-h))] items-center py-20 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-3 sm:px-6 lg:px-8">
        <div className="contact-panel">
          <div className="contact-intro">
            <h2
              tabIndex={-1}
              className="text-[32px] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink md:text-[40px] xl:text-[48px]"
            >
              Let's talk
            </h2>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink">
              <Led isLit />
              {AVAILABILITY}
            </p>
            <p className="mt-2 max-w-[44ch] text-base leading-relaxed text-slate lg:text-[17px]">
              Whether you have a question or just want to say hi, I'll get back to you.
            </p>
          </div>

          <ContactLcd statusRow={lcdRow} isReady={isAtRest} />

          <form ref={formRef} noValidate onSubmit={handleSubmit} className="contact-form">
            {summaryFields.length > 0 && (
              <div
                ref={summaryRef}
                role="group"
                tabIndex={-1}
                aria-labelledby={summaryTitleId}
                className="contact-summary"
              >
                <h3 id={summaryTitleId} className="contact-summary-title">
                  <PiWarningBold aria-hidden="true" className="contact-status-icon" />
                  {summaryFields.length === 1
                    ? "1 field needs attention"
                    : `${summaryFields.length} fields need attention`}
                </h3>
                <ul className="contact-summary-list">
                  {summaryFields.map((field) => (
                    <li key={field.name}>
                      <a
                        href={`#${field.name}`}
                        onClick={(event) => focusField(event, field.name)}
                        className="contact-inline-link"
                      >
                        {field.error}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {FIELDS.map((field) => (
              <ContactField
                key={field.name}
                field={field}
                hasError={Boolean(errors[field.name])}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            ))}

            <div>
              <SubmitKey isSending={isSending} />

              {/* Both regions stay mounted (empty when idle) so screen readers
                  have registered them before a result is inserted. */}
              <p role="status" aria-live="polite" className="contact-status">
                {isSending && <span className="sr-only">Sending…</span>}
                {phase === PHASE.SENT && (
                  <>
                    <PiCheckBold aria-hidden="true" className="contact-status-icon" />
                    <span>Message sent. I'll get back to you soon.</span>
                  </>
                )}
              </p>
              <p role="alert" className="contact-status">
                {phase === PHASE.FAILED && (
                  <>
                    <PiWarningBold aria-hidden="true" className="contact-status-icon" />
                    <span>
                      Message not sent. Check your connection and try again, or message me on{" "}
                      <LinkedInLink />.
                    </span>
                  </>
                )}
                {phase === PHASE.UNCONFIGURED && (
                  <Fragment key={unconfiguredNotice}>
                    <PiWarningBold aria-hidden="true" className="contact-status-icon" />
                    <span>
                      This form can't send messages right now. Message me on <LinkedInLink />{" "}
                      instead.
                    </span>
                  </Fragment>
                )}
              </p>
            </div>
          </form>

          <div className="contact-links">
            <p id={linksLabelId} className="text-sm font-semibold text-ink">
              Or find me on
            </p>
            <ul aria-labelledby={linksLabelId} className="contact-link-keys">
              {CONTACT_LINK_IDS.map((keyId) => (
                <li key={keyId}>
                  <ExternalKeyLink keyId={keyId} className="keycap-panel small-key">
                    <span className="keycap-legend">{KEYS_BY_ID[keyId].legend}</span>
                    <PiArrowUpRightBold aria-hidden="true" className="keycap-arrow" />
                  </ExternalKeyLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
