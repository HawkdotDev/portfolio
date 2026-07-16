import { useEffect, useRef, useState, Fragment, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavbarHamburger from "./NavbarHamburger";
import NavbarMenu from "./NavbarMenu";

gsap.registerPlugin(ScrollTrigger);

const THEMES = [
  {
    id: "wheat-rose",
    name: "Wheat & Rose",
    canvas: "#f5deb2",
    brand: "#ff365e",
    loader: "#ff6b8b",
    videoBg: "#ffb3c1",
    text: "#141414",
    border: "#000000",
    blend: "multiply",
    dark: {
      canvas: "#1c0d12",
      brand: "#ff365e",
      loader: "#ff6b8b",
      videoBg: "#30121d",
      text: "#fecdd3",
      border: "#5c1d31",
      blend: "screen"
    }
  },
  {
    id: "sage-red",
    name: "Sage & Red",
    canvas: "#7ea366",
    brand: "#dc2626",
    loader: "#f87171",
    videoBg: "#fca5a5",
    text: "#141414",
    border: "#000000",
    blend: "multiply",
    dark: {
      canvas: "#0f1a14",
      brand: "#ff4d4d",
      loader: "#ff8080",
      videoBg: "#1b2e23",
      text: "#d1e7dd",
      border: "#2a4836",
      blend: "screen"
    }
  },
  {
    id: "matcha",
    name: "Matcha Green",
    canvas: "#faf6ee",
    brand: "#7da852",
    loader: "#93c468",
    videoBg: "#e8f2df",
    text: "#141414",
    border: "#000000",
    blend: "multiply",
    dark: {
      canvas: "#0a0d08",
      brand: "#7da852",
      loader: "#9ad46a",
      videoBg: "#182412",
      text: "#dcedc8",
      border: "#334d20",
      blend: "screen"
    }
  },
  {
    id: "Bold Red",
    name: "Bold Red",
    canvas: "#7da852",
    brand: "#d90429",
    loader: "#ef233c",
    videoBg: "#b9d79b",
    text: "#141414",
    border: "#000000",
    blend: "multiply",
    dark: {
      canvas: "#0f0f10",
      brand: "#ff3b30",
      loader: "#ff7d75",
      videoBg: "#1e1e21",
      text: "#f4f4f5",
      border: "#3f3f46",
      blend: "screen"
    }
  },
  {
    id: "kraft-orange",
    name: "Kraft & Orange",
    canvas: "#e6d5bc",
    brand: "#d95d16",
    loader: "#f28546",
    videoBg: "#f7cbb2",
    text: "#241812",
    border: "#1c120c",
    blend: "multiply",
    dark: {
      canvas: "#1a120b",
      brand: "#f97316",
      loader: "#fb923c",
      videoBg: "#2d1e12",
      text: "#ffedd5",
      border: "#543b23",
      blend: "screen"
    }
  },
  {
    id: "mono-chrome",
    name: "Monochrome Gray",
    canvas: "#e5e7eb",
    brand: "#111827",
    loader: "#4b5563",
    videoBg: "#9ca3af",
    text: "#1f2937",
    border: "#111827",
    blend: "multiply",
    dark: {
      canvas: "#111111",
      brand: "#ffffff",
      loader: "#a3a3a3",
      videoBg: "#262626",
      text: "#e5e5e5",
      border: "#404040",
      blend: "screen"
    }
  }
];

const applyThemeColors = (theme, isDark) => {
  const root = document.documentElement;
  if (isDark && theme.dark) {
    const d = theme.dark;
    root.style.setProperty("--color-canvas", d.canvas);
    root.style.setProperty("--color-accent-brand", d.brand);
    root.style.setProperty("--color-accent-loader", d.loader);
    root.style.setProperty("--color-accent-video-bg", d.videoBg);
    root.style.setProperty("--color-text-main", d.text);
    root.style.setProperty("--color-border-main", d.border);
    root.style.setProperty("--image-blend-mode", d.blend || "screen");
    root.style.setProperty("--dot-color", "rgba(255, 255, 255, 0.03)");
    root.style.setProperty("--texture-color", "rgba(0, 0, 0, 0.25)");
  } else {
    root.style.setProperty("--color-canvas", theme.canvas);
    root.style.setProperty("--color-accent-brand", theme.brand);
    root.style.setProperty("--color-accent-loader", theme.loader);
    root.style.setProperty("--color-accent-video-bg", theme.videoBg);
    root.style.setProperty("--color-text-main", theme.text);
    root.style.setProperty("--color-border-main", theme.border);
    root.style.setProperty("--image-blend-mode", theme.blend || "multiply");
    root.style.setProperty("--dot-color", "rgba(0, 0, 0, 0.03)");
    root.style.setProperty("--texture-color", "rgba(255, 255, 255, 0.15)");
  }
};

const Navbar = () => {
  const navbarContainerRef = useRef(null);
  const navbarBgRef = useRef(null);
  const hamburgerContainerRef = useRef(null);

  // Individual line refs for hamburger animation
  const topLineRef = useRef(null);
  const middleLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeSelectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeSelectorRef.current && !themeSelectorRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Set hamburger icon into 'X' shape instantly on page load
    gsap.set(topLineRef.current, { rotation: 45, transformOrigin: "center", y: 6 });
    gsap.set(middleLineRef.current, { opacity: 0, scaleX: 0 });
    gsap.set(bottomLineRef.current, { rotation: -45, transformOrigin: "center", y: -6 });

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("portfolio-dark-mode");
    return saved === "true";
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window === "undefined") return THEMES[0];
    const saved = localStorage.getItem("selected-portfolio-theme");
    const found = THEMES.find((t) => t.id === saved);
    const initial = found || THEMES[0];
    const isDark = localStorage.getItem("portfolio-dark-mode") === "true";
    applyThemeColors(initial, isDark);
    return initial;
  });

  const selectTheme = useCallback((theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("selected-portfolio-theme", theme.id);
    applyThemeColors(theme, isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    localStorage.setItem("portfolio-dark-mode", String(newDark));
    applyThemeColors(currentTheme, newDark);
  };

  useEffect(() => {
    const navbarContainer = navbarContainerRef.current;
    const navbarBg = navbarBgRef.current;

    const getDimensions = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const setupAnimations = () => {
      const { width, height } = getDimensions();
      const isMobile = width < 768;
      const isSmallMobile = width < 375;

      // Responsive navbar dimensions
      const getNavbarWidth = () => {
        if (isMobile) {
          if (isSmallMobile) {
            return Math.max(width * 0.92, 280);
          }
          return Math.max(width * 0.95, 320);
        }
        return "100%";
      };

      const navbarHeight = isMobile ? (isSmallMobile ? 52 : 56) : 64;
      const navbarTop = isMobile ? (isSmallMobile ? 10 : 12) : 16;

      // Initial setup (starts transparent and full-width)
      gsap.set(navbarContainer, {
        top: 0,
        left: "50%",
        xPercent: -50,
        height: navbarHeight,
        width: "100%",
        maxWidth: "none",
        borderRadius: 0,
        border: "1px solid rgba(255, 255, 255, 0)",
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
        boxShadow: "none",
      });

      gsap.set(navbarBg, {
        y: isMobile ? 0 : -navbarHeight,
        height: navbarHeight,
        width: "100%",
        borderRadius: isMobile ? "50px" : 0,
        backgroundColor: "rgba(21,21,21,0)",
        backdropFilter: "blur(0px)",
      });

      // Scroll animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `+=${height * 0.5}`,
          scrub: 1,
        },
      });

      // Unified scroll animation for both mobile and desktop
      const endWidth = isMobile ? getNavbarWidth() : Math.min(width * 0.55, 800);

      tl.to(
        navbarContainer,
        {
          top: navbarTop,
          width: endWidth,
          borderRadius: "50px",
          backgroundColor: "rgba(100, 100, 100, 0.2)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          ease: "power3.out",
          duration: 1,
        },
        0
      );

      tl.to(
        navbarBg,
        {
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          duration: 0.2,
          ease: "power2.out",
        },
        0.8
      );
    };

    setupAnimations();

    // Debounced resize handler for better performance
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        setupAnimations();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Hamburger animation functions
  const animateToX = () => {
    const tl = gsap.timeline();

    tl.to(topLineRef.current, {
      rotation: 45,
      transformOrigin: "center",
      y: 6,
      duration: 0.3,
      ease: "power2.out",
    })
      .to(
        middleLineRef.current,
        {
          opacity: 0,
          scaleX: 0,
          duration: 0.2,
          ease: "power2.out",
        },
        0
      )
      .to(
        bottomLineRef.current,
        {
          rotation: -45,
          transformOrigin: "center",
          y: -6,
          duration: 0.3,
          ease: "power2.out",
        },
        0
      );
  };

  const animateToHamburger = () => {
    const tl = gsap.timeline();

    tl.to(topLineRef.current, {
      rotation: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    })
      .to(
        bottomLineRef.current,
        {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        0
      )
      .to(
        middleLineRef.current,
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.2,
          ease: "power2.out",
        },
        0.1
      );
  };

  const handleHoverIn = () => {
    gsap.to(hamburgerButtonRef.current, {
      scale: 1.1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleHoverOut = () => {
    gsap.to(hamburgerButtonRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    if (!isMobileMenuOpen) {
      animateToX();
    } else {
      animateToHamburger();
    }
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
    animateToHamburger();
  };

  return (
    <>
      {/* Navbar Container */}
      <div
        ref={navbarContainerRef}
        className="navbar-main fixed z-40 flex justify-between items-center w-full px-4 md:px-6"
        style={{ minWidth: "auto" }}
      >
        {/* Brand Name on the Left */}
        <div
          className="navbar-brand-logo text-neutral-800 font-anton uppercase tracking-normal select-none cursor-pointer text-sm sm:text-base md:text-lg transition-opacity hover:opacity-75 z-100"
          onClick={() => (window.location.href = "#home")}
        >
          Dwaipayan Dutta<span className="text-red-600">.</span>
        </div>

        {/* Theme Selector + Hamburger container on the Right */}
        <div className="flex items-center gap-3 sm:gap-4 z-100">
          {/* Collapsible Theme Selector */}
          <div 
            ref={themeSelectorRef}
            className="flex items-center gap-1.5"
          >
            {/* Toggle Arrow Button (Outside) */}
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="theme-arrow-btn w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full hover:bg-neutral-800/10 transition-colors cursor-pointer text-neutral-800/70 z-100 focus-visible:ring-2 focus-visible:ring-neutral-800 focus:outline-none"
              title={isThemeMenuOpen ? "Collapse Themes" : "Expand Themes"}
              aria-label="Toggle theme selector"
              aria-expanded={isThemeMenuOpen}
            >
              <svg
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                  isThemeMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Swatches Pill Container */}
            <div 
              className={`flex items-center bg-neutral-800/5 backdrop-blur-md px-1.5 py-1.5 rounded-full border border-neutral-800/10 transition-all duration-300 ease-out select-none overflow-hidden will-change-[width] theme-pill-container ${
                isThemeMenuOpen 
                  ? "w-[124px] sm:w-[162px]" 
                  : "w-[28px] sm:w-[36px]"
              }`}
              style={{ height: "30px" }}
            >
              <div className="flex items-center flex-nowrap">
                {THEMES.map((theme, idx) => {
                  const isActive = currentTheme.id === theme.id;
                  const isVisible = isThemeMenuOpen || isActive;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => selectTheme(theme)}
                      aria-label={`Switch to ${theme.name} theme`}
                      className={`rounded-full border overflow-hidden relative flex items-center justify-center transition-all duration-300 hover:scale-115 cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-neutral-800 focus:outline-none ${
                        isActive 
                          ? "border-neutral-800 scale-105 shadow-sm border-[1.8px]" 
                          : isVisible
                            ? "border-neutral-800 border"
                            : "border-transparent border-0"
                      }`}
                      style={{ 
                        backgroundColor: theme.canvas,
                        transitionDelay: isThemeMenuOpen ? `${idx * 30}ms` : "0ms",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "scale(1)" : "scale(0)",
                        width: isVisible ? "var(--btn-size)" : "0px",
                        height: isVisible ? "var(--btn-size)" : "0px",
                        margin: isVisible ? "0 var(--btn-margin)" : "0px",
                      }}
                      title={theme.name}
                    >
                      {/* Diagonal split bottom-right triangle using clipPath to prevent anti-aliasing bleed */}
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ 
                          backgroundColor: theme.brand,
                          clipPath: "polygon(100% 0, 100% 100%, 0 100%)"
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle-btn w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-neutral-800/10 transition-all duration-300 active:scale-95 cursor-pointer text-neutral-800/70 focus-visible:ring-2 focus-visible:ring-neutral-800 focus:outline-none z-100 relative"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <svg
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 ease-out select-none ${
                isDarkMode ? "rotate-40 text-neutral-800/80" : "rotate-0 text-neutral-800/70"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Mask to cut out the crescent moon shape dynamically */}
              <mask id="moon-mask-id">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <circle
                  cx={isDarkMode ? "18" : "30"}
                  cy="6"
                  r="8"
                  fill="black"
                  className="transition-all duration-500 ease-out"
                />
              </mask>

              {/* Sun/Moon center body (masked) */}
              <circle
                cx="12"
                cy="12"
                r={isDarkMode ? "9" : "5"}
                fill="currentColor"
                mask="url(#moon-mask-id)"
                className="transition-all duration-500 ease-out"
              />

              {/* Sun Rays - they fade and shrink when in dark mode */}
              <g
                className={`transition-all duration-500 ease-out transform origin-center ${
                  isDarkMode ? "opacity-0 scale-50 rotate-45" : "opacity-100 scale-100 rotate-0"
                }`}
                stroke="currentColor"
              >
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </g>
            </svg>
          </button>

          {/* Hamburger Menu */}
          <NavbarHamburger
            ref={hamburgerContainerRef}
            onClick={toggleMobileMenu}
            onMouseEnter={handleHoverIn}
            onMouseLeave={handleHoverOut}
            topLineRef={topLineRef}
            middleLineRef={middleLineRef}
            bottomLineRef={bottomLineRef}
            buttonRef={hamburgerButtonRef}
          />
        </div>
      </div>

      {/* Floating Right Menu */}
      <NavbarMenu
        ref={mobileMenuRef}
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMenu}
      />
    </>
  );
};

export default Navbar;
