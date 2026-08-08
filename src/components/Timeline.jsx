import { journey } from '../constants/journey';
import TimelineItem from './TimelineItem';
import { motion } from 'framer-motion';

const Timeline = () => {
  return (
    <section id="timeline" className="py-12 md:py-24 bg-primary relative w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">My Journey</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A look back at how I got here, what I've learned, and the milestones along the way.
          </p>
        </motion.div>

        <div className="relative wrap overflow-hidden p-2 sm:p-4 h-full">
          {/* Vertical line */}
          <div className="absolute border-opacity-20 border-slate-500 h-full border-l-2 left-[28px] md:left-1/2 -translate-x-1/2"></div>
          
          {/* Mapping over journey data */}
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
