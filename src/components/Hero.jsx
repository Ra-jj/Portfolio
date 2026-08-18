import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { FlowButton } from "./ui/FlowButton";
import { HiArrowDown } from "react-icons/hi2";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

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
      {/* Soft top spotlight */}
      <div className="absolute inset-0 z-0 bg-radial-spot pointer-events-none" />

      {/* 3D Starfield */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars
            radius={120}
            depth={60}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </Canvas>
      </div>

      {/* Grid mask */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-full flex flex-col justify-center relative z-10 pt-24 sm:pt-0">
        <motion.div initial="hidden" animate="visible">
          {/* Status pill */}

          <motion.p
            custom={1}
            variants={fadeUp}
            className="text-accent font-medium tracking-[0.18em] uppercase text-xs sm:text-sm mb-4 sm:mb-6"
          >
            Hello, my name is
          </motion.p>

          <motion.h1
            custom={2}
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-4 sm:mb-6 leading-[0.95]"
          >
            <span className="text-white">Monodip</span>{" "}
            <span className="text-gradient">Bhattacharya.</span>
          </motion.h1>

          <motion.h2
            custom={3}
            variants={fadeUp}
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-300/90 mb-6 sm:mb-8 leading-tight max-w-4xl"
          >
            From <span className="text-white">Electronics Engineering</span> to
            crafting interactive digital experiences.
          </motion.h2>

          <motion.p
            custom={4}
            variants={fadeUp}
            className="text-slate-400 max-w-2xl text-base sm:text-lg mb-10 sm:mb-12 leading-relaxed"
          >
            I'm a full-stack developer with a background in electronics and IoT.
            I love bridging the gap between hardware and software, building
            scalable real-time systems, and creating visually engaging, modern
            web applications.
          </motion.p>

          <motion.div
            custom={5}
            variants={fadeUp}
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 sm:gap-5"
          >
            <FlowButton text="Explore My Journey" onClick={scrollToTimeline} />

            <FlowButton
              text="View Resume"
              as="a"
              href="/Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            />
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll cue */}
      <Link
        to="timeline"
        smooth
        duration={500}
        className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-slate-400 hover:text-accent transition-colors cursor-pointer group"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">
          scroll
        </span>
        <HiArrowDown className="group-hover:translate-y-1 transition-transform" />
      </Link>

      {/* Bottom fade overlay */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-primary to-transparent z-[5] pointer-events-none" />
    </section>
  );
};

export default Hero;
