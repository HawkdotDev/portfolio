import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className='w-screen h-screen flex flex-col justify-center items-center'>
        <h1 className='m-2 text-lg'>Portfolio incoming</h1>
        <div className="card">
          <button className='bg-slate-700 p-2 mx-4 rounded-md border-white hover:border-pink-500 border-[2px]' onClick={() => setCount((count) => count + 1)}>
            click to count
          </button>
            {count}
        </div>
      </main>
    </>
  )
}

export default App
