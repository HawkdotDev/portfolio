import React from "react";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaCode } from "react-icons/fa";
import SketchyBorder from "./SketchyBorder";
import { portfolioItems } from "../data/portfolioData";

export default function WorkSection() {
  const cardHover = {
    hover: {
      y: -8,
      skewX: 1,
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  };

  const buttonHover = {
    hover: {
      scale: 1.05,
      skewX: -2,
      rotate: -1,
      transition: { type: "spring", stiffness: 400, damping: 8 }
    }
  };

  return (
    <section className="w-full bg-[#141414] text-white py-24 px-4 md:px-8 relative overflow-hidden select-none">
      <div className="max-w-6xl mx-auto flex flex-col gap-16 relative z-10">
        {/* Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-3 border-white/20 pb-8">
          <div className="flex flex-col gap-2">
            <span className="text-red-500 font-bold text-xs uppercase tracking-widest">[ SELECTED CREATIONS ]</span>
            <h2 className="font-anton text-6xl md:text-8xl tracking-tight select-none uppercase leading-none scale-y-110 origin-left">
              WORK
            </h2>
          </div>
          <p className="font-grotesk text-neutral-400 font-medium text-sm sm:text-base md:text-lg max-w-sm leading-relaxed">
            A curated sandbox of high-performance tools, creative system architectures, and aesthetic frontends.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {portfolioItems.map((item) => (
            <motion.div
              key={item.id}
              className="group relative flex flex-col rounded-sm bg-neutral-900 overflow-visible text-left cursor-pointer"
              variants={cardHover}
              whileHover="hover"
            >
              {/* Zine Shadow and Sketchy Border */}
              <SketchyBorder 
                fillColor="var(--color-bg-panel, #1a1a1a)" 
                shadowColor="rgba(255, 54, 94, 0.45)" 
                shadowOffset={12} 
              />

              {/* Project Image Frame */}
              <div className="relative w-full aspect-16/10 rounded-sm overflow-hidden m-1 mt-2 mx-2 max-w-[calc(100%-16px)] shrink-0">
                <SketchyBorder isImage={true} className="text-neutral-700" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                
                {/* ID badge */}
                <div className="absolute top-4 left-4 bg-red-600 text-white font-anton text-xl px-3 py-1 scale-y-110 skew-x-3 rounded-xs z-20">
                  {item.id}
                </div>

                {/* Category badge */}
                <div className="absolute bottom-4 left-4 bg-black/80 border border-white/20 text-red-500 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full z-20">
                  {item.category}
                </div>
              </div>

              {/* Project Info details */}
              <div className="flex flex-col gap-4 p-6 relative z-20">
                <h3 className="font-anton text-2xl md:text-3xl tracking-tight uppercase leading-none text-white group-hover:text-red-500 transition-colors">
                  {item.title}
                </h3>
                <p className="font-grotesk text-neutral-400 font-medium text-xs sm:text-sm leading-relaxed">
                  Engineered with maximum efficiency and custom performance. This project integrates scalable architectural modules with clean, robust interfaces.
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 border border-white/10 text-neutral-300 rounded-sm">ASTRO</span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 border border-white/10 text-neutral-300 rounded-sm">REACT</span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 border border-white/10 text-neutral-300 rounded-sm">THREEJS</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 items-center mt-4 border-t border-white/10 pt-4">
                  <motion.a
                    href="#contact"
                    className="flex-1 relative flex items-center justify-center gap-2 p-2 bg-red-600 text-white font-bold font-grotesk text-xs tracking-wider uppercase rounded-xs"
                    variants={buttonHover}
                    whileHover="hover"
                  >
                    <SketchyBorder className="text-white" />
                    Launch Live <FaExternalLinkAlt className="text-[10px]" />
                  </motion.a>
                  
                  <motion.a
                    href="https://github.com/dwaipayandutta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-white/20 text-neutral-300 hover:text-white rounded-xs relative flex items-center justify-center"
                    variants={buttonHover}
                    whileHover="hover"
                  >
                    <SketchyBorder />
                    <FaCode />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
