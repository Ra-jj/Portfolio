/** Two-digit sequence numbers, as a receipt prints them: 01, 02. */
function padTwoDigits(value) {
  return String(value).padStart(2, "0");
}

/**
 * A project milestone's line: the project name, then its links as plain
 * underlined text (a printer cannot print buttons). The two links stay
 * together and wrap under the name as a unit on narrow paper.
 */
function ReceiptProject({ project }) {
  const links = [
    project.link && {
      href: project.link,
      text: "Source code",
      label: `${project.name} source code on GitHub (opens in a new tab)`,
    },
    project.liveLink && {
      href: project.liveLink,
      text: "Live demo",
      label: `${project.name} live demo (opens in a new tab)`,
    },
  ].filter(Boolean);

  return (
    <div className="receipt-project">
      <p className="receipt-project-name">{project.name}</p>
      {links.length > 0 && (
        <p className="receipt-links">
          {links.map((link) => (
            <a
              key={link.text}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="receipt-link"
            >
              {link.text}
            </a>
          ))}
        </p>
      )}
    </div>
  );
}

/**
 * One milestone on the Journey receipt (design-plan 7.3): a dashed thermal
 * separator, the sequence number and date on one line, the title, the
 * description, the skills as "+ Skill" lines and, for project milestones, the
 * project with its source and demo links.
 *
 * `data-receipt-entry` is how the printer finds the entries it counts.
 *
 * @param {{ entry: (typeof import("../../constants/journey").journey)[number], sequence: number }} props
 */
export default function ReceiptEntry({ entry, sequence }) {
  const skills = entry.skillsLearned ?? [];
  const projects = entry.projects ?? [];

  return (
    <li data-receipt-entry="" className="receipt-entry">
      <p className="receipt-line">
        <span>{padTwoDigits(sequence)}</span>
        <span>{entry.date}</span>
      </p>
      <h3 className="receipt-title">{entry.title}</h3>
      <p className="receipt-description">{entry.description}</p>

      {skills.length > 0 && (
        <ul aria-label="Skills learned" className="receipt-items">
          {skills.map((skill) => (
            <li key={skill} className="receipt-item">
              <span aria-hidden="true">+</span>
              <span>{skill}</span>
            </li>
          ))}
        </ul>
      )}

      {projects.map((project) => (
        <ReceiptProject key={project.name} project={project} />
      ))}
    </li>
  );
}
