const GuessForm = (props) => {
    return (
        <form onSubmit={props.guessFunction}>
            <label htmlFor="nextGuess">Enter guess:</label>
            <input id="nextGuess" type="text" name="nextGuess"></input>
        </form>
    )
}

export default GuessForm