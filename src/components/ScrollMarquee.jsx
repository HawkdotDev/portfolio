import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "motion/react";
import { useElementWidth } from "../hooks/useElementWidth";
import { useScreenWidth } from "../hooks/useScreenWidth";

export const ScrollMarquee = ({
  numRows = 1,
  rowTexts = [[]],
  speedMultiplier = 1,
  scrollContainerRef = undefined,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = undefined,
  scrollerClassName = undefined,
  parallaxStyle = undefined,
  scrollerStyle = undefined,
}) => {
  const screenWidth = useScreenWidth();
  
  // Calculate base velocity based on screen width
  // Smaller screens = slower scroll, larger screens = faster scroll
  const calculateBaseVelocity = (screenWidth) => {
    if (screenWidth < 640) return 50;  // Mobile
    if (screenWidth < 1024) return 100; // Tablet
    if (screenWidth < 1440) return 150; // Desktop
    return 200; // Large desktop
  };

  // Apply speed multiplier to base velocity (independent of content)
  const baseVelocity = calculateBaseVelocity(screenWidth) * speedMultiplier;

  function VelocityText({
    children,
    baseVelocity: propBaseVelocity = baseVelocity,
    scrollContainerRef,
    className = "",
    damping,
    stiffness,
    numCopies,
    velocityMapping,
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
  }) {
    const baseX = useMotionValue(0);
    const scrollOptions = scrollContainerRef
      ? { container: scrollContainerRef }
      : {};
    const { scrollY } = useScroll(scrollOptions);
    const scrollMarquee = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollMarquee, {
      damping: damping ?? 50,
      stiffness: stiffness ?? 400,
    });
    const velocityFactor = useTransform(
      smoothVelocity,
      velocityMapping?.input || [0, 1000],
      velocityMapping?.output || [0, 5],
      { clamp: false }
    );
    const copyRef = useRef(null);
    const copyWidth = useElementWidth(copyRef);

    function wrap(min, max, v) {
      const range = max - min;
      const mod = (((v - min) % range) + range) % range;
      return mod + min;
    }

    const x = useTransform(baseX, (v) => {
      if (copyWidth === 0) return "0px";
      return `${wrap(-copyWidth, 0, v)}px`;
    });

    const directionFactor = useRef(1);
    useAnimationFrame((t, delta) => {
      let moveBy = directionFactor.current * propBaseVelocity * (delta / 1000);
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }
      moveBy += directionFactor.current * moveBy * velocityFactor.get();
      baseX.set(baseX.get() + moveBy);
    });

    const spans = [];
    for (let i = 0; i < (numCopies ?? 1); i++) {
      spans.push(
        <span
          className={`flex-shrink-0 ${className}`}
          key={i}
          ref={i === 0 ? copyRef : null}
        >
          {children}
        </span>
      );
    }

    return (
      <div
        className={`${parallaxClassName} relative overflow-hidden`}
        style={parallaxStyle}
      >
        <motion.div
          className={`${scrollerClassName} flex whitespace-nowrap py-2 text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem] md:leading-[5rem]`}
          style={{ x, ...scrollerStyle }}
        >
          {spans}
        </motion.div>
      </div>
    );
  }

  // Generate rows based on numRows and rowTexts
  const generateRows = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const textsForRow = rowTexts[i] || rowTexts[0] || [];
      
      // Create a row with all texts concatenated
      const rowContent = textsForRow.join(" ");
      
      // Alternate direction for each row
      const velocity = i % 2 !== 0 ? -baseVelocity : baseVelocity;
      
      rows.push(
        <VelocityText
          key={i}
          className={className}
          baseVelocity={velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {rowContent}&nbsp;
        </VelocityText>
      );
    }
    return rows;
  };

  return <section>{generateRows()}</section>;
};

export default ScrollMarquee;