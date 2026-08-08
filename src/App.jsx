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
    <div className="bg-primary min-h-screen text-slate-200 selection:bg-accent/30 selection:text-accent relative">
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

      <footer className="py-8 sm:py-12 bg-primary text-center border-t border-slate-800 flex flex-col items-center px-4">
        <div className="flex gap-6 mb-6">
          <a
            href="https://github.com/Ra-jj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://linkedin.com/in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Monodip Bhattacharya
        </p>
      </footer>
      </div>
    </div>
  );
}

export default App;
