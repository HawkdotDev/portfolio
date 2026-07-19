import { useEffect, useState, useRef } from "react";

export default function LooneyTunesTransition() {
  const [transitionState, setTransitionState] = useState("idle"); // 'idle', 'closing', 'closed', 'opening'
  const [clipRadius, setClipRadius] = useState("150vmax");
  const [clipX, setClipX] = useState("50%");
  const [clipY, setClipY] = useState("50%");
  
  const lastScrollTop = useRef(0);
  const isTransitioning = useRef(false);

  useEffect(() => {
    let scrollInstance = null;

    // Helper to compute absolute top of about section (handles LocomotiveScroll transforms statically)
    const getAboutTop = () => {
      const aboutEl = document.getElementById("about");
      if (aboutEl) {
        return aboutEl.offsetTop;
      }
      return window.innerHeight;
    };

    // Block page keyboard navigation during transition
    const blockKeys = (e) => {
      if (!isTransitioning.current) return;
      const keys = ["ArrowDown", "ArrowUp", "Space", "PageDown", "PageUp", "Home", "End"];
      if (keys.includes(e.key)) {
        e.preventDefault();
      }
    };

    // Intercept mouse wheel scroll directions
    const handleGlobalWheel = (e) => {
      if (isTransitioning.current) {
        e.preventDefault();
        return;
      }

      const aboutTop = getAboutTop();

      // Trigger 1: Scroll Down from Home to About
      if (lastScrollTop.current <= 15 && e.deltaY > 0) {
        e.preventDefault();
        triggerTransition("about");
      }
      // Trigger 2: Scroll Up from About to Home (narrowed trigger window)
      else if (lastScrollTop.current >= aboutTop - 15 && lastScrollTop.current <= aboutTop + 10 && e.deltaY < 0) {
        e.preventDefault();
        triggerTransition("home");
      }
    };

    // Intercept mobile swiping directions
    const touchStartY = { current: 0 };
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleGlobalTouchMove = (e) => {
      if (isTransitioning.current) {
        e.preventDefault();
        return;
      }

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY; // positive delta = scroll down
      const aboutTop = getAboutTop();

      // Trigger 1: Swipe up (scroll down) from Home to About
      if (lastScrollTop.current <= 15 && deltaY > 10) {
        e.preventDefault();
        triggerTransition("about");
      }
      // Trigger 2: Swipe down (scroll up) from About to Home (narrowed trigger window)
      else if (lastScrollTop.current >= aboutTop - 15 && lastScrollTop.current <= aboutTop + 10 && deltaY < -10) {
        e.preventDefault();
        triggerTransition("home");
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
    window.addEventListener("keydown", blockKeys, { passive: false });

    // Track scroll coordinates, ignoring updates while transitioning to prevent race conditions
    const initScrollListener = () => {
      if (window.locomotiveScroll) {
        scrollInstance = window.locomotiveScroll;
        scrollInstance.on("scroll", (obj) => {
          if (!isTransitioning.current) {
            lastScrollTop.current = obj.scroll.y;
          }
        });
      } else {
        const onWindowScroll = () => {
          if (!isTransitioning.current) {
            lastScrollTop.current = window.scrollY || document.documentElement.scrollTop;
          }
        };
        window.addEventListener("scroll", onWindowScroll);
      }
    };

    const timer = setTimeout(initScrollListener, 150);

    const triggerTransition = (target) => {
      isTransitioning.current = true;
      setTransitionState("closing");
      
      const aboutTop = getAboutTop();

      // Lock local scroll state to start position immediately
      if (target === "about") {
        lastScrollTop.current = 0;
      } else {
        lastScrollTop.current = aboutTop;
      }

      // Lock body scroll and container scroll position
      document.body.style.overflow = "hidden";
      if (window.locomotiveScroll) {
        window.locomotiveScroll.stop();
        if (target === "about") {
          window.locomotiveScroll.scrollTo(0, { duration: 0, disableLerp: true });
        } else {
          window.locomotiveScroll.scrollTo(aboutTop, { duration: 0, disableLerp: true });
        }
      } else {
        if (target === "about") {
          window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, aboutTop);
        }
      }

      // Locate the cat image to center the circular wipe mask
      const catEl = document.getElementById("hero-cat-image");
      let x = "50%";
      let y = "50%";
      let faceRadius = 70; // fallback
      
      if (catEl) {
        const rect = catEl.getBoundingClientRect();
        x = `${rect.left + rect.width / 2}px`;
        y = `${rect.top + rect.height / 2}px`;
        faceRadius = Math.max(rect.width, rect.height) * 0.52;
      }
      
      setClipX(x);
      setClipY(y);

      // Stage 1: Close down to frame the cat
      let start1 = null;
      const duration1 = 1000; // 1s
      const vmax = Math.max(window.innerWidth, window.innerHeight);
      const startRadius = 1.25 * vmax;

      const animateStage1 = (timestamp) => {
        if (!start1) start1 = timestamp;
        const progress = timestamp - start1;
        const percent = Math.min(progress / duration1, 1);
        
        const ease = 1 - Math.pow(1 - percent, 3);
        const currentRadius = startRadius - (startRadius - faceRadius) * ease;
        setClipRadius(`${currentRadius}px`);

        if (progress < duration1) {
          requestAnimationFrame(animateStage1);
        } else {
          setClipRadius(`${faceRadius}px`);
          // Stage 2: Brief hold on the cat before final close
          setTimeout(() => startStage3(target), 850); // Hold for 850ms
        }
      };

      // Stage 3: Complete closing (radius from faceRadius down to 0px)
      const startStage3 = (targ) => {
        let start3 = null;
        const duration3 = 450; // 450ms
        
        const animateStage3 = (timestamp) => {
          if (!start3) start3 = timestamp;
          const progress = timestamp - start3;
          const percent = Math.min(progress / duration3, 1);
          
          const ease = percent * percent;
          const currentRadius = (1 - ease) * faceRadius;
          setClipRadius(`${currentRadius}px`);

          if (progress < duration3) {
            requestAnimationFrame(animateStage3);
          } else {
            setClipRadius("0px");
            setTransitionState("closed");
            performPageJump(targ);
          }
        };
        
        requestAnimationFrame(animateStage3);
      };
      
      requestAnimationFrame(animateStage1);
    };

    const performPageJump = (target) => {
      const aboutSec = document.getElementById("about");
      const aboutTop = getAboutTop();

      // Update local scroll state to the target position instantly
      if (target === "about") {
        lastScrollTop.current = aboutTop;
      } else {
        lastScrollTop.current = 0;
      }

      if (target === "about") {
        if (aboutSec) {
          if (window.locomotiveScroll) {
            window.locomotiveScroll.scrollTo(aboutSec, { duration: 0, disableLerp: true });
          } else {
            window.scrollTo(0, aboutTop);
          }
        } else {
          window.scrollTo(0, window.innerHeight);
        }
      } else {
        // Scroll back to top of home page
        if (window.locomotiveScroll) {
          window.locomotiveScroll.scrollTo(0, { duration: 0, disableLerp: true });
        } else {
          window.scrollTo(0, 0);
        }
      }

      // Stage 5: Reveal next section (open iris from 0px back to full viewport)
      setTimeout(() => {
        setTransitionState("opening");
        
        let startOpen = null;
        const durationOpen = 900; // 900ms
        const vmax = Math.max(window.innerWidth, window.innerHeight);
        const endRadius = 1.25 * vmax;

        const animateOpen = (timestamp) => {
          if (!startOpen) startOpen = timestamp;
          const progress = timestamp - startOpen;
          const percent = Math.min(progress / durationOpen, 1);
          
          const ease = 1 - Math.pow(1 - percent, 3);
          const currentRadius = ease * endRadius;
          setClipRadius(`${currentRadius}px`);

          if (progress < durationOpen) {
            requestAnimationFrame(animateOpen);
          } else {
            setClipRadius("150vmax");
            setTransitionState("idle");
            
            // Re-enable scrolling
            document.body.style.overflow = "";
            if (window.locomotiveScroll) {
              window.locomotiveScroll.start();
            }
            isTransitioning.current = false;
          }
        };
        
        requestAnimationFrame(animateOpen);
      }, 150);
    };

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", handleGlobalWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("keydown", blockKeys);
      document.body.style.overflow = "";
      if (window.locomotiveScroll) {
        window.locomotiveScroll.start();
      }
    };
  }, []);

  if (transitionState === "idle") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        pointerEvents: "all",
        // Concentric target wipe: a single thin red outline ring on a solid dark background
        background: `radial-gradient(circle ${clipRadius} at ${clipX} ${clipY}, transparent ${clipRadius}, #ff365e ${clipRadius}, #ff365e calc(${clipRadius} + 6px), #141414 calc(${clipRadius} + 6px))`,
      }}
    />
  );
}
