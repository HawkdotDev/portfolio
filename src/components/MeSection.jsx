import React from 'react';

const MeSection = () => {
  return (
    <section id="about" className="w-full bg-canvas text-black border-t-2 border-black py-16 px-4 md:px-6 relative box-border overflow-hidden select-none">
      {/* Decorative dot-grid texture on the side */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-32 opacity-15 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(var(--color-accent-brand) 1.5px, transparent 1.5px)",
          backgroundSize: "10px 10px"
        }}
      />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch relative z-10">
        {/* Left Side: Dynamic Avatar Card (Col span 4) */}
        <div className="md:col-span-4 flex justify-center md:justify-start">
          <div className="w-[240px] xs:w-[280px] md:w-full aspect-4/5 bg-red-600 border-2 border-black relative rounded-sm glow overflow-visible shrink-0">
            <img
              src="/avatar.png"
              alt="My Avatar"
              className="absolute -top-12 left-0 w-full h-[calc(100%+48px)] object-cover filter grayscale contrast-125 brightness-110 pointer-events-none z-0"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
            <h2 className="absolute bottom-4 left-4 text-white text-6xl md:text-7xl lg:text-8xl font-anton tracking-tighter select-none font-black scale-y-125 z-20 leading-none">
              ME
            </h2>
          </div>
        </div>

        {/* Right Side: Detailed Narrative and Highlights (Col span 8) */}
        <div className="md:col-span-8 flex flex-col justify-center gap-6 font-grotesk">
          <div className="flex flex-col gap-4">
            <h3 className="text-red-600 font-bold text-xs uppercase tracking-widest">[ INTRODUCTION ]</h3>
            <p className="font-sans leading-relaxed text-neutral-800 font-medium text-lg sm:text-xl md:text-2xl">
              <span className="text-red-600 font-bold text-3xl sm:text-4xl md:text-5xl mr-1 align-middle">Hi!</span> I am a passionate <span className="font-bold text-black">software engineer</span> specializing in building <span className="text-red-600 font-bold">high-performance web applications</span> and <span className="font-bold text-black">scalable system architectures</span>.
            </p>
            <p className="font-sans leading-relaxed text-neutral-800 font-medium text-sm sm:text-base md:text-lg">
              I love combining <span className="text-red-600 font-bold">robust logic</span> with <span className="font-bold text-black">clean visual designs</span>. Striving constantly to learn and adopt <span className="text-red-600 font-bold">cutting-edge tech</span>, I focus on crafting seamless <span className="font-bold text-black">digital experiences</span> that solve real-world problems.
            </p>
          </div>

          {/* Quick Tech Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            <div className="border border-black p-3 bg-neutral-50/50 backdrop-blur-sm rounded-sm">
              <span className="block text-[10px] text-red-600 font-bold tracking-wider uppercase mb-1">01 / ENG</span>
              <span className="font-bold text-xs sm:text-sm text-black">Robust Logic</span>
            </div>
            <div className="border border-black p-3 bg-neutral-50/50 backdrop-blur-sm rounded-sm">
              <span className="block text-[10px] text-red-600 font-bold tracking-wider uppercase mb-1">02 / OPS</span>
              <span className="font-bold text-xs sm:text-sm text-black">Scalable Systems</span>
            </div>
            <div className="border border-black p-3 bg-neutral-50/50 backdrop-blur-sm rounded-sm">
              <span className="block text-[10px] text-red-600 font-bold tracking-wider uppercase mb-1">03 / DEV</span>
              <span className="font-bold text-xs sm:text-sm text-black">Modern Stack</span>
            </div>
            <div className="border border-black p-3 bg-neutral-50/50 backdrop-blur-sm rounded-sm">
              <span className="block text-[10px] text-red-600 font-bold tracking-wider uppercase mb-1">04 / DES</span>
              <span className="font-bold text-xs sm:text-sm text-black">Clean Visuals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeSection;
