import React from "react";
import { motion } from "framer-motion";
import { FaLightbulb, FaDraftingCompass, FaCat, FaArrowDown } from "react-icons/fa";
import SketchyBorder from "./SketchyBorder";

const DESIGN_STEPS = [
  {
    icon: <FaLightbulb className="text-yellow-400 text-lg" />,
    step: "01 / THE SPARK",
    title: "Zines meets Neovim",
    desc: "Late one night, staring at a stack of vintage 90s skater magazines next to a terminal prompt, I thought: Why must portfolios be sterile grids? Let's smash them together."
  },
  {
    icon: <FaDraftingCompass className="text-red-500 text-lg" />,
    step: "02 / THE RULE",
    title: "Visual Chaos, Solid Code",
    desc: "The grid must be broken. Every box gets hand-drawn wobbly contours and heavy offset dropshadows, but runs on highly optimized, fast, reactive state logic."
  },
  {
    icon: <FaCat className="text-emerald-400 text-lg" />,
    step: "03 / THE ASSISTANT",
    title: "Enter the Cat-Bot",
    desc: "No zine is complete without a mascot. Created a canvas-BFS pixel flood fill to key out backgrounds, giving birth to an eye-tracking, CLI-reacting assistant cat."
  }
];

export default function DesignIdeaSection() {
  const panelHover = {
    hover: {
      rotate: 0.5,
      y: -4,
      transition: { type: "spring", stiffness: 350, damping: 12 }
    }
  };

  return (
    <section className="w-full bg-[#141414] text-white py-24 px-4 md:px-8 relative overflow-hidden select-none">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-16">
        
        {/* Part 1: Main Philosophy Narrative */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between text-left">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold font-mono text-xs uppercase tracking-widest">[ PHILOSOPHY ]</span>
            </div>
            
            <h3 className="font-anton text-4xl sm:text-5xl tracking-tight uppercase leading-none text-white scale-y-110 origin-left">
              Why the flashy page?
            </h3>
            
            <p className="font-grotesk text-neutral-300 font-medium text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
              Most developer portfolios are sterile, standard grid templates. I wanted to design something that felt like a <span className="px-1.5 py-0.5 bg-yellow-400 text-black font-bold rotate-1 inline-block">90s indie zine</span>, powered by <span className="px-1.5 py-0.5 bg-red-600 text-white font-bold -rotate-1 inline-block">high-performance logic</span>. It is a reflection of my core engineering belief: code is architecture, but interaction is storytelling.
            </p>
          </div>

          {/* Visual Sticker Badge */}
          <motion.div 
            className="relative p-6 bg-neutral-900 border border-white/20 rounded-xs shrink-0 w-full md:w-64 text-center cursor-pointer shadow-[6px_6px_0px_#000] rotate-2"
            whileHover={{ scale: 1.05, rotate: -1, y: -2 }}
          >
            <SketchyBorder fillColor="var(--color-bg-panel, #1d1d1f)" />
            <div className="relative z-10 flex flex-col gap-2 font-mono text-xs">
              <span className="text-red-500 font-bold uppercase tracking-wider text-[10px]">VERDICT //</span>
              <span className="font-anton text-xl tracking-tight text-white uppercase scale-y-110">VISUAL CHAOS</span>
              <span className="text-neutral-400 font-semibold leading-relaxed">meets absolute technical rigor.</span>
            </div>
          </motion.div>
        </div>

        {/* Part 2: Dynamic Storyboarding Divider */}
        <div className="w-full h-[2px] bg-white/10 relative my-4">
          <div className="absolute top-1/2 left-4 px-3 bg-[#141414] text-[10px] text-red-500 font-bold font-mono tracking-widest uppercase -translate-y-1/2">
            THE DESIGN ORIGIN STORY
          </div>
        </div>

        {/* Part 3: Storyboarding Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DESIGN_STEPS.map((step, index) => (
            <motion.div
              key={index}
              className="relative p-6 bg-neutral-950/60 rounded-xs border border-white/10 flex flex-col justify-between min-h-[220px] text-left"
              variants={panelHover}
              whileHover="hover"
            >
              <SketchyBorder />
              
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex justify-between items-center text-[10px] font-bold text-red-500 font-mono tracking-wider">
                  <span>{step.step}</span>
                  {step.icon}
                </div>
                
                <div className="flex flex-col gap-1">
                  <h4 className="font-anton text-lg sm:text-xl tracking-wide uppercase text-white scale-y-105">
                    {step.title}
                  </h4>
                </div>

                <p className="font-grotesk text-xs sm:text-sm text-neutral-400 leading-relaxed font-semibold">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
