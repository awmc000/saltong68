import { useState, useEffect } from 'react'
import Guess from './Guess'
import GuessForm from './GuessForm'
import './Wordle.css'

const apiAddress = "http://127.0.0.1:8000"

/**
 * Returns the colors of each letter in a user's guess.
 * @param {string} guess The user's guess at the word.
 * @param {string} word The actual word.
 * @returns 2D array of the form [ ['color', char]] ] where
 * there are `guess.length` inner arrays corresponding to
 * the chars in that string.
 */
const colorGuess = (guess, word) => {

  if (guess === undefined) {
    return "undef"
  }

  guess = guess.toUpperCase()
  word = word.toUpperCase()

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

const Wordle = (props) => {
  let [word, setWord] = useState('loading...')
  let [guesses, setGuesses] = useState([])
  
  useEffect(() => {
    fetch(apiAddress + (props.length == 6 ? "/six" : "/eight"))
      .then(response => response.json())
      .then(data => setWord(data.word))
      .catch(err => console.log(err.message))
  }, [props.length])

  const makeGuess = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const guess = formData.get("nextGuess").toLowerCase().replace(/[^a-z]/gi, '')

    if (guesses.length == props.length) {
      alert("You ran out of guesses.")
      return
    }

    if (guess.length != props.length) {
      alert("Enter a " + props.length + "-letter word.")
      return
    }

    try {
      const response = await fetch(apiAddress + "/isword/" + guess)
      const data = await response.json()

      if (data.isword) {
        setGuesses(prev => [...prev, guess])
      } else {
        alert("Not a word!")
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <>
      {(guesses[guesses.length-1] == word) && <span>You won! The correct word is {word}!</span>}
      {(guesses.length == props.length && guesses[guesses.length-1] != word) && <span>You lost, better luck tomorrow! The correct word was {word}!</span>}
      <div className='card'>
        <code>dev: word is {word}</code>
        
        {guesses.length < props.length && <GuessForm guessFunction = {makeGuess}/>}
        
        <br></br>


        
        <div className={"guessCard card" + props.length}>
          <table >
            <tbody>
              { Array.from(Array(props.length).keys()).map((i) => <Guess key={"guess" + i} guess={colorGuess(guesses[i], word)}/>) }
            </tbody>
          </table>
        </div>
      </div>    
    </>
  )
}

export default Wordle