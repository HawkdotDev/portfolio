import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBrain, FaWrench, FaTerminal, FaPaintBrush, FaArrowDown } from "react-icons/fa";
import SketchyBorder from "./SketchyBorder";

const PERSONAL_SPECS = [
  {
    id: 0,
    icon: <FaBrain className="text-red-500 text-lg" />,
    label: "SYSTEMS THINKER",
    desc: "I view software as a living ecosystem. From low-level memory bounds to high-level network topology, I architect systems to be resilient, fast, and elegant."
  },
  {
    id: 1,
    icon: <FaWrench className="text-red-500 text-lg" />,
    label: "CRAFTSMANSHIP",
    desc: "Wobbly curves, pixel-perfect layouts, and smooth physics. I believe frontend interfaces deserve the same meticulous care as robust backend pipelines."
  },
  {
    id: 2,
    icon: <FaTerminal className="text-red-500 text-lg" />,
    label: "PERPETUAL HACKER",
    desc: "Perpetually experimenting in my sandbox—whether it's writing custom compiler modules, distributed storage loops, or WebGL coordinate maps."
  },
  {
    id: 3,
    icon: <FaPaintBrush className="text-red-500 text-lg" />,
    label: "THE DESIGN MIND",
    desc: "I don't just build features; I craft digital interactions. Every click, wobble, and color theme is a story waiting to be told to the user."
  }
];

