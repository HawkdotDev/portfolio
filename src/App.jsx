// import { useState } from 'react'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <main className='w-screen flex'>
        <div className="w-[20%] bg-slate-400 relative">
          <h1 className="fixed h-screen p-2">
            lol
          </h1>

        </div>
        <div className="w-[80%] bg-slate-600">
          {/* <h1>
            gotcha
          </h1> */}
          <div className="w-full h-screen bg-yellow-500">
            lendi
          </div>
          <div className="w-full h-screen bg-yellow-500">
            lendi2
          </div>
          
        </div>
        {/* <h1 className='m-2 text-lg'>Portfolio incoming</h1>
        <div className="card">
          <button className='bg-slate-700 p-2 mx-4 rounded-md border-white hover:border-pink-500 border-[2px]' onClick={() => setCount((count) => count + 1)}>
            click to count
          </button>
            {count}
        </div> */}
      </main>
    </>
  )
}

export default App
