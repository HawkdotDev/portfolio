// import { useState } from 'react'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <main className="w-screen bg-[#c4bcb2] text-slate-700">
        <nav className="w-screen relative">
          <div className="w-full bg-[#c4bcb2] p-3 flex justify-center">The Daily Prophet</div>
        </nav>
        <div className="flex">
          <div className="w-[20%] bg-[#c4bcb2] relative border-slate-700 border-[1px]">
            <h1 className="sticky top-0 h-screen p-2">lol</h1>
          </div>
          <div className="w-[80%] bg-[#c4bcb2] border-slate-700 border-t">
            <div className="w-full h-screen bg-[#c4bcb2] p-3">lendi</div>
            <div className="w-full h-screen bg-[#c4bcb2] p-3">lendi2</div>
          </div>
        </div>
        <div className="w-screen flex justify-center p-2">
          leona
        </div>
      </main>
    </>
  );
}

export default App;