export default function HowIThinkSection() {
  const [hoveredCard, setHoveredCard] = useState(0);

  const renderVisualAnimation = () => {
    switch (hoveredCard) {
      case 0:
        return (
          <motion.svg
            key="sys"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full h-full text-red-500"
            viewBox="0 0 100 100"
          >
            <line x1="20" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="20" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="50" y1="20" x2="80" y2="50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="50" y1="80" x2="80" y2="50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <motion.circle cx="20" cy="50" r="5" fill="currentColor" animate={{ r: [5, 7, 5] }} transition={{ repeat: Infinity, duration: 2 }} />
            <motion.circle cx="50" cy="20" r="5" fill="currentColor" animate={{ r: [5, 6, 5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} />
            <motion.circle cx="50" cy="80" r="5" fill="currentColor" animate={{ r: [5, 6, 5] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }} />
            <motion.circle cx="80" cy="50" r="5" fill="currentColor" animate={{ r: [5, 7, 5] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.8 }} />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <motion.circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2.5 }} />
            <circle cx="50" cy="50" r="5" fill="#ffea00" />
          </motion.svg>
        );
      case 1:
        return (
          <motion.svg
            key="craft"
            initial={{ opacity: 0, rotate: -30 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 30 }}
            className="w-full h-full text-red-500"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4,4" opacity="0.4" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              style={{ transformOrigin: "50px 50px" }}
            >
              <line x1="50" y1="50" x2="50" y2="15" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="50" x2="75" y2="65" stroke="currentColor" strokeWidth="1.5" />
              <line x1="50" y1="50" x2="25" y2="65" stroke="#ffea00" strokeWidth="2" />
              <circle cx="50" cy="15" r="3" fill="#ffea00" />
              <circle cx="75" cy="65" r="2" fill="currentColor" />
            </motion.g>
            <circle cx="50" cy="50" r="4" fill="currentColor" />
          </motion.svg>
        );
      case 2:
        return (
          <motion.div
            key="hack"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full h-full flex flex-col justify-around items-center font-mono text-[10px] text-red-500/80 p-6 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#141414] via-transparent to-[#141414] z-10 pointer-events-none" />
            <motion.div
              className="flex flex-col gap-1 w-full text-left"
              animate={{ y: [0, -40] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <div>01001000 01000001 01000011 01001011</div>
              <div className="text-[#ffea00]">dwaipayan@sandbox:~$ run compiler.sh</div>
              <div>&gt; optimizing byte array maps...</div>
              <div>&gt; WebGL translation units [OK]</div>
              <div className="text-white">&gt; 124,520 lines parsed successfully.</div>
              <div>01010111 01000001 01010011 01001101</div>
              <div className="text-[#ffea00]">&gt; compiling WASM engine...</div>
            </motion.div>
          </motion.div>
        );
      case 3:
        return (
          <motion.svg
            key="design"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="w-full h-full"
            viewBox="0 0 100 100"
          >
            <motion.g
              animate={{ rotate: [0, -360] }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              style={{ transformOrigin: "50px 50px" }}
            >
              <circle cx="50" cy="50" r="35" fill="none" stroke="#ff365e" strokeWidth="3" strokeDasharray="35,15" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="#ffea00" strokeWidth="2" strokeDasharray="20,10" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="10,5" />
            </motion.g>
            <circle cx="50" cy="50" r="6" fill="#fff" />
            <motion.circle 
              cx="50" 
              cy="50" 
              r="4" 
              fill="#ff365e" 
              animate={{ scale: [1, 1.3, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }} 
            />
          </motion.svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full bg-[#141414] text-white py-24 px-4 md:px-8 relative overflow-hidden select-none">
      {/* Decorative dot-grid layout */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-12">
        {/* Title / Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6 text-left">
          <div className="flex flex-col gap-2">
            <span className="text-red-500 font-bold font-mono text-xs uppercase tracking-widest">[ HOW I THINK & BUILD ]</span>
            <h3 className="font-anton text-4xl sm:text-5xl tracking-tight uppercase leading-none text-white scale-y-110 origin-left">
              ENGINEERING MATRIX
            </h3>
          </div>
          <p className="font-grotesk text-neutral-400 font-medium text-xs sm:text-sm leading-relaxed max-w-sm">
            Hover over each node quadrant below to load the real-time visual system telemetry profiles.
          </p>
        </div>

        {/* Split Layout: 2x2 Grid + Card-Reactive Animation Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: 2 by 2 Cards Grid (Col span 7) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PERSONAL_SPECS.map((spec) => (
              <motion.div
                key={spec.id}
                className={`relative p-5 rounded-xs border transition-colors cursor-pointer text-left min-h-[160px] flex flex-col justify-between ${
                  hoveredCard === spec.id 
                    ? "bg-neutral-900/50 border-red-500/80 shadow-[4px_4px_0px_var(--color-accent-brand)]" 
                    : "bg-neutral-950/40 border-white/10"
                }`}
                onMouseEnter={() => setHoveredCard(spec.id)}
                onClick={() => setHoveredCard(spec.id)}
                whileHover={{ y: -2 }}
              >
                <SketchyBorder />
                
                <div className="flex items-center gap-2 relative z-10">
                  {spec.icon}
                  <span className="font-anton text-sm tracking-wide uppercase text-white scale-y-105">
                    {spec.label}
                  </span>
                </div>
                
                <p className="font-grotesk text-xs text-neutral-400 leading-relaxed font-semibold relative z-10 mt-3 flex-1">
                  {spec.desc}
                </p>

                {hoveredCard === spec.id && (
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Column: Interactive Vector Animation Screen (Col span 5) */}
          <div className="md:col-span-5 relative min-h-[300px] flex items-center justify-center p-6 bg-neutral-900 border border-white/10 rounded-sm">
            <SketchyBorder fillColor="var(--color-bg-panel, #1d1d1f)" shadowColor="#000" shadowOffset={6} />
            
            <div className="w-full h-full max-w-[240px] max-h-[240px] flex items-center justify-center relative z-10 select-none pointer-events-none">
              <AnimatePresence mode="wait">
                {renderVisualAnimation()}
              </AnimatePresence>
            </div>
            
            <div className="absolute bottom-3 right-4 font-mono text-[9px] text-neutral-500 font-bold select-none z-20">
              SYS-TELEMETRY // RENDERER.SH
            </div>
          </div>

        </div>

        {/* Prompt Line at the Bottom */}
        <div className="flex justify-center border-t border-white/10 pt-8 mt-4 select-none">
          <p className="font-grotesk font-bold text-xs uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            With that being said, next is a bit about me
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-red-500 inline-block text-sm ml-1"
            >
              <FaArrowDown />
            </motion.span>
          </p>
        </div>

      </div>
    </section>
  );
}
