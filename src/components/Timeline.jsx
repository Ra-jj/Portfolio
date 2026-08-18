import { journey } from "../constants/journey";
import TimelineItem from "./TimelineItem";
import { motion } from "framer-motion";

const SectionHeader = ({ kicker, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16"
  >
    <span className="inline-block chip mb-4">{kicker}</span>
    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
      {title}
    </h2>
    <p className="text-slate-400 max-w-2xl mx-auto text-lg">{subtitle}</p>
  </motion.div>
);

const Timeline = () => {
  return (
    <section id="timeline" className="py-20 md:py-32 bg-primary relative w-full">
      {/* Subtle accent backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-grid-fade opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative">
        <SectionHeader
          kicker="journey"
          title="How I got here"
          subtitle="A look back at the milestones, lessons, and turning points that shaped how I build today."
        />

        <div className="relative wrap p-2 sm:p-4 h-full">
          {/* Vertical line with gradient */}
          <div className="absolute left-[28px] md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px]">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
          </div>

          {journey.map((item, index) => (
            <TimelineItem
              key={item.id}
              data={item}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
