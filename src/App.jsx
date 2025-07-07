import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import LocomotiveScroll from "locomotive-scroll";
import ScrollMarquee from "./components/ScrollMarquee";

// eslint-disable-next-line no-unused-vars
const locomotiveScroll = new LocomotiveScroll();

function App() {
  return (
    <div className="App">
      <Navbar />

      {/* Hero section */}
      <div className="min-h-screen w-full relative">
        <Hero />
      </div>
      <ScrollMarquee
        numRows={2}
        rowTexts={[
          ["Design", "Code", "Storytelling", "Dwaipayan Dutta"],
          ["React", "GSAP", "Tailwind", "Framer Motion"],
        ]}
        speedMultiplier={0.25}
      />

      {/* Other components would be placed here */}
      <div className="h-[50vh] w-screen bg-black"></div>
      <Footer />
    </div>
  );
}

export default App;
