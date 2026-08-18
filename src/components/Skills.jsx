import { motion } from "framer-motion";
import { skillGroups } from "../constants/skills";

const containerVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const Skills = () => {
  return (
    <section
      id="skills"
      className="py-20 md:py-32 bg-secondary/30 relative w-full border-y border-white/5"
    >
      <div className="absolute inset-0 pointer-events-none bg-grid-fade opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block chip mb-4">stack</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Skills gained
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Tools and technologies I've picked up along my journey to build
            better digital experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {skillGroups.map((group, index) => (
            <motion.div
              key={index}
              variants={containerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="group relative surface rounded-2xl p-6 shadow-card hover:glow-ring transition-all duration-300"
            >
              <div className="relative flex items-center gap-3 mb-3">
                <span className="grid place-items-center h-9 w-9 rounded-lg bg-accent/10 border border-accent/20 text-accent font-mono text-sm font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {group.title}
                </h3>
              </div>
              <p className="relative text-sm text-slate-400 mb-6 leading-relaxed">
                {group.description}
              </p>

              <div className="relative grid grid-cols-2 gap-3">
                {group.skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariant}
                    whileHover={{ y: -2 }}
                    className="relative flex flex-col items-center justify-center p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-accent/[0.08] hover:border-accent/40 transition-all group/skill overflow-hidden"
                  >
                    <skill.icon
                      className={`text-3xl mb-2 ${skill.color} group-hover/skill:scale-110 group-hover/skill:rotate-3 transition-transform duration-300`}
                    />
                    <span className="text-[11px] font-medium text-slate-300 text-center tracking-tight">
                      {skill.name}
                    </span>
                    <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 group-hover/skill:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
