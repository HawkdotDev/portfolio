import { forwardRef, useEffect } from "react";
import { FaTwitter, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

const NavbarMenu = forwardRef(({ isOpen }, ref) => {
  const links = [
    { label: "HOME", href: "#home" },
    { label: "ABOUT", href: "#about" },
    { label: "WORK", href: "#work" },
    { label: "CONTACT", href: "#contact" }
  ];

  // Toggle body class to trigger .App push margin via CSS
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("nav-menu-open");
    } else {
      document.body.classList.remove("nav-menu-open");
    }
    return () => { document.body.classList.remove("nav-menu-open"); };
  }, [isOpen]);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100dvh",
        width: "var(--nav-menu-width)",
        zIndex: 9900,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px",
        boxSizing: "border-box",
        userSelect: "none",
        boxShadow: isOpen ? "-4px 0px 0px 0px rgba(0,0,0,1)" : "none",
        borderLeft: "2px solid black",
        transform: isOpen ? "translateX(0%)" : "translateX(105%)",
        transition: "transform 0.45s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.45s ease, visibility 0.45s ease",
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        willChange: "transform",
        overflowY: "auto",
        overflowX: "hidden",
      }}
      className="bg-canvas"
    >
      {/* Top section: Copy of ME Red Square and Image */}
      <div className="mt-10 mb-6 flex justify-center">
        <div className="w-full aspect-square bg-red-600 border-2 border-black relative rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] night-lights overflow-visible shrink-0">
          <img
            src="/avatar.png"
            alt="My Avatar"
            className="absolute -top-8 left-0 w-full h-[calc(100%+32px)] object-cover filter grayscale contrast-125 brightness-110 pointer-events-none z-0"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
          <h2 className="absolute bottom-2.5 left-2.5 text-white text-5xl font-anton tracking-tighter select-none font-black scale-y-125 z-20 leading-none">
            ME
          </h2>
        </div>
      </div>

      {/* Center: Vertical Navigation Links (links do not close menu) */}
      <nav className="flex flex-col gap-6 my-auto">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-anton text-4xl sm:text-5xl text-neutral-800 tracking-tight hover:text-red-600 hover:skew-x-6 transition-all duration-300 uppercase leading-none block w-fit"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Social Icons just before the divider */}
      <div className="flex gap-4 items-center mb-2 mt-4 text-base text-neutral-600">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" aria-label="Twitter">
          <FaTwitter />
        </a>
        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" aria-label="Instagram">
          <FaInstagram />
        </a>
      </div>

      {/* Bottom section: Footer Branding */}
      <div className="flex flex-col gap-1.5 border-t border-black/10 pt-4">
        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">
          DWAIPAYAN DUTTA.
        </span>
        <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
          © {new Date().getFullYear()} ALL RIGHTS RESERVED
        </span>
      </div>
    </div>
  );
});

NavbarMenu.displayName = "NavbarMenu";

export default NavbarMenu;
