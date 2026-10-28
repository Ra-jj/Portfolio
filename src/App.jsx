import Hero from "./components/Hero";
import Timeline from "./components/Timeline";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import StickyBar from "./components/StickyBar";
import { InstrumentProvider } from "./context/InstrumentContext";

// No overflow clipping wrapper here: overflow hidden on an ancestor breaks
// position: sticky (the sticky bar and the Journey printer).
function App() {
  return (
    <InstrumentProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-skip focus:rounded-lg focus:bg-panel focus:px-4 focus:py-3 focus:font-semibold focus:text-ink focus:shadow-device"
      >
        Skip to content
      </a>

      <StickyBar />

      <main id="main" tabIndex={-1}>
        <Hero />
        <Timeline />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </InstrumentProvider>
  );
}

export default App;
