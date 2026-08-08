import { motion } from 'framer-motion';
import { skillGroups } from '../constants/skills';

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Skills = () => {
  return (
    <section id="skills" className="py-12 md:py-24 bg-secondary/20 relative w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Skills Gained</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Tools and technologies I've picked up along my journey to build better digital experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {skillGroups.map((group, index) => (
            <motion.div
              key={index}
              variants={containerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="bg-primary/50 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-lg hover:border-slate-700 transition-colors"
            >
              <h3 className="text-xl font-bold text-white mb-2">{group.title}</h3>
              <p className="text-sm text-slate-400 mb-6">{group.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                {group.skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariant}
                    className="flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-xl hover:bg-slate-700/50 transition-colors group"
                  >
                    <skill.icon className={`text-3xl mb-2 ${skill.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-xs font-medium text-slate-300 text-center">{skill.name}</span>
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
