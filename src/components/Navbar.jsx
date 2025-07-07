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
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const navbarContainer = navbarContainerRef.current;
    const navbarBg = navbarBgRef.current;
    const logo = logoRef.current;
    const hamburger = hamburgerRef.current;
    const contact = contactRef.current;

    const getDimensions = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const setupAnimations = () => {
      const { width, height } = getDimensions();
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isSmallMobile = width < 375; // Add breakpoint for very small screens

      // Responsive navbar dimensions
      const getNavbarWidth = () => {
        if (isMobile) {
          if (isSmallMobile) {
            return Math.max(width * 0.92, 280); // Minimum 280px, but responsive
          }
          return Math.max(width * 0.95, 320); // Minimum 320px for regular mobile
        }
        return "100%";
      };

      // Logo Sizing with better mobile scaling
      const startSize = Math.min(width * 0.08, height * 0.25, 80); // Add max size limit
      const endSize = isMobile ? 
        (isSmallMobile ? 16 : 18) : // Smaller on very small screens
        (isTablet ? 19 : 20);
      
      const navbarHeight = isMobile ? 
        (isSmallMobile ? 52 : 56) : // Slightly smaller on small screens
        64;

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
        maxWidth: isMobile ? "calc(100vw - 16px)" : "none", // Prevent overflow
        borderRadius: isMobile ? "50px" : 0,
        border: isMobile ? "1px solid rgba(255, 255, 255, 0.1)" : "0px solid rgba(255, 255, 255, 0.1)",
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
        const desktopWidth = Math.min(width * 0.55, 800); // Add max width limit
        
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Navbar Container */}
      <div
        ref={navbarContainerRef}
        className="fixed z-40 flex justify-between items-center w-full px-3 sm:px-4 md:px-8"
        style={{ minWidth: 'auto' }} // Override any min-width constraints
      >
        {/* Hamburger Menu */}
        <div
          ref={hamburgerRef}
          className="flex items-center flex-shrink-0 z-998"
          onClick={toggleMobileMenu}
        >
          <button className="hover:text-black z-999 text-white p-1.5 sm:p-2 hover:bg-white/90 rounded-full transition-colors">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Logo Middle (Invisible Spacer) */}
        <div className="flex justify-center flex-1 min-w-0" />

        {/* Contact Link */}
        <div
          ref={contactRef}
          className="flex items-center flex-shrink-0 z-998"
        >
          <a
            href="#contact"
            className="text-white font-medium text-sm sm:text-base transition-colors hover:text-blue-300 px-1"
          >
            CONTACT
          </a>
        </div>
      </div>

      {/* Mobile/Desktop Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed inset-0 bg-black bg-opacity-90 z-99 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6 sm:space-y-8 px-4">
          <a
            href="#about"
            className="text-white text-xl sm:text-2xl font-medium hover:text-blue-300 transition-colors"
            onClick={toggleMobileMenu}
          >
            About
          </a>
          <a
            href="#work"
            className="text-white text-xl sm:text-2xl font-medium hover:text-blue-300 transition-colors"
            onClick={toggleMobileMenu}
          >
            Work
          </a>
          <a
            href="#blog"
            className="text-white text-xl sm:text-2xl font-medium hover:text-blue-300 transition-colors"
            onClick={toggleMobileMenu}
          >
            Blog
          </a>
          <a
            href="#contact"
            className="text-white text-xl sm:text-2xl font-medium hover:text-blue-300 transition-colors"
            onClick={toggleMobileMenu}
          >
            Contact
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
        className="fixed text-white text-center z-50 font-bold transition-colors hover:text-blue-200 select-none cursor-pointer"
        onClick={() => (window.location.href = "#home")}
      >
        DWAIPAYAN DUTTA
      </div>
    </>
  );
};

export default Navbar;