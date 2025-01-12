const GuessForm = (props) => {
    return (
        <form onSubmit={props.guessFunction}>
            <input id="nextGuess" type="text" name="nextGuess"></input>
            <input id="enter" name="enter" type="submit" value="Guess"></input>
        </form>
    )
}

export default GuessForm