import { Fragment } from "react";
import { PiArrowUpRightBold, PiCodeBold } from "react-icons/pi";
import { projects } from "../constants/projects";
import { usePressHold } from "../hooks/usePressHold";

/**
 * A small outlined panel key that opens a project link in a new tab. Same
 * cap, skirt and 2 px press travel as the hero keys (`.keycap`); keyboard
 * activation holds the pressed state too. External, so no preventDefault:
 * the browser opens the tab natively.
 */
function ProjectKey({ href, legend, label, Icon }) {
  const [isPressed, press] = usePressHold();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-pressed={isPressed ? "" : undefined}
      onClick={press}
      className="keycap keycap-panel project-key"
    >
      <Icon aria-hidden="true" className="project-key-icon" />
      <span className="keycap-legend">{legend}</span>
    </a>
  );
}

/** The two links, in reading order. One label per intent across the page. */
function projectLinks(project) {
  return [
    project.sourceCode && {
      href: project.sourceCode,
      legend: "Source code",
      label: `${project.title} source code on GitHub (opens in a new tab)`,
      Icon: PiCodeBold,
    },
    project.liveDemo && {
      href: project.liveDemo,
      legend: "Live demo",
      label: `${project.title} live demo (opens in a new tab)`,
      Icon: PiArrowUpRightBold,
    },
  ].filter(Boolean);
}

/**
 * One rack module: the real screenshot in a slate screen bezel (a fixed
 * 16:10 frame, so nothing shifts while it lazily loads), then the details
 * with the link keys pinned to the bottom. The module itself has no hover;
 * only its keys are interactive.
 */
function RackModule({ project }) {
  const links = projectLinks(project);

  return (
    <li className="rack-module">
      <div className="screen-bezel rack-bezel">
        <img
          src={project.image}
          alt={project.alt}
          width={project.width}
          height={project.height}
          loading="lazy"
          decoding="async"
          className="rack-screen"
          style={project.objectPosition ? { objectPosition: project.objectPosition } : undefined}
        />
      </div>

      <div className="rack-details">
        <div className="rack-text">
          <h3 className="text-2xl font-bold leading-[1.1] text-ink sm:text-[28px] lg:text-[32px]">
            {project.title}
          </h3>
          <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-slate lg:text-[17px]">
            {project.description}
          </p>
          <dl className="rack-stack">
            <dt className="font-semibold text-ink">Stack</dt>
            <dd className="text-slate">
              {/* Each name stays whole ("GitHub Actions" never splits); lines
                  only break at the ", " between names. */}
              {project.tags.map((tag, index) => (
                <Fragment key={tag}>
                  {index > 0 && ", "}
                  <span className="whitespace-nowrap">{tag}</span>
                </Fragment>
              ))}
            </dd>
          </dl>
        </div>

        {links.length > 0 && (
          <div className="rack-keys">
            {links.map((link) => (
              <ProjectKey key={link.legend} {...link} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

/**
 * Projects (design-plan 7.4): one full-width rack module per project,
 * stacked in one list. lg+: screenshot in columns 1-7, details in 8-12.
 * md: stacked, with the details split into text and keys. Phones: stacked,
 * the two keys side by side (one under the other below 360 px).
 */
const Projects = () => (
  <section id="projects" className="py-20 md:py-24">
    <div className="mx-auto max-w-[1200px] px-3 sm:px-6 lg:px-8">
      <h2
        tabIndex={-1}
        className="text-[32px] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink md:text-[40px] xl:text-[48px]"
      >
        Featured projects
      </h2>
      <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-slate lg:text-[17px]">
        A deeper dive into some of the things I've built.
      </p>

      <ul className="mt-10 grid gap-6 md:mt-12">
        {projects.map((project) => (
          <RackModule key={project.id} project={project} />
        ))}
      </ul>
    </div>
  </section>
);

export default Projects;
