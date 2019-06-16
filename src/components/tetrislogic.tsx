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

  /**
    * @description Sets timer after component mounts
    * Uses level (this.state.level) to determine the interval (game speed)
    * and executes handleBoardUpdate() set to 'down' method during
    * each interval
    * @memberof Tetris
  **/

  componentDidMount() {
    let timerId

    timerId = window.setInterval(
      () => this.handleBoardUpdate('down'),
      1000 - (this.state.level * 10 > 600 ? 600 : this.state.level * 10)
    )

    this.setState({
      timerId: timerId
    })
  }

  /**
    * @description Resets the timer when component unmounts
    * @memberof Tetris
  **/

  componentWillUnmount() {
    window.clearInterval(this.state.timerId)
  }

  /**
    * @description Handles board updates
    * @param {string} command
    * @memberof Tetris
  **/

  handleBoardUpdate(command: string) {
    // Do nothing if gameOver or isPaused
    if(this.state.gameOver || this.state.isPaused) {
      return
    }

    // Prepare vars for additions to x/y, current active tile and new rotation
    let xAdd = 0
    let yAdd = 0
    let rotateAdd = 0
    let tile = this.state.activeTile

    // if tile should move left
    // set xAdd to -1
    if (command === 'left') {
      xAdd = -1
    }

    // if tile should move right
    // set xAdd to 1
    if (command === 'right') {
      xAdd = 1
    }

    // if tile should be rotated
    // set rotateAdd to 1
    if (command === 'rotate') {
      rotateAdd = 1
    }

    // if tile should fall faster
    // set yAdd to 1
    if (command === 'down') {
      yAdd = 1
    }

    // Get current x/y, active tile, rotate and all tiles
    let field = this.state.field
    let x = this.state.activeTileX
    let y = this.state.activeTileY
    let rotate = this.state.tileRotate

    const tiles = this.state.tiles

    // Remove actual tile from field to test for new insert position
    field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] = 0
    field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] = 0
    field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] = 0
    field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] = 0

    // Test if the move can be executed on actual field
    let xAddIsValid = true

    // Test if tile should move horizontally
    if (xAdd !== 0){
      for (let i = 0; i <= 3; i++){
        // Test if tike can be moved without getting outside the board
        if (
          x + xAdd + tiles[tile][rotate][i][0] >= 0
          &&
          x + xAdd + tiles[tile][rotate][i][0] < this.props.boardWidth
           ){
             if (
                  field[y + tiles[tile][rotate][i][1]][x + xAdd + tiles[tile][rotate][i][0]] !== 0
                ){
                  // Prevent moved
                  xAddIsValid = false
                }
              } else{
                // Prevent move
                xAddIsValid = false
              }
            }
          }

    // If horizontal move is valid update x variable (move the tile)
    if (xAddIsValid){
      x += xAdd
    }

    // Try to rotate the tile
    let newRotate = rotate + rotateAdd > 3 ? 0 : rotate + rotateAdd
    let rotateIsValid = true

    // Test if tile should rotate
    if(rotateAdd !== 0){
      for(let i = 0; i <= 3; i++){
        // Test if tile can be rotated without getting outside the board
        if(
          x + tiles[tile][newRotate][i][0] >= 0
          &&
          x + tiles[tile][newRotate][i][0] < this.props.boardWidth
          &&
          y + tiles[tile][newRotate][i][1] >= 0
          &&
          y + tiles[tile][newRotate][i][1] < this.props.boardHeight
        ){
          // Test if tile roration is not blocked by other tiles
          if(
            field[y + tiles[tile][newRotate][i][1]][x + tiles[tile][newRotate][i][0]] !== 0
          ){
            // Prevent rotation
            rotateIsValid = false
          }
        } else {
          // Prevent rotation
          rotateIsValid = false
        }
      }
    }

    // If rotation is valid update rotate variabl (rotate the tile)
    if(rotateIsValid){
      rotate = newRotate
    }

    // Try to speed up the fall of the tile
    let yAddIsValid = true

    // Test if tile should fall faster
    if(yAdd !== 0){
      for(let i = 0; i <= 3; i++){
        // Test if tile can fall faster without getting outside the board
        if(
          y + yAdd + tiles[tile][rotate][i][1] >= 0
          &&
          y + yAdd + tiles[tile][rotate][i][1] < this.props.boardHeight
        ){
          // Test if faster fall is not blocked by other tiles
          if(
            field[y + yAdd + tiles[tile][rotate][i][1]][x + tiles[tile][rotate][i][0]] !== 0
          ){
            // Prevent faster fall
            yAddIsValid = false
          }
        } else {
          // Prevent faster fall
          yAddIsValid = false
        }
      }
    }

    // If speeding up the fall is valid (move the tile down faster)
    if(yAddIsValid){
      y += yAdd
    }

    // Render the tile at new position
    field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] = tile
    field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] = tile
    field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] = tile
    field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] = tile

    // If moving down is not possible, remove completed rows add score
    // and find next tike and check if game is over
    if(!yAddIsValid){
      for(let row = this.props.boardHeight - 1; row >= 0; row--){
        let isLineComplete = true

        // Check if row is completed
        for(let col = 0; col < this.props.boardWidth; col++){
          if(field[row][col] === 0){
            isLineComplete = false
          }
        }

        // Remove completed rows
        if(isLineComplete){
          for(let yRowSrc = row; row > 0; row--){
            for(let col = 0; col < this.props.boardWidth; col++){
              field[row][col] = field[row-1][col]
            }
          }

        // Check if the row is the last
        row = this.props.boardHeight
        }
      }

      // Update state, score, number of tiles, change level
      this.setState(prev => ({
        score: prev.score + 1 * prev.level,
        tileCount: prev.tileCount + 1,
        level: 1 + Math.floor(prev.tileCount / 10)
      }))

      // Prepare new timer
      let timerId

      // Reset the timer
      clearInterval(this.state.timerId)

      // Update the timer
      timerId = setInterval(
        () => this.handleBoardUpdate('down'),
        1000 - (this.state.level * 10 > 600 ? 600 : this.state.level * 10)
      )

      // Use new timer
      this.setState({
        timerId: timerId
      })

      // Create new tile
      tile = Math.floor(Math.random() * 7 + 1)
      x = parseInt(this.props.boardWidth) / 2
      y = 1
      rotate = 0

      // Test if game is over - test if new tile can't be placed in field
      if(
        field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] !== 0 ||
        field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] !== 0 ||
        field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] !== 0 ||
        field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] !== 0
      ){
        // Stop the game
        this.setState({
          gameOver: true
        })
      } else {
        // Otherwise, render new tile and continue
        field[y + tiles[tile][rotate][0][1]][x + tiles[tile][rotate][0][0]] = tile
        field[y + tiles[tile][rotate][1][1]][x + tiles[tile][rotate][1][0]] = tile
        field[y + tiles[tile][rotate][2][1]][x + tiles[tile][rotate][2][0]] = tile
        field[y + tiles[tile][rotate][3][1]][x + tiles[tile][rotate][3][0]] = tile
      }
    }

    // Update state - use new field, active x/y, rotation and activeTile
    this.setState({
      field: field,
      activeTileX: x,
      activeTileY: y,
      tileRotate: rotate,
      activeTile: tile
    })
  }

  /**
    * @description Stops and resumes the game
    * @memberof Tetris
  **/
  handlePauseClick = () => {
    this.setState(prev => ({
      isPaused: !prev.isPaused
    }))
  }

  /**
    * @description Resets the game
    * @memberof Tetris
  **/
  handleNewGameClick = () => {
    // Create an empty board
    let field: any[] = []

    for(let y = 0; y < this.props.boardHeight; y++){
      let row = []

      for(let x = 0; x < this.props.boardWidth; x++){
        row.push(0)
      }

      field.push(row)
    }

    // Set starting column to center
    let xStart = Math.floor(parseInt(this.props.boardWidth) / 2)

    // Initialize state with starting conditions
    this.setState({
      activeTileX: xStart,
      activeTileY: 1,
      activeTile: 2,
      tileRotate: 0,
      score: 0,
      level: 1,
      tileCount: 0,
      gameOver: false,
      field: field
    })
  }

  render() {
    return (
      <div className="tetris">

        {/* Tetris Board */}
        <TetrisBoard
          field = {this.state.field}
          gameOver = {this.state.gameOver}
          score = {this.state.score}
          level = {this.state.level}
          rotate = {this.state.tileRotate}
        />

        {/* Buttons to control blocks */}
        <div className='tetris__block-controls'>
          <button className="btn" onClick={() =>
          this.handleBoardUpdate('left')}>Left</button>

          <button className="btn" onClick={() =>
          this.handleBoardUpdate('down')}>Down</button>

          <button className="btn" onClick={() =>
          this.handleBoardUpdate('right')}>Right</button>

          <button className="btn" onClick={() =>
          this.handleBoardUpdate('rotate')}>Rotate</button>
        </div>

        {/* Buttons to control game */}
        <div className='tetris__game-controls'>
          <button className="btn" onClick={this.handleNewGameClick}>New Game</button>
          <button className="btn" onClick={this.handlePauseClick}>
          {this.state.isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
    )
  }
}

export default Tetris
