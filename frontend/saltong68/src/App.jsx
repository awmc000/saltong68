import { useState } from 'react'
import './App.css'
import Wordle from './Wordle'
import { ToastContainer, toast } from 'react-toastify'

function App() {
  const [length, setLength] = useState(6)

  const handleClick = () => {
    setLength((length) => length === 6 ? 8 : 6)
  }

  const notify = (msg) => {
    toast(msg, {
      closeButton: true,
      className: "errorToast"
    })
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
        Made with React, FastAPI and PostgreSQL by <a href="http://amccolm.codes">amccolm.codes</a> in January 2025.
      </small>

      <ToastContainer />
    </>
  )
}

export default App
