import owl from "./assets/icons/owl-b.svg";
import moon from "./assets/icons/moon.svg";
import sun from "./assets/icons/sun.svg";
import { useState } from "react";

// hover:bg-[#4e4e4e] hover:text-slate-300

function App() {
  const [IsLight, setIsLight] = useState(true);
  return (
    <>
      <main className="w-screen bg-[#c4bcb2] text-slate-700">
        <nav className="w-screen relative flex px-3">
          <img src={owl} alt="logo" className="w-[30px] mx-2" />
          <div className="w-full bg-[#c4bcb2] p-3 flex justify-center text-lg">
            The Daily Prophet
          </div>
          <button
            className="w-[35px] h-[35px] m-2 px-[1px] rounded-lg"
            onClick={() => {
              setIsLight(!IsLight);
              console.log("theme changed to " + IsLight ? "moon" : "sun");
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
          <div className="w-[20%] bg-[#c4bcb2] relative border-slate-700 border-r border-y">
            <h1 className="sticky top-0 h-screen p-2">lol</h1>
          </div>
          <div className="w-[80%] bg-[#c4bcb2] border-slate-700 border-t">
            <div className="w-full h-screen bg-[#c4bcb2] p-3">lendi</div>
            <div className="w-full h-screen bg-[#c4bcb2] p-3">lendi</div>
            <div className="w-full h-screen bg-[#c4bcb2] p-3">lendi</div>
            <div className="w-full h-screen bg-[#c4bcb2] p-3 border-slate-700 border-b">
              lendi last
            </div>
          </div>
        </div>
        <div className="w-screen flex justify-center p-2">
          Made with ❤️ by
          <a
            href="https://github.com/HawkdotDev"
            target="_blank"
            className="ml-1 px-[6px] text-[#c4bcb2] bg-slate-700"
          >
            HawkdotDev
          </a>
        </div>
      </main>
    </>
  );
}

export default App;
