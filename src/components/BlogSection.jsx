import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen, FaTimes, FaCoffee, FaSkull } from "react-icons/fa";
import SketchyBorder from "./SketchyBorder";

const BLOG_POSTS = [
  {
    id: "01",
    title: "Why 0.1 + 0.2 !== 0.3",
    subtitle: "A floating-point horror story",
    date: "14 JUL 2026",
    readTime: "3 MIN READ",
    summary: "A comedic investigation into why computers are secretly bad at math and how binary fractions will eventually take over the world.",
    content: `Have you ever wondered why your core database loop crashed because 0.1 plus 0.2 didn't equal 0.3?
    
To a human, it's basic arithmetic. To a CPU, it's a floating-point nightmare of infinite binary decimals. Because computers represent numbers in base 2, they cannot represent fractions like 1/10 or 1/5 precisely. Instead, they store a close approximation:
- 0.1 is stored as 0.10000000000000000555...
- 0.2 is stored as 0.20000000000000001110...

Sum them up, and you get 0.30000000000000004. If you run a strict assertion:
if (sum === 0.3) { compile() } else { panic() }

Your system crashes at 3:00 AM. 

The Lesson: Always compare floats with a tiny tolerance threshold (epsilon), or stick to integers and convert to cents. Unless you like debugging database rounding errors while chugging stale energy drinks.`,
    accent: "bg-red-600/10"
  },
  {
    id: "02",
    title: "The 3 AM Debugging Guide",
    subtitle: "Blame the compiler",
    date: "28 JUN 2026",
    readTime: "5 MIN READ",
    summary: "The definitive psychological flowchart for diagnosing weird compiler errors in the middle of the night when your brain is semi-fried.",
    content: `It is 3:15 AM. You have been staring at a segfault or an 'undefined is not a function' error for four hours. Here is the scientifically proven zine flowchart to diagnose the bug:

1. **Has it been built?** Check if you saved the file. (We have all spent 45 minutes debugging unsaved code. Do not lie).
2. **Rebuild from scratch.** Run \`rm -rf node_modules\` or clean your project build targets. This is the code equivalent of turning it off and on again.
3. **Drink Coffee.** If you are shaking from caffeine, switch to cold water. If your stomach is growling, eat a slice of cold pizza.
4. **Explain it to the cat.** Or a rubber duck. Speaking the code line-by-line out loud triggers a different cognitive loop that instantly exposes logic flaws.
5. **The Final Step.** If all else fails, delete the last 30 lines, write them again in a different order, and blame the framework compiler. 

Go to sleep. 99% of bugs disappear after 6 hours of sleep.`,
    accent: "bg-amber-600/10"
  },
  {
    id: "03",
    title: "CSS is Awesome (literally)",
    subtitle: "Box sizing saves lives",
    date: "12 MAY 2026",
    readTime: "4 MIN READ",
    summary: "How a single border-box property saved my sanity and why alignment in CSS remains the final boss of frontend development.",
    content: `We've all seen the classic mug: a box with the words 'CSS IS AWESOME' overflowing its wobbly borders. It's funny because it's true.

Aligning elements in the early 2010s was a nightmare of floats, table layouts, and negative margins. Today, we have Flexbox and Grid, but layouts still break because of the default box model (\`content-box\`). If you set:
\`width: 100%; border: 4px solid black;\`

The browser renders it wider than 100% because borders are added to the outer dimensions! 

The Hero: \`box-sizing: border-box\`. Adding this globally forces borders and padding inside the specified width. It is the single most important rule in modern styling.

Yet, aligning a dynamic 3D WebGL viewport inside a wobbly zine card layout is still the final boss. If you see text spilling out, just add \`overflow-hidden\` and pretend it was an aesthetic choice.`,
    accent: "bg-blue-600/10"
  }
];

