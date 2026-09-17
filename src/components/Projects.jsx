import { motion } from "framer-motion";
import {
  projects,
  COLD_START_HINT,
  COLD_START_TITLE,
} from "../constants/projects";
import { HiOutlineExternalLink, HiOutlineCode } from "react-icons/hi";
import { BorderBeamPanel } from "./ui/BorderBeamPanel";

const Projects = () => {
  return (
    <section id="projects" className="py-20 md:py-32 bg-primary relative w-full">
      <div className="absolute inset-0 pointer-events-none bg-grid-fade opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block chip mb-4">work</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Featured <span className="text-gradient-static">projects</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A deeper dive into some of the things I've built.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="flex flex-col h-full group"
            >
              <BorderBeamPanel
                beams={2}
                thickness={2}
                radius={14}
                glow
                hoverSpeed={120}
                colors={["#38bdf8", "#22d3ee"]}
                className="group flex flex-col h-full w-full p-0 border-white/5 bg-secondary-2 shadow-card"
              >
                {/* Project Image */}
                <div className="relative h-44 sm:h-52 overflow-hidden rounded-t-[14px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-2 via-secondary-2/40 to-transparent z-10" />
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500 z-10" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out relative z-0"
                  />
                </div>

                {/* Project Content */}
                <div className="p-6 flex flex-col flex-grow relative z-20">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono uppercase tracking-wider text-slate-300 bg-white/5 border border-white/10 px-2 py-1 rounded hover:border-accent/40 hover:text-accent transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* The hint stays on the same row as the links so every card's
                      footer keeps one height and the rows line up across the grid.
                      flex-wrap is only a fallback if the row cannot fit. */}
                  <div className="flex flex-wrap items-center gap-5 gap-y-2 mt-auto pt-4 border-t border-white/5">
                    <a
                      href={project.sourceCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-accent transition-colors"
                    >
                      <HiOutlineCode size={18} /> Code
                    </a>
                    {project.liveDemo && (
                      <span className="inline-flex items-center gap-2">
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={project.coldStart ? COLD_START_TITLE : undefined}
                          className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-accent transition-colors"
                        >
                          <HiOutlineExternalLink size={18} /> Live
                        </a>
                        {project.coldStart && (
                          <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                            {COLD_START_HINT}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </BorderBeamPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
