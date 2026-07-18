import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import HeroMarquee from "./HeroMarquee";
import { ScrollMarquee } from "../ScrollMarquee";

const HeroInteractiveSection = lazy(() => import("./HeroInteractiveSection"));
import EyeFollowRobot from "./EyeFollowRobot";
import SketchyBorder from "../SketchyBorder";
import { 
  PANEL_1_URL, 
  PANEL_2_URL, 
  PANEL_3_URL, 
  LOADING_DURATION, 
  HERO_DATA 
} from "../../data/heroData";

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [triggerCount, setTriggerCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex(prev => (prev + 1) % 3);
      setTriggerCount(prev => prev + 1);
    }, LOADING_DURATION * 1000); // dynamic duration in milliseconds

    return () => clearTimeout(timer);
  }, [activeIndex, triggerCount]);

  const handleCardClick = (index) => {
    setActiveIndex(index);
    setTriggerCount(prev => prev + 1);
  };

  return (
    <div className="w-full lg:h-screen bg-canvas text-black flex flex-col pt-16 lg:pt-12 px-4 pb-[5px] md:px-6 overflow-y-auto lg:overflow-hidden relative select-none box-border">
      <style>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress-fill {
          animation-name: progress-fill;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
      {/* Interactive 3D Tech Constellation Overlay (Centered in full background) */}
      <Suspense fallback={null}>
        <HeroInteractiveSection activeIndex={activeIndex} />
      </Suspense>
      {/* Top Banner: Reusing the existing HeroMarquee but with red text styling */}
      <div className="w-full h-[15vh] overflow-hidden flex items-center justify-center shrink-0">
        <HeroMarquee 
          texts={["DEVELOPER", "ENGINEER", "CREATIVE", "SYSTEMS", "COMPILER", "ARCHITECTURE", "FULLSTACK"]}
          marqueeTextClassName="text-red-600/90 font-black tracking-tighter"
          speedMultiplier={0.25}
        />
      </div>

      {/* Split layout below the header (strictly fitted to the remaining flex height) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:flex-1 lg:min-h-0 items-stretch overflow-visible lg:overflow-hidden">
        
        <div className="lg:col-span-3 lg:order-2 relative overflow-visible flex flex-col justify-end h-[35vh] sm:h-[45vh] min-h-[250px] lg:min-h-0">
          <AnimatePresence mode="wait">
            <motion.video
              key={activeIndex}
              src={HERO_DATA[activeIndex].video}
              autoPlay
              muted
              loop
              playsInline
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full object-cover filter grayscale contrast-125 brightness-110 absolute inset-0"
              style={{ mixBlendMode: "var(--image-blend-mode, multiply)" }}
            />
          </AnimatePresence>

        </div>

        {/* Left Column (2/5 width visually): Detailed info grids fitted to 100% of height */}
        <div className="lg:col-span-2 lg:order-1 flex flex-col gap-6 lg:gap-4 lg:min-h-0 overflow-visible lg:overflow-hidden">

          {/* Black Divider before ME section */}
          {/* <div className="h-[1.35px] bg-black w-full shrink-0" /> */}

          {/* Row 3: ME + Description + Buttons (Fitted to 38% height, borderless, transparent parent) */}
          {/* Row 3: Decorative Zine Rectangle */}
          <div className="flex gap-4 items-stretch min-h-0 p-0 overflow-hidden shrink-0">
            <div className="w-full relative rounded-sm glow backdrop-blur-sm overflow-hidden flex items-center justify-center box-border">
              <ScrollMarquee 
                numRows={1}
                rowTexts={[["CREATING", "SCALABLE", "FUTURES"]]}
                className="text-neutral-800 dark:text-neutral-200 font-black tracking-tighter opacity-80 text-4xl sm:text-5xl"
                scrollerClassName=""
                speedMultiplier={0.3}
              />
            </div>
          </div>
          
          {/* Row 1: Exactly 3 panels (Horizontally rectangular aspect ratio) */}
          <div className="w-full aspect-[4.5] p-0 overflow-hidden shrink-0">
            {/* 3 Comic Panels side-by-side display cards */}
            <div className="grid grid-cols-3 gap-3 w-full h-full">
              {/* Panel 1 */}
              <div 
                className="group relative h-full cursor-pointer select-none"
                onClick={() => handleCardClick(0)}
              >
                <div className="w-full h-full overflow-hidden relative bg-neutral-100">
                  {/* Red Loading Progress Bar Background (Horizontal) - Lighter Red */}
                  {activeIndex === 0 && (
                    <div 
                      key={triggerCount}
                      className="absolute left-0 top-0 bottom-0 bg-red-400 animate-progress-fill"
                      style={{ animationDuration: `${LOADING_DURATION}s` }}
                    />
                  )}
                  <img
                    src={PANEL_1_URL}
                    alt="Manga Panel 1"
                    className={`w-full h-full object-cover relative z-10 transition-all duration-300 pointer-events-none ${
                      activeIndex === 0 ? "mix-blend-multiply filter grayscale contrast-125 brightness-110" : "filter grayscale contrast-125 brightness-105"
                    }`}
                  />
                </div>
                <SketchyBorder isImage={true} className="group-hover:text-(--color-accent-brand) transition-colors duration-300" />
              </div>
              {/* Panel 2 */}
              <div 
                className="group relative h-full cursor-pointer select-none"
                onClick={() => handleCardClick(1)}
              >
                <div className="w-full h-full overflow-hidden relative bg-neutral-100">
                  {/* Red Loading Progress Bar Background (Horizontal) - Lighter Red */}
                  {activeIndex === 1 && (
                    <div 
                      key={triggerCount}
                      className="absolute left-0 top-0 bottom-0 bg-red-400 animate-progress-fill"
                      style={{ animationDuration: `${LOADING_DURATION}s` }}
                    />
                  )}
                  <img
                    src={PANEL_2_URL}
                    alt="Manga Panel 2"
                    className={`w-full h-full object-cover relative z-10 transition-all duration-300 pointer-events-none ${
                      activeIndex === 1 ? "mix-blend-multiply filter grayscale contrast-125 brightness-110" : "filter grayscale contrast-125 brightness-105"
                    }`}
                  />
                </div>
                <SketchyBorder isImage={true} className="group-hover:text-(--color-accent-brand) transition-colors duration-300" />
              </div>
              {/* Panel 3 */}
              <div 
                className="group relative h-full cursor-pointer select-none"
                onClick={() => handleCardClick(2)}
              >
                <div className="w-full h-full overflow-hidden relative bg-neutral-100">
                  {/* Red Loading Progress Bar Background (Horizontal) - Lighter Red */}
                  {activeIndex === 2 && (
                    <div 
                      key={triggerCount}
                      className="absolute left-0 top-0 bottom-0 bg-red-400 animate-progress-fill"
                      style={{ animationDuration: `${LOADING_DURATION}s` }}
                    />
                  )}
                  <img
                    src={PANEL_3_URL}
                    alt="Manga Panel 3"
                    className={`w-full h-full object-cover relative z-10 transition-all duration-300 pointer-events-none ${
                      activeIndex === 2 ? "mix-blend-multiply filter grayscale contrast-125 brightness-110" : "filter grayscale contrast-125 brightness-105"
                    }`}
                  />
                </div>
                <SketchyBorder isImage={true} className="group-hover:text-(--color-accent-brand) transition-colors duration-300" />
              </div>
            </div>
          </div>

          {/* Grouped Block: Row 2 and Quote to remove the space between them */}
          <div className="flex flex-col gap-2 lg:gap-1.5 shrink-0 lg:mt-auto">
            {/* Row 2: Concept description block without black background/texture */}
            <div className="flex flex-col gap-1.5 shrink-0 h-auto lg:min-h-[94px] justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col gap-1.5 w-full"
                >
                  <h4 className="text-red-600 font-grotesk font-bold text-xs uppercase tracking-widest">
                    {HERO_DATA[activeIndex].heading}
                  </h4>
                  <div className="font-grotesk text-[10px] md:text-xs tracking-wider leading-relaxed text-black">
                    <div className="uppercase text-neutral-800 w-full text-justify">
                      {HERO_DATA[activeIndex].description}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Serif Tagline Quote - styled with black texture, border, and white text */}
            <div className="w-full bg-black-textured text-white p-2 shrink-0 min-h-[46px] flex items-center relative">
              <SketchyBorder isImage={true} className="text-red-600/90" />
              <AnimatePresence mode="wait">
                <motion.p 
                  key={activeIndex}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="w-full font-playfair italic text-xs md:text-sm lg:text-[15px] text-neutral-200 select-text leading-none"
                  style={{ textAlign: "justify", textAlignLast: "justify" }}
                >
                  {HERO_DATA[activeIndex].quote}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      {/* Interactive Eye Tracking Robot - positioned relative to full hero section */}
      <EyeFollowRobot />

      {/* Hidden preloader for videos to prevent transition flash */}
      <div className="hidden" aria-hidden="true">
        {HERO_DATA.map((item, idx) => (
          <video key={idx} src={item.video} preload="auto" muted />
        ))}
      </div>
    </div>
  </div>
  );
};

export default Hero;
