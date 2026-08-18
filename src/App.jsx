import AnimatedNav from "./components/ui/AnimatedNav";
import Hero from "./components/Hero";
import Timeline from "./components/Timeline";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Cursor from "./components/ui/Cursor";
import WebStrings from "./components/ui/WebStrings";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function App() {
  return (
    <div className="bg-primary min-h-screen text-slate-200 selection:bg-accent/30 selection:text-accent relative overflow-hidden">
      <WebStrings />
      <Cursor />
      <div className="relative z-10">
        <AnimatedNav />

        <main>
          <Hero />
          <Timeline />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <footer className="relative py-10 sm:py-14 bg-primary text-center border-t border-white/5 flex flex-col items-center px-4">
          <div className="hairline w-24 h-px mb-8" />
          <div className="flex gap-3 mb-6">
            <a
              href="https://github.com/Ra-jj"
              target="_blank"
              rel="noopener noreferrer"
              className="group grid place-items-center h-11 w-11 rounded-xl surface hover:glow-ring transition-all"
              aria-label="GitHub"
            >
              <FaGithub size={20} className="text-slate-300 group-hover:text-accent transition-colors" />
            </a>
            <a
              href="https://linkedin.com/in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group grid place-items-center h-11 w-11 rounded-xl surface hover:glow-ring transition-all"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} className="text-slate-300 group-hover:text-accent transition-colors" />
            </a>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white font-semibold tracking-tight">
              Monodip
            </span>
            <span className="text-accent font-semibold">.</span>
          </div>
          <p className="text-slate-500 text-xs font-mono">
            © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
