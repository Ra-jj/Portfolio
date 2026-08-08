import { motion } from 'framer-motion';
import { HiOutlineCode } from 'react-icons/hi';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlowingShadow } from './ui/GlowingShadow';

// Utility for class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TimelineItem = ({ data, isLeft }) => {
  return (
    <div className={cn(
      "mb-12 sm:mb-16 flex justify-between items-center w-full right-timeline",
      isLeft ? "flex-row-reverse" : "flex-row",
      "md:odd:flex-row-reverse md:even:flex-row flex-col"
    )}>
      
      {/* Spacer for alternating layout on desktop */}
      <div className="order-1 hidden md:block md:w-5/12"></div>
      
      {/* Center dot */}
      <div className="z-20 hidden md:flex items-center order-1 bg-accent shadow-xl w-8 h-8 rounded-full border-4 border-primary absolute left-6 md:left-1/2 -translate-x-1/2"></div>
      
      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 50 : -50, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className={cn(
          "order-1 w-full md:w-5/12",
          isLeft ? "md:text-right" : "md:text-left"
        )}
      >
        <GlowingShadow className="rounded-xl shadow-xl px-4 sm:px-6 py-5 sm:py-6 border border-slate-800 bg-secondary/50 backdrop-blur-sm pl-12 sm:pl-16 md:pl-6">
          <span className="text-accent font-semibold tracking-wide text-sm mb-2 block">{data.date}</span>
          <h3 className="font-bold text-xl sm:text-2xl text-white mb-2 sm:mb-3">{data.title}</h3>
          <p className="text-slate-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
            {data.description}
          </p>
          
          {/* Skills Tags */}
          {data.skillsLearned && data.skillsLearned.length > 0 && (
            <div className={cn("flex flex-wrap gap-2 mb-4", isLeft ? "md:justify-end" : "justify-start")}>
              {data.skillsLearned.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-primary border border-slate-700 text-slate-300 rounded-full text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Highlighted Projects from Timeline */}
          {data.projects && data.projects.length > 0 && (
            <div className="mt-6 flex flex-col gap-4">
              {data.projects.map((proj, idx) => (
                <div key={idx} className={cn(
                  "p-4 rounded-lg bg-primary/50 border border-slate-700 flex flex-col sm:flex-row gap-4 items-start sm:items-center",
                  isLeft ? "md:flex-row-reverse" : ""
                )}>
                  <div className="flex-1">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Milestone Project</span>
                    <h4 className="text-white font-bold text-lg">{proj.name}</h4>
                  </div>
                  <a 
                    href={proj.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:text-sky-300 transition-colors font-medium relative z-10"
                  >
                    <HiOutlineCode size={18} />
                    View Code
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Fallback for single project in case data hasn't been migrated */}
          {data.project && !data.projects && (
            <div className={cn(
              "mt-6 p-4 rounded-lg bg-primary/50 border border-slate-700 flex flex-col sm:flex-row gap-4 items-start sm:items-center",
              isLeft ? "md:flex-row-reverse" : ""
            )}>
              <div className="flex-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Milestone Project</span>
                <h4 className="text-white font-bold text-lg">{data.project.name}</h4>
              </div>
              <a 
                href={data.project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent hover:text-sky-300 transition-colors font-medium relative z-10"
              >
                <HiOutlineCode size={18} />
                View Code
              </a>
            </div>
          )}
        </GlowingShadow>
      </motion.div>
    </div>
  );
};

export default TimelineItem;
