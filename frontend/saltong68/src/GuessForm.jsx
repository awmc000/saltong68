const GuessForm = (props) => {
    return (
        <form onSubmit={props.guessFunction}>
            {/* <label htmlFor="nextGuess">Enter guess:</label> */}
            <input id="nextGuess" type="text" name="nextGuess"></input>
            <input id="enter" name="enter" type="submit" value="Guess"></input>
        </form>
    )
}

export default GuessForm