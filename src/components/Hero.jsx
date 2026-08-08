import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { FlowButton } from "./ui/FlowButton";

const Hero = () => {
  const scrollToTimeline = () => {
    const el = document.getElementById("timeline");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative w-full h-[100dvh] md:h-screen mx-auto overflow-hidden bg-primary"
    >
      {/* Subtle 3D Background Accent */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-full flex flex-col justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-accent font-medium tracking-wide mb-4 sm:mb-4 text-base sm:text-lg">
            Hello, my name is
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">
            Monodip Bhattacharya
          </h1>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-400 mb-6 sm:mb-8 leading-tight">
            From Electronics Engineering to crafting{" "}
            <br className="hidden sm:block" /> interactive digital experiences.
          </h2>
          <p className="text-slate-300 max-w-2xl text-base sm:text-xl mb-10 sm:mb-12 leading-relaxed">
            I'm a full-stack developer with a background in electronics and IoT.
            I love bridging the gap between hardware and software, building
            scalable real-time systems, and creating visually engaging, modern
            web applications.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 sm:gap-6">
            <FlowButton 
              text="Explore My Journey" 
              onClick={scrollToTimeline}
            />

            <FlowButton
              text="View Resume"
              as="a"
              href="/Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade overlay for smooth transition to next section */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-primary to-transparent z-10" />
    </section>
  );
};

export default Hero;
