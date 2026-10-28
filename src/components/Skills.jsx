import { skillGroups } from "../constants/skills";

/**
 * One band of the dial: its label (title and description), then its scale.
 * Each skill is a printed station, its name above a major tick; the minor
 * ticks are a gradient on the scale line. Position means category, never
 * level. Stations are plain list items: not focusable, no action.
 *
 * The pointer is decoration for hover-capable devices only: CSS moves it to
 * the hovered station (`:has()` sets --pointer-index, see .band-scale in
 * src/index.css). Nothing reads it, so it is hidden from assistive tech.
 */
function Band({ group }) {
  return (
    <div className="band">
      <div className="band-label">
        <h3 className="text-lg font-semibold leading-snug text-ink">{group.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate">{group.description}</p>
      </div>

      <div className="band-scale">
        <ul className="band-stations">
          {group.skills.map((name) => (
            <li key={name} className="band-station">
              <span className="band-station-name">{name}</span>
              <span aria-hidden="true" className="band-station-tick" />
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="band-pointer" />
      </div>
    </div>
  );
}

/**
 * Skills (design-plan 7.5): a radio band scale. Five bands inside one panel,
 * separated by hairlines. lg+: label in columns 1-3, scale in 4-12 with four
 * equal stations. md: label above, four stations in a row. Phones: label,
 * then the stations two by two.
 */
const Skills = () => (
  <section id="skills" className="py-20 md:py-24">
    <div className="mx-auto max-w-[1200px] px-3 sm:px-6 lg:px-8">
      <h2
        tabIndex={-1}
        className="text-[32px] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink md:text-[40px] xl:text-[48px]"
      >
        Skills gained
      </h2>
      <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-slate lg:text-[17px]">
        Tools and technologies I've picked up along my journey to build better digital
        experiences.
      </p>

      <div className="band-panel mt-10 md:mt-12">
        {skillGroups.map((group) => (
          <Band key={group.title} group={group} />
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
