import { useState } from 'react'
import Guess from './Guess'

const Wordle = (props) => {
  let [word, setWord] = useState("suliin")
  let [guesses, setGuesses] = useState([])
  
  return (
    <div className='card'>
      <p>TODO: Wordle component for word {word}</p>
      <form>
        <label htmlFor="nextGuess">Enter your next guess:</label>
        <input type="text" name="nextGuess"></input>
      </form>
      <table>
        <tbody>
          { Array.from(Array(props.length).keys()).map((i) => <Guess guess={guesses[i]}/>) }
        </tbody>
      </table>
    </div>
  )
}

  export default Wordle