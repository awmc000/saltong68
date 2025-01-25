import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import Wordle from './Wordle'
import './App.css'

function App() {
  const [length, setLength] = useState(6)

  const handleClick = () => {
    setLength((length) => length === 6 ? 8 : 6)
  }

  const notify = (msg) => {
    toast.error(msg)
  }

  return (
    <>
      <h1>🇵🇭saltong68</h1>
      <Wordle length={length} toastFunction={notify}/>
      <button onClick={handleClick}>
        🔄 To {length === 6 ? 8 : 6}-letter words
      </button>

      <br></br>
      <br></br>

      <small>
        Made by <a href="http://amccolm.codes">amccolm.codes</a> in January 2025.
      </small>

      <ToastContainer />
    </>
  )
}

export default App
