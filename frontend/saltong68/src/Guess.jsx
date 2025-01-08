import './Guess.css'

const Guess = (props) => {

  const drawGuess = () => {
    let elements = []
    let i = 1

    for (const ltr of props.guess) {
      elements.push(<td key={`${ltr[0]}-${i}`} className={"letterCell " + ltr[0] + " delay" + i++}>{ltr[1]}</td>)
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