import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import SketchyBorder from "./SketchyBorder";

const MESSAGES = [
  "your behaviour is monitored by cats.",
  "a cat is judging your scroll speed. currently: sub-optimal.",
  "human presence detected. please submit tuna immediately.",
  "cat console: mouse movements are highly suspicious.",
  "warning: keyboard nap in progress. do not disturb.",
  "system status: 99% nap, 1% code.",
  "curiosity level: critical. box occupation: 100%.",
  "meow. (translation: nice layout, but where are the treats?)",
  "compiling... results: success (after three naps).",
  "cat detected an un-scratched piece of furniture nearby."
];

export default function CatToasts() {
  const [toasts, setToasts] = useState([]);

  // Function to add a toast
  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 15000);
  };

  // Periodic toasts
  useEffect(() => {
    // First toast after 3 seconds
    const initialTimer = setTimeout(() => {
      addToast(MESSAGES[0]);
    }, 3000);

    // Then every 18 seconds
    const interval = setInterval(() => {
      const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      addToast(randomMsg);
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Event Listener Triggers (Clicks & Scroll & Idle)
  useEffect(() => {
    // 1. Click counter trigger
    let clickCount = 0;
    const handleClick = () => {
      clickCount++;
      if (clickCount === 10) {
        addToast("too many clicks. have you tried napping?");
        clickCount = 0;
      }
    };

    // 2. Idle timer trigger
    let idleTimeout;
    const resetIdleTimer = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        addToast("user inactivity detected. entering standby-nap mode. 💤");
      }, 25000); // 25 seconds idle
    };

    // 3. Fast scroll trigger
    let lastScrollTop = 0;
    let scrollAccumulator = 0;
    let scrollTimeout;

    const handleScroll = () => {
      resetIdleTimer();
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const diff = Math.abs(st - lastScrollTop);
      lastScrollTop = st <= 0 ? 0 : st;

      scrollAccumulator += diff;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (scrollAccumulator > 1500) {
          addToast("scroll speed is being monitored. slow down, we are trying to sleep.");
        }
        scrollAccumulator = 0;
      }, 150);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("scroll", handleScroll);

    resetIdleTimer();

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(idleTimeout);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3.5 max-w-sm pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.95, transition: { duration: 0.2 } }}
            className="pointer-events-auto relative p-4 bg-transparent w-72 md:w-80"
          >
            {/* Sketchy Border with hand-drawn wobbly background and shadow underlay */}
            <SketchyBorder 
              double={true} 
              isImage={true} 
              className="text-black" 
              fillColor="#fff9db"
              shadowColor="#000"
              shadowOffset={4}
            />
            
            {/* Content wrapper with z-index higher than SketchyBorder */}
            <div className="relative z-40 flex items-start gap-3 w-full">
              {/* Cat Icon / Accent */}
              <div className="text-xl shrink-0 mt-0.5 select-none" aria-hidden="true">🐈‍⬛</div>
              
              {/* Message Text */}
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider select-none font-grotesk">
                  [ CAT ALERT ]
                </span>
                <p className="font-sans text-xs md:text-sm font-semibold leading-normal text-neutral-900 select-text">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id));
                }}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer text-xs font-bold leading-none select-none ml-1 p-0.5"
                aria-label="Dismiss alert"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
