import { useState, useEffect } from 'react'
import Guess from './Guess'
import GuessForm from './GuessForm'
import HelpBox from './HelpBox'
import './Wordle.css'


/**
 * Returns the colors of each letter in a user's guess.
 * @param {string} guess The user's guess at the word.
 * @param {string} word The actual word.
 * @returns 2D array of the form [ ['color', char]] ] where
 * there are `guess.length` inner arrays corresponding to
 * the chars in that string.
 */
const colorGuess = (guess, word) => {

  if (guess === undefined || word === undefined) {
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
		} else if (letters.has(c) && letters.get(c) > 0) {
			colors = [...colors, ['yellowLetter', c]]
		} else {
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
  
  const apiAddress = "https://saltong68-api.vercel.app"

  /*
   * When switching length, fetch appropriate word from API
   */
  useEffect(() => {
    fetch(apiAddress + (props.length == 6 ? "/six" : "/eight"))
      .then(response => response.json())
      .then(data => setWord(data.word))
      .catch(err => console.log(err.message))
  }, [props.length])

  /*
   * Clear the guesses when the player switches length.
   */
  useEffect(() => {
    setGuesses([])
  }, [props.length])

  const makeGuess = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const guess = formData.get("nextGuess").toLowerCase().replace(/[^a-z]/gi, '')

    if (guesses.includes(guess)) {
      props.toastFunction("You already entered that word!")
      return
    }

    if (guesses.length == props.length) {
      props.toastFunction("You ran out of guesses.")
      return
    }

    if (guess.length != props.length) {
      props.toastFunction("Enter a " + props.length + "-letter word.")
      return
    }

    try {
      const response = await fetch(apiAddress + "/isword/" + guess)
      const data = await response.json()

      if (data.isword) {
        setGuesses(prev => [...prev, guess])
      } else {
        props.toastFunction("Not a word or not found in dictionary!")
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <>
      {(guesses[guesses.length-1] == word) && <span>You won! The correct word is {word}!</span>}
      {(guesses.length == props.length && guesses[guesses.length-1] != word) && <span>You lost, better luck tomorrow! The correct word was {word}!</span>}
      <HelpBox openMessage="❓See Help" closeMessage = "❓Hide Help">
        <ul>
          <li>
            Guess the 6 or 8 letter word by typing your guess in below, then hitting
            "Enter" or the "Guess" button.
          </li>
          <li>
            Every 24 hours a different word is selected
            for each length.
          </li>
          <li>
            Switching mode or refreshing will clear your guesses.
          </li>
        </ul>
      </HelpBox>
      <div className='card'>
        {guesses.length < props.length && <GuessForm guessFunction = {makeGuess}/>}
        
        <br></br>

        <div className={"guessCard card" + props.length}>
          <table >
            <tbody>
              { Array.from(Array(props.length).keys()).map((i) => <Guess key={"guess" + i} guess={colorGuess(guesses[i], word[0])}/>) }
            </tbody>
          </table>
        </div>
      </div>    
    </>
  )
}

export default Wordle