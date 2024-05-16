import owlB from "./assets/icons/owl-b.svg";
import owlW from "./assets/icons/owl-w.svg";
import moon from "./assets/icons/moon.svg";
import sun from "./assets/icons/sun.svg";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ThemeButton from "./components/ThemeButton";

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
  // eslint-disable-next-line no-unused-vars
  const owl = IsLight ? owlB : owlW;

  const emailLink = "https://www.google.com";
  const paperName = "Dwaipayan Dutta";
  const year = 2024;

  const tl = gsap.timeline();

  useGSAP(() => {
    tl.to(mainRef.current, {
      y: "100vh",
      scale: 0.5,
      duration: 0.1,
      delay: 0.1,
    })
      .to(mainRef.current, {
        y: "-70vh",
        duration: 1,
      })
      .to(mainRef.current, {
        y: 0,
        duration: 1,
        scale: 1,
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
        <nav
          ref={navRef}
          className="w-screen relative flex px-3 justify-between"
        >
          {/* <img src={owl} alt="logo" className="w-[30px] mx-2" /> */}
          <div className="w-full bg-transparent p-2 flex text-4xl">
            {paperName}
          </div>
          <ThemeButton
            IsLight={IsLight}
            setIsLight={setIsLight}
            moonIcon={moon}
            sunIcon={sun}
          />
        </nav>
        <div className="flex">
          <div
            style={{
              borderColor: textColor,
            }}
            className="w-[20%] bg-transparent relative border-r border-y"
          >
            <h1
              style={{ backgroundColor: textColor, color: bgColor }}
              className="flex justify-center items-center text-4xl py-1 px-2"
            >
              Most Creative Developer of {year} ?
            </h1>
            <h1 className="sticky top-0 h-screen p-2">lendi stories</h1>
          </div>
          <div
            style={{
              borderColor: textColor,
            }}
            className="w-[80%] bg-transparent border-t"
          >
            <div className="w-full">
              <h1
                // style={{ backgroundColor: textColor, color: bgColor }}
                className="text-xl py-2"
              >
                About Dwaipayan
              </h1>
            </div>
            <div className="w-full h-screen bg-transparent p-3">lendi</div>
            <div className="w-full h-screen bg-transparent p-3">lendi 2</div>
            <div className="w-full h-screen bg-transparent p-3">
              return of lendi
            </div>
            <div
              style={{
                borderColor: textColor,
              }}
              className="w-full h-screen bg-transparent p-3 border-b"
            >
              the last lendi
            </div>
          </div>
        </div>
        <div id="scroller">
          <h1>
            Lets create something together{" "}
            <span style={{ backgroundColor: textColor, color: bgColor }}>
              <a href={emailLink} target="_blank">
                MAIL ME
              </a>
            </span>
          </h1>
          <h1>
            Lets create something together{" "}
            <span style={{ backgroundColor: textColor, color: bgColor }}>
              <a href={emailLink} target="_blank">
                MAIL ME
              </a>
            </span>
          </h1>
          <h1>
            Lets create something together{" "}
            <span style={{ backgroundColor: textColor, color: bgColor }}>
              <a href={emailLink} target="_blank">
                MAIL ME
              </a>
            </span>
          </h1>
        </div>
        <div
          style={{
            borderColor: textColor,
          }}
          className="w-screen flex justify-center p-2 border"
        >
          Made with ❤️ by
          <a
            href="https://github.com/HawkdotDev"
            target="_blank"
            style={{
              backgroundColor: textColor,
              color: bgColor,
            }}
            className="ml-[6px] px-[5px]"
          >
            HawkdotDev
          </a>
        </div>
      </main>
    </>
  );
}

export default App;
