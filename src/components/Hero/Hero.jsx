import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import HeroMarquee from "./HeroMarquee";

// Stable black-and-white sketch URLs from the original portfolio configuration
const MAIN_SKETCH_URL = "https://i.pinimg.com/originals/e5/d7/ff/e5d7ff58b1161a050f406249d5b1fad8.jpg";
const PANEL_1_URL = "https://i.pinimg.com/originals/0d/15/eb/0d15ebece691ca06a43463b4626e2f2c.jpg";
const PANEL_2_URL = "https://i.pinimg.com/originals/e5/e9/26/e5e9265d77d948624ad357ea8d9d2f94.jpg";
const PANEL_3_URL = "https://i.pinimg.com/originals/69/61/76/696176e85452d3d216f95fe8d912b01d.jpg";

// Configurable slideshow loading duration in seconds
const LOADING_DURATION = 4;

const HERO_DATA = [
  {
    heading: "CONCEPT / PHILOSOPHY",
    description: "A CAPTIVATING FUSION OF LOGIC AND CREATIVITY. SHAPING MODERN WEB ECOSYSTEMS THROUGH HIGH-PERFORMANCE CODE AND SOPHISTICATED SYSTEM ARCHITECTURE. SCALABLE APPLICATIONS BUILT WITH AN OBSESSION FOR SPEED AND DESIGN AESTHETICS. TURNING ABSTRACT PROBLEMS INTO ELEGANT DIGITAL SOLUTIONS.",
    quote: '"A sequence of logic. A space of clean code. Building the future."',
    video: "https://assets.mixkit.co/videos/preview/mixkit-tech-animation-with-digital-code-background-48562-large.mp4"
  },
  {
    heading: "SYSTEM / ARCHITECTURE",
    description: "ENGINEERING DISTRIBUTED SYSTEMS AND HIGH-THROUGHPUT COMPILER INFRASTRUCTURE. MAXIMIZING ENGINE EFFICIENCY AND SCALING DATA FLOW PIPELINES. OBSESSIVE BENCHMARKING AND MICRO-OPTIMIZATIONS FOR REAL-TIME OPERATIONS. REDUCING COMPUTATIONAL OVERHEAD TO ZERO FOR UNSURPASSED SPEED.",
    quote: '"Striving for pixel perfection. Blending aesthetics with performance."',
    video: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-grid-background-48563-large.mp4"
  },
  {
    heading: "DESIGN / EXPERIENCES",
    description: "CRAFTING IMMERSIVE AND RESPONSIVE INTERFACES THAT ENGAGE SENSES. SUBTLE MICRO-INTERACTIONS AND SOPHISTICATED ENHANCED LAYOUTS. WHERE CREATIVE VISION MEETS ROBUST WEB IMPLEMENTATION STANDARDS. CREATING MEMORABLE DIGITAL PRODUCT JOURNEYS FOR THE NEXT GENERATION.",
    quote: '"Crafting robust backend systems. Architecting secure scalable databases."',
    video: "https://assets.mixkit.co/videos/preview/mixkit-hand-typing-on-a-computer-keyboard-40456-large.mp4"
  }
];

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
    <div className="w-full lg:h-screen bg-canvas text-black flex flex-col pt-16 lg:pt-12 px-4 pb-4 md:px-6 overflow-y-auto lg:overflow-hidden relative select-none box-border">
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
      {/* Top Banner: Reusing the existing HeroMarquee but with red text styling */}
      <div className="w-full h-[15vh] overflow-hidden flex items-center justify-center flex-shrink-0">
        <HeroMarquee 
          texts={["DEVELOPER", "ENGINEER", "CREATIVE", "SYSTEMS", "COMPILER", "ARCHITECTURE", "FULLSTACK"]}
          marqueeTextClassName="text-red-600/90 font-black tracking-tighter"
          speedMultiplier={0.25}
        />
      </div>

      {/* Split layout below the header (strictly fitted to the remaining flex height) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:flex-1 lg:min-h-0 items-stretch overflow-visible lg:overflow-hidden">
        
        {/* Left Column (3/5 width): Red solid background with multiply-blended band sketch */}
        <div className="lg:col-span-3 bg-red-300 border-2 border-black relative overflow-hidden flex flex-col justify-end h-[35vh] sm:h-[45vh] lg:h-full min-h-[250px] lg:min-h-0">
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

        {/* Right Column (2/5 width): Detailed info grids fitted to 100% of height */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-4 lg:h-full lg:min-h-0 overflow-visible lg:overflow-hidden">
          
          {/* Row 1: Exactly 3 panels (Flex-fills remaining height) */}
          <div className="w-full h-[120px] sm:h-[150px] lg:flex-1 lg:min-h-0 p-0 overflow-hidden flex-shrink-0 lg:flex-shrink">
            {/* 3 Comic Panels side-by-side display cards */}
            <div className="grid grid-cols-3 gap-3 w-full h-full">
              {/* Panel 1 */}
              <div 
                className="border border-black overflow-hidden relative h-full bg-neutral-100 cursor-pointer hover:border-red-400 transition-colors duration-300 select-none"
                onClick={() => handleCardClick(0)}
              >
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
              {/* Panel 2 */}
              <div 
                className="border border-black overflow-hidden relative h-full bg-neutral-100 cursor-pointer hover:border-red-400 transition-colors duration-300 select-none"
                onClick={() => handleCardClick(1)}
              >
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
              {/* Panel 3 */}
              <div 
                className="border border-black overflow-hidden relative h-full bg-neutral-100 cursor-pointer hover:border-red-400 transition-colors duration-300 select-none"
                onClick={() => handleCardClick(2)}
              >
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
            </div>
          </div>

          {/* Grouped Block: Row 2 and Quote to remove the space between them */}
          <div className="flex flex-col gap-2 lg:gap-1.5 flex-shrink-0">
            {/* Row 2: Concept description block without black background/texture */}
            <div className="flex flex-col gap-1.5 flex-shrink-0 h-auto lg:min-h-[94px] justify-center">
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
                    <div className="uppercase text-neutral-800 w-full text-justify line-clamp-4">
                      {HERO_DATA[activeIndex].description}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Serif Tagline Quote - styled with black texture, border, and white text */}
            <div className="w-full bg-black-textured text-white p-2 border-2 border-black flex-shrink-0 min-h-[46px] flex items-center">
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

          {/* Black Divider before ME section */}
          <div className="h-[1.35px] bg-black w-full flex-shrink-0" />

          {/* Row 3: ME + Description + Buttons (Fitted to 38% height, borderless, transparent parent) */}
          {/* Row 3: Decorative Zine Rectangle */}
          <div className="flex gap-4 items-stretch h-[160px] sm:h-[180px] lg:h-[38%] min-h-0 p-0 overflow-hidden flex-shrink-0 lg:flex-shrink">
            <div className="w-full border-2 border-black relative rounded-sm h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-neutral-800/5 backdrop-blur-sm overflow-hidden flex flex-col justify-between p-4 box-border">
              {/* Graphic halftone accent line */}
              <div 
                className="absolute inset-y-0 right-0 w-1/3 opacity-15 pointer-events-none z-0"
                style={{
                  backgroundImage: "radial-gradient(var(--color-accent-brand) 1.5px, transparent 1.5px)",
                  backgroundSize: "8px 8px"
                }}
              />
              <div className="flex flex-col gap-1 relative z-10">
                <span className="text-[10px] text-red-600 font-bold tracking-widest uppercase">[ COMPILER & FULLSTACK ]</span>
                <h4 className="font-anton text-2.5xl sm:text-3.5xl text-neutral-800 leading-none tracking-tight uppercase">
                  Dwaipayan Dutta<span className="text-red-600">.</span>
                </h4>
              </div>
              <div className="flex justify-between items-end relative z-10">
                <span className="font-grotesk text-[10px] text-neutral-600 tracking-wider uppercase font-bold">
                  CREATING SCALABLE FUTURES
                </span>
                <span className="font-grotesk text-[10px] text-red-600 font-bold animate-pulse">
                  [ RUNNING DEV ]
                </span>
              </div>
            </div>
          </div>

        </div>
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
