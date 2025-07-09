import { useState, useRef, useLayoutEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

// utility hooks
const useElementWidth = (ref) => {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    
    const updateWidth = () => setWidth(ref.current.offsetWidth);
    const observer = new ResizeObserver(updateWidth);
    observer.observe(ref.current);
    updateWidth();
    
    return () => observer.disconnect();
  }, [ref]);
  return width;
};

const useScreenWidth = () => {
  const [width, setWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  useLayoutEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  
  return width;
};

const useContainerHeight = (ref) => {
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    
    const updateHeight = () => setHeight(ref.current.offsetHeight);
    const observer = new ResizeObserver(updateHeight);
    observer.observe(ref.current);
    updateHeight();
    
    return () => observer.disconnect();
  }, [ref]);
  return height;
};

// font size calculation
const calculateFontSize = (height, screenWidth) => {
  if (height === 0) return "8rem";
  
  const multiplier = screenWidth < 640 ? 1.2 : 
                    screenWidth < 1024 ? 1.3 : 1.4;
  
  return `${height * multiplier - 15}px`;
};

const calculateBaseVelocity = (screenWidth) => {
  if (screenWidth < 640) return 50;
  if (screenWidth < 1024) return 100;
  if (screenWidth < 1440) return 150;
  return 200;
};

// Text component
const VelocityText = ({
  children,
  baseVelocity,
  scrollContainerRef,
  className,
  damping = 50,
  stiffness = 400,
  numCopies,
  velocityMapping,
  fontSize,
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll(
    scrollContainerRef ? { container: scrollContainerRef } : {}
  );
  
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false }
  );
  
  const copyRef = useRef(null);
  const copyWidth = useElementWidth(copyRef);
  
  const x = useTransform(baseX, (v) => 
    copyWidth === 0 ? "0px" : `${((v % copyWidth) + copyWidth) % copyWidth - copyWidth}px`
  );

  const directionFactor = useRef(1);
  
  useAnimationFrame((t, delta) => {
    const velocity = velocityFactor.get();
    if (velocity < 0) directionFactor.current = -1;
    else if (velocity > 0) directionFactor.current = 1;
    
    const moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy + directionFactor.current * moveBy * velocity);
  });

  const spanStyle = {
    fontSize,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    margin: 0,
    padding: 0,
    transform: 'translateY(-0.05em)',
    fontFeatureSettings: 'normal',
    textRendering: 'optimizeLegibility',
  };

  return (
    <div className="relative overflow-hidden h-full">
      <motion.div
        className="flex whitespace-nowrap items-center h-full font-black tracking-tighter"
        style={{
          x,
          lineHeight: 1,
          height: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        {Array.from({ length: numCopies }, (_, i) => (
          <span
            key={i}
            ref={i === 0 ? copyRef : null}
            className={`flex-shrink-0 ${className} mr-5`}
            style={spanStyle}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const HeroMarquee = ({ 
  texts = ["CREATIVE", "DESIGN", "STUDIO", "PORTFOLIO", "BRANDING", "VISUAL", "IDENTITY"],
  speedMultiplier = 0.4,
  numCopies = 8,
  scrollContainerRef,
  className = "",
  damping = 50,
  stiffness = 400,
  velocityMapping = { input: [0, 1000], output: [0, 5] }
}) => {
  const containerRef = useRef(null);
  const screenWidth = useScreenWidth();
  const containerHeight = useContainerHeight(containerRef);
  
  const baseVelocity = calculateBaseVelocity(screenWidth) * speedMultiplier;
  const fontSize = calculateFontSize(containerHeight, screenWidth);
  const content = texts.join(" ") + " ";

  return (
    <div 
      ref={containerRef}
      className={`h-full w-full flex items-center justify-center ${className}`}
    >
      <VelocityText
        baseVelocity={baseVelocity}
        scrollContainerRef={scrollContainerRef}
        className="text-white/10"
        damping={damping}
        stiffness={stiffness}
        numCopies={numCopies}
        velocityMapping={velocityMapping}
        fontSize={fontSize}
      >
        {content}
      </VelocityText>
    </div>
  );
};

export default HeroMarquee;