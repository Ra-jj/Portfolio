import { AVAILABILITY } from "../constants/navigation";
import Calculator from "./calculator/Calculator";
import Led from "./calculator/Led";

/**
 * Hero (design-plan 7.1): split at lg (text in columns 1-5, the calculator
 * right-aligned in 6-12); stacked below lg, with the calculator
 * right-aligned under the text from md and left-aligned on phones. The
 * calculator's keys are the hero's calls to action.
 */
const Hero = () => (
  <section id="hero" className="flex min-h-[100dvh] items-center py-6 md:py-16">
    <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-3 sm:px-6 md:gap-10 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8">
      <div className="lg:col-span-5">
        <h1
          tabIndex={-1}
          className="text-[40px] font-extrabold leading-none tracking-[-0.02em] text-ink sm:text-[50px] xl:text-[60px]"
        >
          <span className="block">Monodip</span>
          <span className="block">Bhattacharya</span>
        </h1>

        <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-slate md:mt-6 lg:text-[17px]">
          Full-stack developer with an electronics background. I build real-time web apps with
          React, Node and MongoDB.
        </p>

        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <Led isLit />
          {AVAILABILITY}
        </p>
      </div>

      <div className="flex sm:justify-end lg:col-span-7">
        <Calculator />
      </div>
    </div>
  </section>
);

export default Hero;
