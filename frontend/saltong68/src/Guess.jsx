import './Guess.css'

const Guess = (props) => {

  console.log(props.guess)

  const drawGuess = () => {
    let elements = []

    for (const ltr of props.guess) {
      elements.push(<td className={"letterCell " + ltr[0]}>{ltr[1]}</td>)
    }
    return elements
  }

  return (
    <tr>
      { drawGuess() }
    </tr>
  )
}

export default Guess