export default function BlogSection() {
  const [activePost, setActivePost] = useState(null);

  const cardHover = {
    hover: {
      rotate: 0.5,
      y: -6,
      transition: { type: "spring", stiffness: 350, damping: 12 }
    }
  };

  return (
    <section id="blog" className="w-full bg-canvas text-neutral-800 py-24 px-4 md:px-8 relative overflow-hidden select-none">
      {/* Decorative dot-grid background */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--color-border-main) 1.5px, transparent 1.5px)",
          backgroundSize: "16px 16px"
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col gap-16 relative z-10">
        {/* Title block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-3 border-black pb-8">
          <div className="flex flex-col gap-2">
            <span className="text-red-600 font-bold text-xs uppercase tracking-widest">[ COFFEE TRANSLATIONS ]</span>
            <h2 className="font-anton text-6xl md:text-8xl tracking-tight uppercase leading-none scale-y-110 origin-left">
              BLOG
            </h2>
          </div>
          <p className="font-grotesk text-neutral-600 font-medium text-sm sm:text-base md:text-lg max-w-sm leading-relaxed">
            Unfiltered logs of coding systems, visual bugs, and technical philosophies written at weird hours.
          </p>
        </div>

        {/* Blog Post List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <motion.div
              key={post.id}
              className="relative p-6 cursor-pointer bg-canvas text-left flex flex-col justify-between min-h-[300px]"
              variants={cardHover}
              whileHover="hover"
              onClick={() => setActivePost(post)}
            >
              {/* Hand-drawn borders and solid dropshadow */}
              <SketchyBorder 
                fillColor="var(--color-canvas)" 
                shadowColor="var(--color-border-main)" 
                shadowOffset={6} 
              />

              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex justify-between items-center text-[10px] font-bold text-red-600 font-mono tracking-wider">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <h3 className="font-anton text-2xl tracking-tight uppercase leading-none text-black">
                    {post.title}
                  </h3>
                  <span className="font-mono text-xs italic text-neutral-500 font-semibold">{post.subtitle}</span>
                </div>

                <p className="font-grotesk text-sm text-neutral-700 leading-relaxed font-medium">
                  {post.summary}
                </p>
              </div>

              {/* Read button */}
              <div className="flex items-center gap-2 mt-6 font-bold text-xs uppercase text-red-600 tracking-wider relative z-10 hover:text-black transition-colors">
                <FaBookOpen className="text-sm" /> Read Log
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Modal Box */}
      <AnimatePresence>
        {activePost && (
          <motion.div 
            className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePost(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl bg-canvas p-8 text-left cursor-default max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.95, rotate: -1, y: 30 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.95, rotate: 1, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card Sketchy Outline & Shadows */}
              <SketchyBorder fillColor="var(--color-canvas)" shadowColor="#000" shadowOffset={8} />

              {/* Close Button */}
              <button 
                className="absolute top-6 right-6 p-2 bg-red-600 text-white rounded-xs border border-black hover:bg-black transition-colors z-20 cursor-pointer"
                onClick={() => setActivePost(null)}
              >
                <FaTimes />
              </button>

              {/* Content Detail */}
              <div className="flex flex-col gap-6 relative z-10 pr-4">
                <div className="flex gap-4 items-center text-[10px] font-bold text-red-600 font-mono tracking-wider">
                  <span>{activePost.date}</span>
                  <span>•</span>
                  <span>{activePost.readTime}</span>
                </div>

                <div className="flex flex-col gap-1 border-b border-black/10 pb-4">
                  <h3 className="font-anton text-3xl sm:text-4xl tracking-tight uppercase leading-none text-black">
                    {activePost.title}
                  </h3>
                  <span className="font-mono text-sm italic text-neutral-500 font-semibold">{activePost.subtitle}</span>
                </div>

                {/* Main Article text */}
                <div className="font-sans text-neutral-800 leading-relaxed text-sm sm:text-base space-y-4 font-medium whitespace-pre-line">
                  {activePost.content}
                </div>

                {/* Funny footer details */}
                <div className="flex items-center gap-4 mt-8 pt-4 border-t border-black/10 text-xs text-neutral-500 font-bold font-mono">
                  <span className="flex items-center gap-1"><FaCoffee className="text-red-500" /> Stale Brew</span>
                  <span className="flex items-center gap-1"><FaSkull className="text-red-500" /> Compiled 3:00 AM</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
