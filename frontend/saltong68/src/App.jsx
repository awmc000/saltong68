import { useState } from 'react'
import './App.css'
import Wordle from './Wordle'

function App() {
  const [length, setLength] = useState(6)

  return (
    <>
      <h1>saltong68</h1>
      <div className="card">
        <button onClick={() => setLength((length) => length === 6 ? 8 : 6)}>
          length is {length}
        </button>
      </div>
      <Wordle length={length}/>
    </>
  )
}

export default App
