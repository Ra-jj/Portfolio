import { motion } from "framer-motion";
import { HiOutlineCode, HiOutlineExternalLink } from "react-icons/hi";
import { cn } from "../lib/utils";
import { BorderBeam } from "border-beam";

const TimelineItem = ({ data, isLeft }) => {
  return (
    <div
      className={cn(
        "mb-12 sm:mb-16 flex items-center w-full right-timeline",
        isLeft ? "md:justify-start" : "md:justify-end",
        "justify-start",
      )}
    >
      {/* Center dot with glow */}
      <div className="z-20 hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
        <span className="absolute inline-flex h-5 w-5 rounded-full bg-accent opacity-60 blur-md animate-pulse-glow" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-accent ring-4 ring-primary shadow-glow" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: isLeft ? 50 : -50, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.35 }}
        className={cn(
          "w-full md:w-5/12 relative",
          isLeft ? "md:text-right" : "md:text-left",
        )}
      >
        <BorderBeam size="line" colorVariant="colorful" duration={3.1} borderRadius={16}>
          <div className="relative group surface rounded-2xl px-5 sm:px-7 py-6 sm:py-7 shadow-card hover:glow-ring transition-shadow duration-300 md:pl-7 w-full h-full">
            {/* Hover sheen */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-accent/10 via-transparent to-transparent" />

            <span className="relative font-mono text-[11px] tracking-[0.2em] uppercase text-accent mb-2 block">
              {data.date}
            </span>
            <h3 className="relative font-bold text-xl sm:text-2xl text-white mb-2 sm:mb-3 tracking-tight">
              {data.title}
            </h3>
            <p className="relative text-slate-300/90 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base">
              {data.description}
            </p>

            {data.skillsLearned && data.skillsLearned.length > 0 && (
              <div
                className={cn(
                  "relative flex flex-wrap gap-2 mb-4",
                  isLeft ? "md:justify-end" : "justify-start",
                )}
              >
                {data.skillsLearned.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/5 border border-white/10 text-slate-200 rounded-full text-xs font-medium hover:border-accent/50 hover:text-accent transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {data.projects && data.projects.length > 0 && (
              <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "group/proj relative p-4 rounded-xl bg-secondary-2/60 border border-white/5 hover:border-accent/40 transition-all overflow-hidden flex flex-col items-center justify-center text-center",
                      data.projects.length === 1 ? "sm:col-span-2" : ""
                    )}
                  >
                    <h4 className="text-white font-bold text-base sm:text-lg mb-1.5">
                      {proj.name}
                    </h4>
                    <div className="flex flex-row gap-4 mt-2">
                      {proj.link && !proj.isLive && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-xs text-slate-300 hover:text-accent transition-colors">
                          <HiOutlineCode size={16} /> View code
                        </a>
                      )}
                      {(proj.isLive || proj.liveLink) && (
                        <a href={proj.liveLink || proj.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-xs text-slate-300 hover:text-accent transition-colors">
                          <HiOutlineExternalLink size={16} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </BorderBeam>
      </motion.div>
    </div>
  );
};

export default TimelineItem;
