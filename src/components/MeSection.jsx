import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTerminal, FaCode, FaPaintBrush, FaServer, FaCogs, FaCoffee, FaCamera, FaGraduationCap, FaArrowRight, FaBolt, FaRocket, FaStar } from 'react-icons/fa';
import SketchyBorder from './SketchyBorder';

const TIMELINE = [
  {
    period: "2023 — PRESENT",
    role: "Lead Systems Engineer & Creative Developer",
    company: "HawkdotDev Sandbox",
    desc: "Architecting concurrent queue pipelines, container pipelines, and custom state managers in Go and Rust. Redesigned layout interfaces to utilize lightweight WebGL canvas rendering, boosting visual framerates to 60fps.",
    tag: "CURRENT"
  },
  {
    period: "2021 — 2023",
    role: "Creative Web Architect",
    company: "Pixel Craft Labs",
    desc: "Built complex WebGL interactions and Astro/React workspaces. Created custom vector math algorithms for interactive animations and key-out canvas video engines.",
    tag: "PREV"
  },
  {
    period: "2019 — 2021",
    role: "Systems Specialist",
    company: "ByteForce Solutions",
    desc: "Engineered scalable backend REST/gRPC microservices. Designed high-throughput database caching layers using Redis and PostgreSQL clusters.",
    tag: "ORIGIN"
  }
];

