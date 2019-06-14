// tetrislogic.tsx

// importing stuff
import * as React from 'react'
import TetrisBoard from './tetrisboard'

// tetris props
type TetrisProps = {
  boardWidth: any,
  boardHeight: any
}

// tetris state props
type TetrisState = {
  activeTileX: number,
  activeTileY: number,
  activeTile: number,
  tileRotate: number,
  score: number,
  level: number,
  tileCount: number,
  gameOver: boolean,
  isPaused: boolean,
  field: any[],
  timerId: any,
  tiles: number[][][][]
}

// creating tetris component
class Tetris extends React.Component<TetrisProps, TetrisState> {
  constructor(props: any){
    super(props)

    // creating board based on number of boardHeight & boardWidth
    let field = []

    for(let y = 0; y < props.boardHeight; y++){
      let row = []

      for(let x = 0; x < props.boardWidth; x++){
        row.push(0)
      }

      field.push(row)
    }

    // setting start column to center
    let xStart = Math.floor(parseInt(props.boardWidth) / 2)

    // init state with start conditions
    this.state = {
      activeTileX: xStart,
      activeTileY: 1,
      activeTile: 1,
      tileRotate: 0,
      score: 0,
      level: 1,
      tileCount: 0,
      gameOver: false,
      isPaused: false,
      field: field,
      timerId: null,
      tiles: [
        // 7 tiles
        // each tile can be rotated 4 times (x&y)
        [
          // default square
          [[0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0]]
        ],
        [
          // cube tile (2x2)
          [[0, 0], [1, 0], [0, 1], [1, 1]],
          [[0, 0], [1, 0], [0, 1], [1, 1]],
          [[0, 0], [1, 0], [0, 1], [1, 1]],
          [[0, 0], [1, 0], [0, 1], [1, 1]]
        ],
        [
          // I tile
          [[0, -1], [0, 0], [0, 1], [0, 2]],
          [[-1, 0], [0, 0], [1, 0], [2, 0]],
          [[0, -1], [0, 0], [0, 1], [0, 2]],
          [[-1, 0], [0, 0], [1, 0], [2, 0]]
        ],
        [
          // T tile
          [[0, 0], [-1, 0], [1, 0], [1, -1]],
          [[0, 0], [1, 0],  [0, 1],  [1, -1]],
          [[0, 0], [-1, 0], [1, 0], [-1, 1]],
          [[0, 0], [-1, 0], [0, 1], [-1, -1]]
        ],
        [
          // L tile
          [[0, 0], [1, 0], [-1, 0], [1, -1]],
          [[0, 0], [0, 1], [0, -1], [1, 1]],
          [[0, 0], [1, 0], [-1, 0], [-1, 1]],
          [[0, 0], [0, 1], [0, -1], [-1, -1]]
        ],
        [
          // inverse L tile
          [[0, 0], [-1, 0], [1, 0],  [-1, -1]],
          [[0, 0], [0, 1],  [0, -1], [1, -1]],
          [[0, 0], [1, 0],  [-1, 0], [1, 1]],
          [[0, 0], [0, 1],  [0, -1], [-1, 1]]
        ],
        [
          // Z tile
          [[0, 0], [1, 0], [0, -1], [1, -1]],
          [[0, 0], [1, 0], [0, 1], [1, 1]],
          [[0, 0], [1, 0], [0, -1], [1, -1]],
          [[0, 0], [1, 0], [0, 1], [1, 1]]
        ],
        [
          // inverse Z tile
          [[0, 0], [-1, 0], [0, -1], [1, -1]],
          [[0, 0], [0, -1], [1, 0], [1, 1]],
          [[0, 0], [-1, 0], [0, -1], [1, -1]],
          [[0, 0], [0, -1], [1, 0], [1, 1]]
        ]
      ]
    }
  }

  // TODO: componentDidMount, componentWillUnmount etc.
}
