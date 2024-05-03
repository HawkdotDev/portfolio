import owlB from "./assets/icons/owl-b.svg";
import owlW from "./assets/icons/owl-w.svg";
import moon from "./assets/icons/moon.svg";
import sun from "./assets/icons/sun.svg";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// bg-[#c4bcb2] text-slate-700
// hover:bg-[#4e4e4e] hover:text-slate-300

function App() {
  const mainRef = useRef();
  const navRef = useRef();
  const [IsLight, setIsLight] = useState(true);

  // light theme
  const lightBG = "#c4bcb2";
  const lightText = "#4e4e4e";

  // dark theme
  const darkBG = "#333333";
  const darkText = "#c4bcb2";

  const bgColor = IsLight ? lightBG : darkBG;
  const textColor = IsLight ? lightText : darkText;
  const owl = IsLight ? owlB : owlW;

  const tl = gsap.timeline();

  useGSAP(() => {
    tl.to(mainRef.current, {
      y: "100vh",
      scale: 0.5,
      duration: 0.1,
      delay: 0.1,
    })
      .to(mainRef.current, {
        y: "40vh",
        duration: 1,
      })
      .to(mainRef.current, {
        y: 0,
        duration: 1,
        scale: 1,
        rotate: 360,
      });
  });

  return (
    <>
      <main
        ref={mainRef}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
        className="w-screen text-lg"
      >
        <nav ref={navRef} className="w-screen relative flex px-3">
          <img src={owl} alt="logo" className="w-[30px] mx-2" />
          <div className="w-full bg-transparent p-2 flex justify-center text-3xl">
            The Daily Oracle
          </div>
          <button
            className="w-[35px] h-[35px] m-2 px-[1px] rounded-lg"
            onClick={() => {
              setIsLight(!IsLight);
              IsLight ? console.log("moon") : console.log("sun");
            }}
          >
            <img
              src={IsLight ? moon : sun}
              alt="logo"
              className="w-full h-full rounded-full"
            />
          </button>
        </nav>
        <div className="flex">
          <div
            style={{
              borderColor: textColor ? textColor : "#0000FF",
            }}
            className="w-[20%] bg-transparent relative border-r border-y"
          >
            <h1 className="sticky top-0 h-screen p-2">laura</h1>
          </div>
          <div
            style={{
              borderColor: textColor ? textColor : "#0000FF",
            }}
            className="w-[80%] bg-transparent border-t"
          >
            <div className="w-full">
              <h1
                style={{ backgroundColor: textColor, color: bgColor }}
                className="flex justify-center items-center text-6xl"
              >
                DWAIPAYAN DUTTA
              </h1>
            </div>
            <div className="w-full h-screen bg-transparent p-3">lendi</div>
            <div className="w-full h-screen bg-transparent p-3">lendi 2</div>
            <div className="w-full h-screen bg-transparent p-3">
              return of lendi
            </div>
            <div
              style={{
                borderColor: textColor ? textColor : "#0000FF",
              }}
              className="w-full h-screen bg-transparent p-3 border-b"
            >
              the last lendi
            </div>
          </div>
        </div>
        {/* <div className="flex overflow-y-hidden p-[30px] whitespace-nowrap">
          <h1 className=" inline-block mx-2 animate-move font-thin text-[80px]">
            Lets create something together <span className="font-thin">EMAIL ME</span>
          </h1>
          <h1 className=" inline-block mx-2 animate-move font-thin text-[80px]">
            Lets create something together <span className="font-thin">EMAIL ME</span>
          </h1>
          <h1 className=" inline-block mx-2 animate-move font-thin text-[80px]">
            Lets create something together <span className="font-thin">EMAIL ME</span>
          </h1>
        </div> */}
        <div id="scroller">
            <h1>Lets create something together <span style={{ backgroundColor: textColor, color: bgColor }}>EMAIL ME</span></h1>
            <h1>Lets create something together <span style={{ backgroundColor: textColor, color: bgColor }}>EMAIL ME</span></h1>
            <h1>Lets create something together <span style={{ backgroundColor: textColor, color: bgColor }}>EMAIL ME</span></h1>
         </div>
        <div className="w-screen flex justify-center p-2">
          Made with ❤️ by
          <a
            href="https://github.com/HawkdotDev"
            target="_blank"
            style={{ backgroundColor: textColor, color: bgColor }}
            className="ml-[6px] px-[5px] text-[#c4bcb2] bg-slate-700"
          >
            HawkdotDev
          </a>
        </div>
      </main>
    </>
  );
}

export default App;
