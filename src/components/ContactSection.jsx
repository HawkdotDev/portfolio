import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaCat, FaCheck } from "react-icons/fa";
import SketchyBorder from "./SketchyBorder";

export default function ContactSection() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [activeField, setActiveField] = useState("idle"); // 'name', 'email', 'message', 'typing', 'sending', 'sent'
  const [transparentCatSrc, setTransparentCatSrc] = useState("");
  
  // BFS Keyout of white background in /cat.png
  useEffect(() => {
    const img = new Image();
    img.src = "/cat.png";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const width = canvas.width;
      const height = canvas.height;

      const visited = new Uint8Array(width * height);
      const queue = [];

      for (let x = 0; x < width; x++) {
        queue.push(x, 0); visited[x] = 1;
        queue.push(x, height - 1); visited[(height - 1) * width + x] = 1;
      }
      for (let y = 0; y < height; y++) {
        queue.push(0, y); visited[y * width] = 1;
        queue.push(width - 1, y); visited[y * width + (width - 1)] = 1;
      }

      let qHead = 0;
      while (qHead < queue.length) {
        const cx = queue[qHead++];
        const cy = queue[qHead++];
        const idx = (cy * width + cx) * 4;

        if (data[idx] > 240 && data[idx + 1] > 240 && data[idx + 2] > 240) {
          data[idx + 3] = 0;
          const dirs = [
            [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
          ];
          for (const [nx, ny] of dirs) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (visited[nIdx] === 0) {
                visited[nIdx] = 1;
                queue.push(nx, ny);
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setTransparentCatSrc(canvas.toDataURL("image/png"));
    };
  }, []);

  // Cat dialogue speech bubble text reactor
  const getCatSpeech = () => {
    switch (activeField) {
      case "name":
        return "A human name! Tell me, what do they call you?";
      case "email":
        return "An email address! So I can send you a carrier pigeon back?";
      case "message":
        return "Ooh, a message! Tell me what cool project we are building!";
      case "typing":
        return "Writing more? Excellent, I'm watching your keystrokes... purr...";
      case "sending":
        return "Mew! Sending your signal through the cloud lines...";
      case "sent":
        return "Purr! Transmission successfully cached! Talk soon, human!";
      default:
        return "Mew! Leave a message below, and my inbox-bot will register it!";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (activeField !== "sending" && activeField !== "sent") {
      setActiveField(value.length > 0 ? "typing" : name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setActiveField("sending");
    setTimeout(() => {
      setActiveField("sent");
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setActiveField("idle"), 5000);
    }, 1800);
  };

  const inputFocusStyle = "w-full p-4 bg-canvas/30 border-2 border-black rounded-xs font-grotesk text-black outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:skew-x-1 transition-all";
  
  return (
    <section id="contact" className="w-full bg-canvas text-neutral-800 py-24 px-4 md:px-8 relative overflow-hidden select-none">
      {/* Dynamic Grid Background */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--color-border-main) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col gap-16 relative z-10">
        {/* Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-3 border-black pb-8">
          <div className="flex flex-col gap-2">
            <span className="text-red-600 font-bold text-xs uppercase tracking-widest">[ LEAVE A SIGNAL ]</span>
            <h2 className="font-anton text-6xl md:text-8xl tracking-tight uppercase leading-none scale-y-110 origin-left">
              CONTACT
            </h2>
          </div>
          <p className="font-grotesk text-neutral-600 font-medium text-sm sm:text-base md:text-lg max-w-sm leading-relaxed">
            Interested in starting a project, talking shop, or hiring? Get in touch below!
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form (Col span 7) */}
          <form 
            onSubmit={handleSubmit}
            className="md:col-span-7 flex flex-col gap-6 relative p-8 bg-canvas rounded-sm"
          >
            {/* Hand-drawn borders and drop shadow */}
            <SketchyBorder fillColor="var(--color-canvas)" shadowColor="#000" shadowOffset={8} />

            <div className="flex flex-col gap-2 relative z-10 text-left">
              <label className="font-anton text-lg tracking-wide uppercase text-black">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={formState.name}
                onChange={handleInputChange}
                onFocus={() => setActiveField("name")}
                onBlur={() => setActiveField("idle")}
                className={inputFocusStyle}
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col gap-2 relative z-10 text-left">
              <label className="font-anton text-lg tracking-wide uppercase text-black">Your Email</label>
              <input
                type="email"
                name="email"
                required
                value={formState.email}
                onChange={handleInputChange}
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField("idle")}
                className={inputFocusStyle}
                placeholder="john@example.com"
              />
            </div>

            <div className="flex flex-col gap-2 relative z-10 text-left">
              <label className="font-anton text-lg tracking-wide uppercase text-black">Your Message</label>
              <textarea
                name="message"
                required
                rows={5}
                value={formState.message}
                onChange={handleInputChange}
                onFocus={() => setActiveField("message")}
                onBlur={() => setActiveField("idle")}
                className={`${inputFocusStyle} resize-none`}
                placeholder="Hey, let's build something..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={activeField === "sending"}
              className="relative w-full py-4 mt-4 bg-red-600 text-white font-anton text-lg sm:text-xl tracking-wider uppercase border-2 border-black rounded-xs shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#000] active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-3 z-10"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <SketchyBorder className="text-white" />
              {activeField === "sending" ? (
                <>Sending...</>
              ) : activeField === "sent" ? (
                <>
                  Success <FaCheck className="text-sm" />
                </>
              ) : (
                <>
                  Send Transmission <FaPaperPlane className="text-sm" />
                </>
              )}
            </motion.button>
          </form>

          {/* Right Column: Cat Bubble Box (Col span 5) */}
          <div className="md:col-span-5 flex flex-col items-center gap-6 relative">
            
            {/* Interactive Speech Bubble */}
            <div className="relative w-full p-6 bg-canvas text-left">
              <SketchyBorder fillColor="var(--color-canvas)" shadowColor="#000" shadowOffset={6} />
              
              <p className="font-grotesk text-sm sm:text-base leading-relaxed text-black font-semibold min-h-[50px] relative z-10">
                {getCatSpeech()}
              </p>
              
              {/* Bubble Arrow Anchor */}
              <div 
                className="absolute -bottom-4 right-[25%] w-8 h-8 bg-canvas border-r-2 border-b-2 border-black rotate-45 z-0"
                style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 0%)" }}
              />
            </div>

            {/* Dynamic Cat Avatar Card */}
            <div className="w-[180px] sm:w-[220px] aspect-501/457 bg-red-600 relative rounded-sm glow overflow-visible shrink-0 mt-4">
              <SketchyBorder isImage={true} />
              {transparentCatSrc && (
                <img
                  src={transparentCatSrc}
                  alt="Assistant Cat"
                  className="absolute bottom-0 left-0 w-full h-full object-contain filter grayscale contrast-125 brightness-110 pointer-events-none z-10"
                />
              )}
              {/* Decorative Cat Box Tag */}
              <div className="absolute -bottom-6 bg-black border border-white/20 text-white font-anton text-xs px-3 py-1 scale-y-110 skew-x-3 rounded-xs z-20">
                CAT-BOT v1.0
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
