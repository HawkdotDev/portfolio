import { useState, useRef, useEffect, useCallback } from "react";

const RollingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const buttonRefs = useRef([]);
  const mainButtonRef = useRef(null);
  const timelineRef = useRef(null);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClick = useCallback((msg) => {
    alert(msg);
    setIsOpen(false);
  }, []);

  // Close navbar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Optimized animations with proper cleanup
  useEffect(() => {
    const validButtons = buttonRefs.current.filter(Boolean);
    const background = backgroundRef.current;
    const mainButton = mainButtonRef.current;

    // Clear any existing timeline
    if (timelineRef.current) {
      clearTimeout(timelineRef.current);
    }

    if (isOpen) {
      // Opening animation
      if (background) {
        background.style.transform = 'translateY(-50%) scaleX(1)';
        background.style.opacity = '1';
      }

      if (mainButton) {
        mainButton.style.transform = 'rotate(45deg)';
      }

      // Animate buttons with proper staggering
      validButtons.forEach((button, index) => {
        if (button) {
          setTimeout(() => {
            button.style.transform = 'translateX(0) scale(1) rotate(0deg)';
            button.style.opacity = '1';
          }, 100 + (index * 80));
        }
      });
    } else {
      // Closing animation
      if (mainButton) {
        mainButton.style.transform = 'rotate(0deg)';
      }

      // Animate buttons out
      validButtons.forEach((button, index) => {
        if (button) {
          setTimeout(() => {
            button.style.transform = 'translateX(20px) scale(0.3) rotate(-180deg)';
            button.style.opacity = '0';
          }, index * 50);
        }
      });

      // Animate background out after buttons
      timelineRef.current = setTimeout(() => {
        if (background) {
          background.style.transform = 'translateY(-50%) scaleX(0)';
          background.style.opacity = '0';
        }
      }, 200);
    }

    return () => {
      if (timelineRef.current) {
        clearTimeout(timelineRef.current);
      }
    };
  }, [isOpen]);

  const menuItems = [
    {
      label: "Profile Settings",
      action: "Profile Settings clicked",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      label: "Notifications",
      action: "Notifications clicked",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
      ),
    },
    {
      label: "Help & Support",
      action: "Help & Support clicked",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
      ),
    },
    {
      label: "Sign Out",
      action: "Sign Out clicked",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen z-1001">
      <div ref={containerRef} className="relative">
        {/* Background - properly aligned */}
        <div
          ref={backgroundRef}
          className="absolute right-0 top-1/2 h-14 bg-white/90 backdrop-blur-xl rounded-full shadow-xl border border-white/20 pointer-events-none"
          style={{
            width: `${menuItems.length * 4.5 + 1.125}rem`,
            transform: 'translateY(-50%) scaleX(0)',
            transformOrigin: 'right center',
            opacity: '0',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />

        {/* Navigation Container - properly aligned */}
        <div className="relative flex items-center justify-end space-x-3 pr-2">
          {/* Menu Items Container - always rendered for proper alignment */}
          <div className="flex items-center space-x-3">
            {menuItems.map((item, index) => (
              <button
                key={index}
                ref={(el) => (buttonRefs.current[index] = el)}
                onClick={() => handleClick(item.action)}
                className="
                  group
                  flex items-center justify-center
                  w-12 h-12 rounded-full
                  text-gray-600 hover:text-white
                  bg-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600
                  transform-gpu
                  hover:scale-110 hover:shadow-lg
                  active:scale-95
                  relative
                  z-10
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  transition-all duration-300 ease-out
                "
                style={{
                  transform: 'translateX(20px) scale(0.3) rotate(180deg)',
                  opacity: '0',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                title={item.label}
              >
                {item.icon}
                
                {/* Hover ripple effect */}
                <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out opacity-0 group-hover:opacity-100"></div>
              </button>
            ))}
          </div>

          {/* Main Button - properly positioned */}
          <button
            ref={mainButtonRef}
            onClick={handleToggle}
            className="
              group relative overflow-hidden
              w-12 h-12 rounded-full
              bg-gradient-to-r from-blue-500 to-purple-600
              shadow-lg hover:shadow-xl
              transform-gpu hover:scale-105 active:scale-95
              z-20
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
            "
            style={{
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <svg 
              className="w-6 h-6 text-white mx-auto transition-transform duration-300 ease-out"
              fill="currentColor" 
              viewBox="0 0 24 24"
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.65-.07-.97l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.32-.07.65-.07.97c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1.01c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
            </svg>
            
            {/* Button hover effect */}
            <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-all duration-300 ease-out"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RollingNavbar;