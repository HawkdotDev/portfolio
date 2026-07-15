import React from "react";

const NavbarHamburger = React.forwardRef(({ onClick, onMouseEnter, onMouseLeave, topLineRef, middleLineRef, bottomLineRef, buttonRef }, ref) => {
  return (
    <div
      ref={ref}
      className="flex items-center flex-shrink-0 z-[100]"
      onClick={onClick}
    >
      <button
        ref={buttonRef}
        className="z-[100] text-neutral-800 pl-1 pr-0 py-1 rounded-full transition-colors relative cursor-pointer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
  );
});

NavbarHamburger.displayName = "NavbarHamburger";

export default NavbarHamburger;
