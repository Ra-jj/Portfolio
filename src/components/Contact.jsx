import { useState } from "react";
import { motion } from "framer-motion";
import { FlowButton } from "./ui/FlowButton";

// Vite inlines VITE_* variables at build time, so this value is fixed for the
// lifetime of the bundle and only needs reading once.
const FORMSPREE_ENDPOINT = (import.meta.env.VITE_FORMSPREE_ENDPOINT ?? "").trim();
const LINKEDIN_URL =
  "https://www.linkedin.com/in/monodip-bhattacharya-b31768327/";

const Contact = () => {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Without an endpoint there is nowhere to send the message. The form is not
    // reset, so the visitor keeps what they typed and can paste it elsewhere.
    if (!FORMSPREE_ENDPOINT) {
      console.warn(
        "Contact form: VITE_FORMSPREE_ENDPOINT is not set. The message was not sent.",
      );
      setStatus("unconfigured");
      return;
    }

    setStatus("submitting");

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-32 bg-secondary/30 relative w-full border-t border-white/5"
    >
      <div className="absolute inset-0 pointer-events-none bg-grid-fade opacity-50" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block chip mb-4">contact</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Let's <span className="text-gradient-static">connect</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            I'm currently looking for new opportunities. Whether you have a
            question or just want to say hi, I'll try my best to get back to
            you!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="relative surface rounded-2xl p-5 sm:p-8 shadow-card overflow-hidden"
        >
          {/* corner glow */}
          <span className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <span className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-glow/10 blur-3xl pointer-events-none" />

          <div className="relative space-y-5 sm:space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-[11px] font-mono uppercase tracking-[0.2em] text-accent/80 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 bg-secondary-2 border border-white/10 rounded-lg focus-accent text-white placeholder:text-slate-500 transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-mono uppercase tracking-[0.2em] text-accent/80 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-secondary-2 border border-white/10 rounded-lg focus-accent text-white placeholder:text-slate-500 transition-all"
                placeholder="leo@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-[11px] font-mono uppercase tracking-[0.2em] text-accent/80 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 bg-secondary-2 border border-white/10 rounded-lg focus-accent text-white placeholder:text-slate-500 transition-all resize-none"
                placeholder="What's on your mind?"
              ></textarea>
            </div>

            <FlowButton
              text={status === "submitting" ? "Sending..." : "Send Message"}
              as="button"
              type="submit"
              disabled={status === "submitting"}
              className="w-full justify-center py-4 disabled:opacity-70 disabled:cursor-not-allowed"
            />

            {/* Always mounted so screen readers register the live region before
                a message is inserted. empty:!mt-0 stops the parent's space-y gap
                from adding blank space under the button while no message shows. */}
            <div aria-live="polite" className="empty:!mt-0">
              {status === "success" && (
                <p className="text-emerald-400 text-center mt-2 font-medium">
                  ✓ Message sent — I'll get back to you soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-center mt-2 font-medium">
                  ✕ Something went wrong. Please try again.
                </p>
              )}
              {status === "unconfigured" && (
                <p className="text-red-400 text-center mt-2 font-medium">
                  ✕ Messages can't be sent from this form right now. Please
                  reach me on{" "}
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-4 hover:text-accent-bright transition-colors"
                  >
                    LinkedIn
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </motion.form>

      </div>
    </section>
  );
};

export default Contact;
