import { motion } from 'framer-motion';
import { projects } from '../constants/projects';
import { HiOutlineExternalLink, HiOutlineCode } from 'react-icons/hi';
import { BorderBeamPanel } from './ui/BorderBeamPanel';

const Projects = () => {
  return (
    <section id="projects" className="py-12 md:py-24 bg-primary relative w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Featured Projects</h2>
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
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col h-full shadow-xl group"
            >
              <BorderBeamPanel 
                beams={2} 
                thickness={2} 
                radius={12} 
                glow={true} 
                hoverSpeed={120}
                colors={['#38bdf8', '#f43f5e']}
                className="group flex flex-col h-full w-full p-0 border-slate-800 bg-secondary"
              >
                {/* Project Image Placeholder */}
                <div className="h-40 sm:h-48 overflow-hidden relative rounded-t-[12px]">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-20"
                  />
                </div>

                {/* Project Content */}
                <div className="p-6 flex flex-col flex-grow relative z-20">
                  <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-slate-400 mb-6 text-sm flex-grow">
                    {project.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4 mt-auto">
                    <a 
                      href={project.sourceCode} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      <HiOutlineCode size={20} />
                      Code
                    </a>
                    {project.liveDemo && (
                      <a 
                        href={project.liveDemo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                      >
                        <HiOutlineExternalLink size={20} />
                        Live Demo
                      </a>
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
