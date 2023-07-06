export default class Board {
  constructor(size = 19) {
    this.size = size;
    this.board = this.createEmptyBoard();
    this.currentPlayer = 'b'; // B for black, W for white
    this.lastMove = null;
    this.captures = {
      b: 0,
      w: 0
    };
  }

  // ...

  getInitialStones() {
    const initialStones = [];
    this.board.forEach((row, rowIndex) => {
      row.forEach((stone, colIndex) => {
        if (stone !== null) {
          initialStones.push([stone, [rowIndex, colIndex]]);
        }
      });
    });
    return initialStones;
  }

  toJSON() {
    return {
      size: this.size,
      board: this.board,
      currentPlayer: this.currentPlayer,
      lastMove: this.lastMove,
      captures: this.captures
    };
  }
}
