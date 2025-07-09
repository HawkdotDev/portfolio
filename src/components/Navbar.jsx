import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navbarContainerRef = useRef(null);
  const navbarBgRef = useRef(null);
  const logoRef = useRef(null);
  const hamburgerRef = useRef(null);
  const contactRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Individual line refs for hamburger animation
  const topLineRef = useRef(null);
  const middleLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const hamburgerButtonRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const navbarContainer = navbarContainerRef.current;
    const navbarBg = navbarBgRef.current;
    const logo = logoRef.current;
    // const hamburger = hamburgerRef.current;
    // const contact = contactRef.current;

    const getDimensions = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const setupAnimations = () => {
      const { width, height } = getDimensions();
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
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

      // Logo Sizing with better mobile scaling
      const startSize = Math.min(width * 0.08, height * 0.25, 80);
      const endSize = isMobile ? (isSmallMobile ? 16 : 18) : isTablet ? 19 : 20;

      const navbarHeight = isMobile ? (isSmallMobile ? 52 : 56) : 64;

      const startX = width / 2;
      const startY = height * 0.4;

      const endX = width / 2;
      const endY = navbarHeight / 2 + (isMobile ? 8 : 8.5);

      // Initial setup with responsive considerations
      gsap.set(navbarContainer, {
        top: 8,
        left: "50%",
        xPercent: -50,
        height: navbarHeight,
        width: getNavbarWidth(),
        maxWidth: isMobile ? "calc(100vw - 16px)" : "none",
        borderRadius: isMobile ? "50px" : 0,
        border: isMobile
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "0px solid rgba(255, 255, 255, 0.1)",
        backgroundColor: isMobile ? "rgba(100, 100, 100, 0.2)" : "transparent",
        backdropFilter: isMobile ? "blur(15px)" : "blur(0px)",
        boxShadow: isMobile ? "0 8px 32px rgba(0,0,0,0.2)" : "none",
      });

      gsap.set(navbarBg, {
        y: isMobile ? 0 : -navbarHeight,
        height: navbarHeight,
        width: "100%",
        borderRadius: isMobile ? "50px" : 0,
        backgroundColor: "rgba(21,21,21,0)",
        backdropFilter: "blur(0px)",
      });

      gsap.set(logo, {
        x: startX,
        y: startY,
        fontSize: startSize,
        xPercent: -50,
        yPercent: -50,
        position: "fixed",
        zIndex: 50,
        fontWeight: isMobile ? "700" : "800",
        mixBlendMode: "difference",
        textShadow: "0 0 16px rgba(0,0,0,0.3)",
        letterSpacing: isMobile ? "0.05em" : "0.1em",
        pointerEvents: "none",
      });

      // Scroll animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `+=${height * 0.5}`,
          scrub: 1,
          onUpdate: (self) => {
            const clickable = self.progress >= 1;
            gsap.set(logo, { pointerEvents: clickable ? "auto" : "none" });
            logo.style.cursor = clickable ? "pointer" : "default";
          },
        },
      });

      tl.to(
        logo,
        {
          x: endX,
          y: endY,
          fontSize: endSize,
          textShadow: "0 0 8px rgba(0,0,0,0.3)",
          ease: "power2.out",
          duration: 1,
        },
        0
      );

      if (!isMobile) {
        // Desktop navbar animation
        const desktopWidth = Math.min(width * 0.55, 800);

        tl.to(
          navbarContainer,
          {
            width: desktopWidth,
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
      }
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

  // useEffect(() => {
  //   if (isMobileMenuOpen) {
  //     animateToX();
  //   } else {
  //     animateToHamburger();
  //   }
  // }, []);

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

  return (
    <>
      {/* Navbar Container */}
      <div
        ref={navbarContainerRef}
        className="fixed z-40 flex justify-between items-center w-full px-3 sm:px-4 md:px-8"
        style={{ minWidth: "auto" }}
      >
        {/* Hamburger Menu */}
        <div
          ref={hamburgerRef}
          className="flex items-center flex-shrink-0 z-[100]"
          onClick={toggleMobileMenu}
        >
          <button
            ref={hamburgerButtonRef}
            className="z-[100] text-white p-1 rounded-full transition-colors relative"
            onMouseEnter={handleHoverIn}
            onMouseLeave={handleHoverOut}
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                ref={topLineRef}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16"
              />
              <path
                ref={middleLineRef}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 12h16"
              />
              <path
                ref={bottomLineRef}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Logo Middle (Invisible Spacer) */}
        <div className="flex justify-center flex-1 min-w-0" />

        {/* Contact Link */}
        <div
          ref={contactRef}
          className="flex items-center flex-shrink-0 z-[100]"
        >
          <a
            href="#contact"
            className="text-white font-medium teblack sm:text-base transition-colors hover:text-blue-300 px-1"
          >
            CONTACT
          </a>
        </div>
      </div>

      {/* Floating Left Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed left-4 top-[60px] z-[90] transition-all duration-300 ease-out pl-6 ${
          isMobileMenuOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col pt-4 space-y-4 sm:space-y-6">
          <a
            href="#about"
            className="text-gray-400 px-4 rounded-md bg-blend-exclusion py-1.5 text-sm font-medium bg-[#333333] hover:text-blue-300 transition-colors hover:translate-x-1 duration-200 border-black border-[0.5px]"
            onClick={toggleMobileMenu}
          >
            01 - About
          </a>
          <a
            href="#work"
            className="text-gray-400 px-4 rounded-md bg-blend-exclusion py-1.5 text-sm font-medium bg-[#333333] hover:text-blue-300 transition-colors hover:translate-x-1 duration-200 border-black border-[0.5px]"
            onClick={toggleMobileMenu}
          >
            02 - Work
          </a>
          <a
            href="#blog"
            className="text-gray-400 px-4 rounded-md bg-blend-exclusion py-1.5 text-sm font-medium bg-[#333333] hover:text-blue-300 transition-colors hover:translate-x-1 duration-200 border-black border-[0.5px]"
            onClick={toggleMobileMenu}
          >
            03 - Blog
          </a>
          <a
            href="#contact"
            className="text-gray-400 px-4 rounded-md bg-blend-exclusion py-1.5 text-sm font-medium bg-[#333333] hover:text-blue-300 transition-colors hover:translate-x-1 duration-200 border-black border-[0.5px]"
            onClick={toggleMobileMenu}
          >
            04 - Contact
          </a>
        </div>
      </div>

      {/* Background */}
      <div
        ref={navbarBgRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ WebkitBackdropFilter: "blur(0px)" }}
      ></div>

      {/* Logo */}
      <div
        ref={logoRef}
        className="fixed text-white text-center z-50 font-bold color-wave transition-colors hover:text-blue-200 select-none tracking-tighter cursor-pointer"
        onClick={() => (window.location.href = "#home")}
      >
        {[..."DWAIPAYAN\u202FDUTTA"].map((char, i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.1}s` }}
            className="wave-letter"
          >
            {char}
          </span>
        ))}
      </div>
    </>
  );
};

export default Navbar;