const SKILL_CATEGORIES = [
  {
    title: "SYSTEMS & BACKEND",
    icon: <FaServer />,
    skills: ["Go (Golang)", "Rust", "Python", "C++", "Docker", "Kubernetes", "gRPC", "Redis", "PostgreSQL"]
  },
  {
    title: "FRONTEND & CREATIVE",
    icon: <FaPaintBrush />,
    skills: ["React", "Astro", "Vite", "WebGL", "Three.js", "Framer Motion", "Tailwind CSS", "HTML5/CSS3"]
  },
  {
    title: "DESIGN & TOOLS",
    icon: <FaCogs />,
    skills: ["Figma", "Blender 3D", "Git / GitHub", "CI/CD Pipelines", "Linux Shell", "Neovim config"]
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
};

export default function MeSection() {
  const [coffeeFull, setCoffeeFull] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState([
    { text: "Dwaipayan Dutta Core CLI [Version 2.6]", type: "system" },
    { text: "Type 'help' to unlock telemetry logs.", type: "system" },
    { text: "", type: "system" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const logsEndRef = useRef(null);
  const terminalInputRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const trimmed = inputVal.trim();
      if (!trimmed) return;
      const cmd = trimmed.toLowerCase();
      const newLogs = [...terminalLogs, { text: `$ ${trimmed}`, type: "input" }];

      switch (cmd) {
        case "help":
          newLogs.push({ text: "Available: whoami, stack, status, links, clear", type: "output" });
          break;
        case "whoami":
          newLogs.push({ text: "dwaipayan@hawkdev — Systems Architect / Creative Engineer", type: "output" });
          newLogs.push({ text: "Location: Kolkata, India // Status: Building things", type: "output" });
          break;
        case "stack":
          newLogs.push({ text: "RUNTIME: Go, Rust, TypeScript, Python", type: "output" });
          newLogs.push({ text: "FRONTEND: React, Astro, WebGL, GSAP", type: "output" });
          newLogs.push({ text: "INFRA: Docker, K8s, Redis, PostgreSQL", type: "output" });
          break;
        case "status":
          newLogs.push({ text: "ALL SYSTEMS NOMINAL ✓", type: "output" });
          newLogs.push({ text: `Uptime: ${Math.floor(Math.random() * 999)}d ${Math.floor(Math.random() * 24)}h`, type: "output" });
          break;
        case "links":
          newLogs.push({ text: "GitHub:   github.com/HawkdotDev", type: "output" });
          newLogs.push({ text: "Twitter:  @hawkdotdev", type: "output" });
          break;
        case "clear":
          setTerminalLogs([{ text: "Terminal cleared.", type: "system" }]);
          setInputVal("");
          return;
        default:
          newLogs.push({ text: `Unknown command: ${cmd}. Type 'help'.`, type: "error" });
      }

      setTerminalLogs(newLogs);
      setInputVal("");
    }
  };

  return (
    <section id="about" className="w-full bg-[#1b1b1d] text-white relative overflow-hidden select-none">

      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          BLOCK 1 — HERO INTRO / BIO
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16 relative z-10">

        {/* Section label */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-6"
        >
          <span className="text-purple-500 font-bold font-mono text-[11px] uppercase tracking-[0.25em]">
            [ 001 / ABOUT ]
          </span>
        </motion.div>

        {/* Big title + avatar row */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* Left — text block */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex-1 flex flex-col gap-6"
          >
            <h2 className="font-anton text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.9] text-white">
              ABOUT<br />
              <span className="text-purple-500">ME</span>
            </h2>

            <p className="font-sans leading-relaxed text-neutral-200 font-medium text-base sm:text-lg md:text-xl max-w-xl">
              I'm <span className="text-purple-400 font-bold">Dwaipayan</span> — a systems architect and creative engineer who operates at the intersection of backend concurrency, frontend interaction design, and game-coordinate math.
            </p>
            <p className="font-sans leading-relaxed text-neutral-400 font-medium text-sm sm:text-base max-w-xl">
              My process fuses high-performance microservices with playful WebGL layouts. I don't ship sterile grid templates — I build digital systems that respond, wobble, and tell stories.
            </p>

            {/* Quick stat chips */}
            <div className="flex flex-wrap gap-3 mt-2">
              {[
                { icon: <FaRocket className="text-purple-400" />, label: "5+ years building" },
                { icon: <FaBolt className="text-yellow-400" />, label: "60fps or bust" },
                { icon: <FaStar className="text-purple-400" />, label: "Open source" },
              ].map((chip, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  custom={i + 2}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono font-bold text-neutral-300"
                >
                  {chip.icon}
                  {chip.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — polaroid avatar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true, margin: "-50px" }}
            className="relative shrink-0"
          >
            <div className="relative p-3 pb-12 bg-white w-[220px] sm:w-[260px] shadow-[8px_8px_0px_#000] rotate-[3deg] hover:rotate-0 transition-transform duration-500 cursor-default">
              {/* Tape decoration */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-yellow-400/40 border border-yellow-400/30 rotate-[-4deg]" />

              <div className="w-full aspect-square bg-neutral-200 overflow-hidden border border-neutral-300">
                <img src="/avatar.png" alt="Dwaipayan Dutta" className="w-full h-full object-cover filter grayscale contrast-110 hover:grayscale-0 transition-all duration-700" />
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                <FaCamera className="text-purple-600 text-[10px]" />
                <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-neutral-600">dwaipayan.dll</span>
              </div>
            </div>

            {/* Cat polaroid — floating beside */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-12 -left-16 p-2 pb-8 bg-white w-[120px] shadow-[6px_6px_0px_#000] rotate-[-8deg] hidden sm:block"
            >
              <div className="w-full aspect-square bg-[#eceae6] overflow-hidden border border-neutral-300 flex items-center justify-center p-1">
                <img src="/cat.png" alt="Guardian Cat" className="w-full h-full object-contain" />
              </div>
              <span className="absolute bottom-2 left-2 font-sans font-bold text-[8px] uppercase tracking-wider text-neutral-500">cat.sys</span>
            </motion.div>
          </motion.div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════════
          BLOCK 2 — EXPERIENCE TIMELINE
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 relative z-10">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-10"
        >
          <span className="text-purple-500 font-bold font-mono text-[11px] uppercase tracking-[0.25em]">
            [ 002 / EXPERIENCE ]
          </span>
          <h3 className="font-anton text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase mt-2 text-white">
            CAREER TELEMETRY
          </h3>
        </motion.div>

        {/* Timeline cards */}
        <div className="flex flex-col gap-0 relative">

          {/* Vertical connector line */}
          <div className="absolute left-[18px] md:left-[22px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500 via-purple-500/40 to-transparent" />

          {TIMELINE.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true, margin: "-30px" }}
              className="relative pl-12 md:pl-14 pb-12 last:pb-0 group"
            >
              {/* Dot on timeline */}
              <div className="absolute left-[11px] md:left-[15px] top-1 w-[16px] h-[16px] rounded-full border-[3px] border-purple-500 bg-[#1b1b1d] group-hover:bg-purple-500 transition-colors duration-300 z-10" />

              {/* Card */}
              <div className="relative p-5 sm:p-6 bg-neutral-900/70 border border-white/8 rounded-sm hover:border-purple-500/30 transition-all duration-300 group-hover:translate-x-1">
                <SketchyBorder />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 relative z-40">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full">{item.period}</span>
                    {item.tag === "CURRENT" && (
                      <span className="text-[9px] font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full animate-pulse">● ACTIVE</span>
                    )}
                  </div>
                </div>

                <h4 className="font-anton text-lg sm:text-xl text-white uppercase tracking-wider mb-1 relative z-40">{item.role}</h4>
                <span className="text-xs text-purple-400 font-bold font-mono relative z-40">{item.company}</span>
                <p className="font-grotesk text-sm text-neutral-400 leading-relaxed mt-3 relative z-40">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════════
          BLOCK 3 — SKILLS ARSENAL
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 relative z-10">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-10"
        >
          <span className="text-purple-500 font-bold font-mono text-[11px] uppercase tracking-[0.25em]">
            [ 003 / SKILLS ]
          </span>
          <h3 className="font-anton text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase mt-2 text-white">
            TECH ARSENAL
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SKILL_CATEGORIES.map((cat, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true, margin: "-30px" }}
              className="relative p-5 sm:p-6 bg-neutral-900/70 border border-white/8 rounded-sm hover:border-purple-500/30 transition-all duration-300 group"
            >
              <SketchyBorder />

              {/* Category header */}
              <div className="flex items-center gap-3 mb-5 relative z-40">
                <div className="w-9 h-9 flex items-center justify-center bg-purple-500/15 border border-purple-500/20 rounded-sm text-purple-400 text-sm group-hover:bg-purple-500/25 transition-colors">
                  {cat.icon}
                </div>
                <span className="font-anton text-sm tracking-wider text-white uppercase">{cat.title}</span>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2 relative z-40">
                {cat.skills.map((skill, sIdx) => (
                  <motion.span
                    key={sIdx}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[11px] text-neutral-300 font-semibold hover:border-purple-500/40 hover:text-purple-300 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              {/* Subtle corner index */}
              <span className="absolute top-3 right-3 font-mono text-[10px] text-white/10 font-bold z-40">0{index + 1}</span>
            </motion.div>
          ))}
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════════
          BLOCK 4 — INTERACTIVE TERMINAL
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-24 relative z-10">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-6"
        >
          <span className="text-purple-500 font-bold font-mono text-[11px] uppercase tracking-[0.25em]">
            [ 004 / TERMINAL ]
          </span>
          <h3 className="font-anton text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase mt-2 text-white">
            LIVE CONSOLE
          </h3>
          <p className="font-grotesk text-sm text-neutral-500 mt-2">
            Type <span className="text-purple-400 font-mono font-bold">help</span> and press Enter to explore available commands.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          className="relative"
        >
          {/* Terminal window chrome */}
          <div className="relative bg-[#0d0d0f] border border-white/10 rounded-sm overflow-hidden shadow-[0_8px_40px_rgba(80,18,150,0.15)]">
            <SketchyBorder />

            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/80 border-b border-white/10 relative z-40">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 ml-3">dwaipayan@portfolio — bash</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Coffee button */}
                <motion.button
                  onClick={() => {
                    setCoffeeFull(false);
                    if (typeof window !== "undefined" && window.addToast) {
                      window.addToast("Caffeine cache loaded. Compilation rates boosted!");
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono font-bold text-neutral-400 hover:text-white hover:border-purple-500/40 transition-colors cursor-pointer"
                >
                  <FaCoffee className={coffeeFull ? "text-yellow-400 animate-pulse" : "text-neutral-600"} />
                  {coffeeFull ? "brew" : "empty"}
                </motion.button>
                <span className="text-[10px] font-mono text-purple-500/50 font-bold">SYS-CLI V2.6</span>
              </div>
            </div>

            {/* Terminal body */}
            <div
              className="p-4 sm:p-5 min-h-[220px] max-h-[320px] overflow-y-auto font-mono text-xs sm:text-sm relative z-40 select-text cursor-text"
              style={{
                backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%)",
                backgroundSize: "100% 4px",
              }}
              onClick={() => terminalInputRef.current?.focus()}
            >
              <div className="flex flex-col gap-1">
                {terminalLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`whitespace-pre-wrap font-medium tracking-wide ${
                      log.type === "error" ? "text-red-400" :
                      log.type === "system" ? "text-purple-500/40" :
                      log.type === "input" ? "text-white font-bold" : "text-purple-400"
                    }`}
                  >
                    {log.text}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>

              {/* Input line */}
              <div className="flex items-center gap-1 mt-2 select-text">
                <span className="text-green-400 font-bold shrink-0">❯</span>
                <input
                  ref={terminalInputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleCommand}
                  className="flex-1 bg-transparent text-white font-bold outline-hidden border-none p-0 m-0 caret-purple-400"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
