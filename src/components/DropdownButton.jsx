import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const DropdownButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonRefs = useRef([]);
  const mainButtonRef = useRef(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClick = (msg) => {
    alert(msg);
    setIsOpen(false);
  };

  // Close dropdown on outside click
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

  // GSAP Animations
  useEffect(() => {
    const validButtons = buttonRefs.current.filter(Boolean);

    if (isOpen && dropdownRef.current) {
      // Set initial state immediately when dropdown opens
      gsap.set(validButtons, {
        x: 60,
        opacity: 0,
        scale: 0.7,
        rotation: 10,
      });

      // Animate buttons into position with stagger
      gsap.to(validButtons, {
        x: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.08,
        delay: 0.1,
      });

      // Animate main button
      gsap.to(mainButtonRef.current, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      });
    } else if (!isOpen && validButtons.length > 0) {
      // Exit animation
      gsap.to(validButtons, {
        x: 40,
        opacity: 0,
        scale: 0.8,
        rotation: -5,
        duration: 0.3,
        ease: "power2.in",
        stagger: 0.04,
      });

      // Reset main button
      gsap.to(mainButtonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  const menuItems = [
    {
      label: "Profile Settings",
      action: "Profile Settings clicked",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L19 6V4C19 3.45 18.55 3 18 3H6C5.45 3 5 3.45 5 4V6L3 7V9H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V9H21ZM17 20H7V9H17V20Z" />
        </svg>
      ),
    },
    {
      label: "Notifications",
      action: "Notifications clicked",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 7A2 2 0 0 1 14 9V13A2 2 0 0 1 12 15A2 2 0 0 1 10 13V9A2 2 0 0 1 12 7M12 17A1 1 0 0 1 13 18A1 1 0 0 1 12 19A1 1 0 0 1 11 18A1 1 0 0 1 12 17Z" />
        </svg>
      ),
    },
    {
      label: "Help & Support",
      action: "Help & Support clicked",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
        </svg>
      ),
    },
    {
      label: "Sign Out",
      action: "Sign Out clicked",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Main Button */}
      <button
        ref={mainButtonRef}
        onClick={handleToggle}
        className={`
          group relative overflow-hidden
          w-7 h-7 rounded-full
          shadow-lg mt-1.5
          transition-all duration-300 ease-out
          transform hover:scale-105 active:scale-95
          ${isOpen ? "ring-4 ring-gray-400/30 shadow-2xl" : ""}
          z-20 relative
        `}
      >
        <svg
          className={`
            w-full h-full text-white relative z-10 mx-auto
            transition-transform duration-300
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-1/2 transform -translate-x-1/2 top-16 space-y-3 z-10"
          style={{
            maxWidth: "calc(100vw - 2rem)",
          }}
        >
          {menuItems.map((item, index) => (
            <button
              key={index}
              ref={(el) => (buttonRefs.current[index] = el)}
              onClick={() => handleClick(item.action)}
              className="
                flex items-center justify-center
                w-9 h-9 rounded-full
                text-gray-700 hover:text-white
                bg-white/95 backdrop-blur-xl hover:bg-gray-700
                shadow-lg hover:shadow-xl
                transition-all duration-200
                hover:scale-110
                active:scale-95
                border border-white/20
                hover:border-transparent
                relative
                opacity-0
                z-99
              "
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


// Main App Component
const App = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative z-10 flex items-center justify-center">
        <DropdownButton />
      </div>
    </div>
  );
};

export default App;