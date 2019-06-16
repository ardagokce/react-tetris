// tetrisboard.tsx

// importing React
import * as React from 'react'


// tetrisboard props
type TetrisBoardProps = {
  field    : any[],
  gameOver : boolean,
  score    : number,
  level    : number,
  rotate   : number
}

// creating tetrisboard component
const TetrisBoard: React.FC<TetrisBoardProps> = (props) => {
  // creating rows
  let rows: any[] = []

  props.field.forEach((row, index) => {
    // creating columns
    const cols = row.map((column: any, index: number) =>
    <div className={`col-${column}`} key={index} />)

    rows.push(
    <div className={"tetrisboard__row"} key={index}>{cols}</div>)
    })

    return (
      <div className="tetrisboard">
        {/* Game info */}
        <div className="tetrisboard__info">
          <p className="tetrisboard__text">Level: {props.level}</p>
          <p className="tetrisboard__text">Score: {props.score}</p>

          {props.gameOver &&
          <p className="tetrisboard__text">
            <strong>Game Over</strong>
          </p>
          }
        </div>

      {/* Game board */}
        <div className="tetrisboard__board">{rows}</div>
      </div>
    )
}

export default TetrisBoard
