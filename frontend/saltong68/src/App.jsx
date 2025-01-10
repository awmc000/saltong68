import { useState } from 'react'
import './App.css'
import Wordle from './Wordle'

function App() {
  const [length, setLength] = useState(6)

  const handleClick = () => {
    setLength((length) => length === 6 ? 8 : 6)
  }

  return (
    <>
      <h1>saltong68</h1>
      <Wordle length={length}/>
      <button onClick={handleClick}>
        Switch to {length === 6 ? 8 : 6}-letter words
      </button>
    </>
  )
}

export default App
