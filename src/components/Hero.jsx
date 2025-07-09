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
import HeroMarquee from "./HeroMarquee";


// ScrollMarquee utility hooks
function useElementWidth(ref) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);
  return width;
}

function useScreenWidth() {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  return width;
}

// ScrollMarquee Component
const ScrollMarquee = ({
  numRows = 1,
  rowTexts = [[]],
  speedMultiplier = 1,
  scrollContainerRef,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
}) => {
  const screenWidth = useScreenWidth();
  
  const calculateBaseVelocity = (screenWidth) => {
    if (screenWidth < 640) return 50;
    if (screenWidth < 1024) return 100;
    if (screenWidth < 1440) return 150;
    return 200;
  };

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
          className={`${scrollerClassName} flex whitespace-nowrap items-center h-full`}
          style={{ x, ...scrollerStyle }}
        >
          {spans}
        </motion.div>
      </div>
    );
  }

  const generateRows = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const textsForRow = rowTexts[i] || rowTexts[0] || [];
      const rowContent = textsForRow.join(" ");
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

  return <section className="h-full">{generateRows()}</section>;
};

const Hero = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const portfolioItems = [
    {
      id: "01",
      image: "https://i.pinimg.com/1200x/e5/d7/ff/e5d7ff58b1161a050f406249d5b1fad8.jpg",
      title: "Brand Identity Design",
      category: "Branding",
      bgGradient: "from-purple-600 via-pink-500 to-red-400",
    },
    {
      id: "02",
      image: "https://i.pinimg.com/1200x/0d/15/eb/0d15ebece691ca06a43463b4626e2f2c.jpg",
      title: "Product Photography",
      category: "Photography",
      bgGradient: "from-blue-600 via-cyan-500 to-teal-400",
    },
    {
      id: "03",
      image: "https://i.pinimg.com/1200x/e5/e9/26/e5e9265d77d948624ad357ea8d9d2f94.jpg",
      title: "Digital Art Portrait",
      category: "Digital Art",
      bgGradient: "from-green-600 via-emerald-500 to-lime-400",
    },
    {
      id: "04",
      image: "https://i.pinimg.com/1200x/69/61/76/696176e85452d3d216f95fe8d912b01d.jpg",
      title: "Editorial Design",
      category: "Print Design",
      bgGradient: "from-red-400 to-orange-400",
    },
  ];

  const landingPages = [
    // Brand Identity Landing Page
    {
      content: (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-red-400 flex items-center justify-center">
          {/* <div className="text-center text-white max-w-4xl px-8">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-6xl font-bold mb-4">BRAND</h1>
              <p className="text-xl opacity-90">Crafting memorable identities that speak your story</p>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Logo Design</h3>
                <p className="text-sm">Distinctive marks that define your brand</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Brand Strategy</h3>
                <p className="text-sm">Strategic positioning for market impact</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Visual Identity</h3>
                <p className="text-sm">Cohesive systems across all touchpoints</p>
              </div>
            </div>
          </div> */}
          <img
            src="https://i.pinimg.com/1200x/e5/d7/ff/e5d7ff58b1161a050f406249d5b1fad8.jpg"
            alt="image"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ),
    },
    // Photography Landing Page
    {
      content: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center">
          {/* <div className="text-center text-white max-w-5xl px-8">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-10 h-8 bg-white/80 rounded-sm relative">
                  <div className="absolute top-1 right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
                </div>
              </div>
              <h1 className="text-7xl font-light mb-4">CAPTURE</h1>
              <p className="text-2xl opacity-90">Moments that matter, stories that last</p>
            </div>
            <div className="flex justify-center gap-4 mt-12">
              <div className="w-32 h-40 bg-white/10 rounded-lg backdrop-blur-sm"></div>
              <div className="w-32 h-40 bg-white/15 rounded-lg backdrop-blur-sm mt-8"></div>
              <div className="w-32 h-40 bg-white/10 rounded-lg backdrop-blur-sm"></div>
              <div className="w-32 h-40 bg-white/15 rounded-lg backdrop-blur-sm mt-8"></div>
            </div>
          </div> */}
          <img
            src="https://i.pinimg.com/1200x/0d/15/eb/0d15ebece691ca06a43463b4626e2f2c.jpg"
            alt="image"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ),
    },
    // Digital Art Landing Page
    {
      content: (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center">
          {/* <div className="text-center text-white max-w-4xl px-8">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                  <div className="w-4 h-4 bg-white/70 rounded-sm"></div>
                  <div className="w-4 h-4 bg-white/70 rounded-sm"></div>
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
              </div>
              <h1 className="text-8xl font-black mb-4">DIGITAL</h1>
              <p className="text-xl opacity-90">Where imagination meets pixels</p>
            </div>
            <div className="flex justify-center items-center gap-8 mt-12">
              <div className="w-40 h-32 bg-white/10 rounded-xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
              </div>
              <div className="text-6xl font-thin opacity-60">+</div>
              <div className="w-40 h-32 bg-white/15 rounded-xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-2 bg-gradient-to-tl from-white/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div> */}
          <img
            src="https://i.pinimg.com/1200x/e5/e9/26/e5e9265d77d948624ad357ea8d9d2f94.jpg"
            alt="image"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ),
    },
    // Editorial Design Landing Page
    {
      content: (
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center">
          {/* <div className="text-center text-white max-w-4xl px-8">
            <div className="mb-8">
              <div className="w-16 h-20 mx-auto mb-6 bg-white/20 rounded-sm flex flex-col items-center justify-center">
                <div className="w-10 h-1 bg-white mb-1"></div>
                <div className="w-8 h-1 bg-white/70 mb-1"></div>
                <div className="w-10 h-1 bg-white mb-1"></div>
                <div className="w-6 h-1 bg-white/70"></div>
              </div>
              <h1 className="text-6xl font-serif mb-4">EDITORIAL</h1>
              <p className="text-xl opacity-90">Layouts that tell compelling stories</p>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                <div className="w-full h-32 bg-white/20 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-white/60 rounded"></div>
                  <div className="h-2 bg-white/40 rounded w-3/4"></div>
                  <div className="h-2 bg-white/60 rounded"></div>
                </div>
              </div>
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                <div className="w-full h-32 bg-white/20 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-white/60 rounded"></div>
                  <div className="h-2 bg-white/40 rounded w-3/4"></div>
                  <div className="h-2 bg-white/60 rounded"></div>
                </div>
              </div>
            </div>
          </div> */}
          <img
            src="https://i.pinimg.com/1200x/69/61/76/696176e85452d3d216f95fe8d912b01d.jpg"
            alt="image"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Sliding Landing Pages */}
      {landingPages.map((page, index) => (
        <div
          key={`landing-${index}`}
          className={`absolute inset-0 transition-all duration-700 ease-out z-48 
            ${
            hoveredCard === index
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }
          `}
          style={{
            zIndex: hoveredCard === index ? 2 : 1,
            visibility:
              hoveredCard !== null && hoveredCard !== index
                ? "hidden"
                : "visible",
          }}
        >
          {page.content}
        </div>
      ))}

      <main className="w-full h-full flex flex-col justify-between py-10 relative">
        {/* Marquee */}
        <div className="px-6 sm:px-8 lg:px-10 mt-7 h-[25%]">
          {/* <ScrollMarquee
            numRows={1}
            rowTexts={[["CREATIVE", "DESIGN", "STUDIO", "PORTFOLIO", "BRANDING", "VISUAL", "IDENTITY"]]}
            speedMultiplier={1.2}
            numCopies={8}
            className="text-white/10 text-8xl sm:text-9xl lg:text-[12rem] xl:text-[15rem] font-black tracking-tighter"
            parallaxClassName="h-full"
            scrollerClassName="h-full"
            parallaxStyle={{ height: "100%" }}
            scrollerStyle={{ height: "100%" }}
          /> */}
          <HeroMarquee />
        </div>
        <div className="px-6 sm:px-8 lg:px-10 z-10">
          <div className="flex flex-col lg:flex-row lg:justify-between items-end gap-6 lg:gap-8">
            {/* Hero Text Section */}
            <section className="flex-1 lg:max-w-md xl:max-w-lg flex flex-col justify-center select-auto cursor-default">
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-tight mb-4 lg:mb-6 text-white">
                I craft solutions that align with your brand and engage your
                audience with meaningful and memorable experiences.
              </h1>
              <p className="color-wave text-gray-300 text-xs sm:text-sm uppercase tracking-tight flex gap-[0.15em]">
                {[..."[  SCROLL\u202FTO\u202FEXPLORE  ]"].map((char, i) => (
                  <span
                    key={i}
                    style={{ animationDelay: `${i * 0.1}s` }}
                    className="wave-letter"
                  >
                    {char}
                  </span>
                ))}
              </p>
            </section>

            {/* Portfolio Flex Section */}
            <section className="flex-1 lg:max-w-2xl">
              <div className="w-full">
                <div className="flex justify-between gap-2 sm:gap-3 lg:gap-4">
                  {portfolioItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer flex flex-col bg-white/60 hover:shadow-lg hover:shadow-zinc-500 transition-all duration-300 overflow-hidden border border-gray-700 flex-1 basis-0 backdrop-blur-sm"
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* ID Number */}
                      <div className="text-right p-1 sm:p-2 pb-1">
                        <span className="text-[10px] sm:text-xs text-gray-700">
                          [ {item.id} ]
                        </span>
                      </div>

                      {/* Image */}
                      <div className="bg-gray-200 overflow-hidden mx-1 sm:mx-2 mb-1 sm:mb-2 aspect-[4/3] relative">
                        <img
                          src={item.image}
                          alt="image"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Text */}
                      <div className="px-1 sm:px-2 pb-1 sm:pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-[10px] sm:text-xs font-medium text-gray-500 leading-tight">
                          "image"
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
