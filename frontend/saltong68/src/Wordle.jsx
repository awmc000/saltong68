import { useState } from 'react'
import Guess from './Guess'

const apiAddress = ''

/**
 * Returns the colors of each letter in a user's guess.
 * @param {string} guess The user's guess at the word.
 * @param {string} word The actual word.
 * @returns 
 */
const colorGuess = (guess, word) => {

  if (guess === undefined) {
    return "undef"
  }

  // Create a map of each letter to its quantity in the word.
  let letters = new Map()

	for (const ch of word) {
		if (letters.has(ch)) {
			letters.set(ch, letters.get(ch)+1)
		} else {
			letters.set(ch, 1)
		}
	}

  // Assign each character in the guess a color
	let colors = []

	for (let i = 0; i < word.length; i++) {
		let c = guess[i]

		if (word[i] == c) {
			colors = [...colors, ['greenLetter', c]]
		}
		else if (letters.has(c) && letters.get(c) > 0) {
			colors = [...colors, ['yellowLetter', c]]
		}
		else {
			colors = [...colors, ['redLetter', c]]
		}
		if (letters.has(c)) {
			letters.set(c, letters.get(c) - 1)
		}
	}
	return colors
}

/**
 * Retrieves today's word for a given length from the API.
 * @param {number} length Length of word to retrieve. A 6-letter word will
 * be retrieved if == 6, if equal to any other integer an 8-letter word will
 * be retrieved. 
 */
const getWord = (length) => {
  if (length == 6) {
    return "suliin"
  } else {
    return "abilidad"
  }
}

const getRandomWord = (length) => {

}

const Wordle = (props) => {
  let [word, setWord] = useState(getWord(props.length))
  let [guesses, setGuesses] = useState([])
  
  const makeGuess = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const guess = formData.get("nextGuess")
    if (guesses.length == props.length) {
      alert("You ran out of guesses.")
      return
    }
    if (guess.length == props.length) {
      setGuesses(prev => [...prev, guess])
    } else {
      alert("Enter a " + props.length + "-letter word.")
    }
  }

  return (
    <div className='card'>
      <p>dev: word is {word}</p>
      <form onSubmit={makeGuess}>
        <label htmlFor="nextGuess">Enter guess:</label>
        <input id="nextGuess" type="text" name="nextGuess"></input>
      </form>
      <table>
        <tbody>
          { Array.from(Array(props.length).keys()).map((i) => <Guess guess={colorGuess(guesses[i], word)}/>) }
        </tbody>
      </table>
    </div>
  )
}

  export default Wordle