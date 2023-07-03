export default class Board {
    constructor(size = 19) {
      this.size = size;
      this.board = this.createEmptyBoard();
      this.currentPlayer = "b"; // B for black, W for white
      this.lastMove = null;
      this.captures = {
        B: 0,
        W: 0
      };
    }
  
    createEmptyBoard() {
      const board = [];
      for (let i = 0; i < this.size; i++) {
        board[i] = new Array(this.size).fill(null);
      }
      return board;
    }
  
    playMove(row, col) {
      if (this.isValidMove(row, col)) {
        this.board[row][col] = this.currentPlayer;
        this.lastMove = { row, col };
        this.updateCaptures(row, col);
        this.switchPlayer();
        return true;
      }
      return false;
    }
  
    isValidMove(row, col) {
      return (
        row >= 0 &&
        row < this.size &&
        col >= 0 &&
        col < this.size &&
        this.board[row][col] === null
      );
    }
  
    updateCaptures(row, col) {
      const neighbors = this.getNeighbors(row, col);
      for (const [r, c] of neighbors) {
        const stone = this.board[r][c];
        if (stone && stone !== this.currentPlayer) {
          if (!this.hasLiberties(r, c)) {
            this.captures[stone]++;
            this.board[r][c] = null;
          }
        }
      }
    }
  
    hasLiberties(row, col) {
      const visited = this.createEmptyBoard();
      const player = this.board[row][col];
      const liberties = [];
  
      const dfs = (r, c) => {
        if (
          r < 0 ||
          r >= this.size ||
          c < 0 ||
          c >= this.size ||
          visited[r][c] ||
          this.board[r][c] !== player
        ) {
          return;
        }
  
        visited[r][c] = true;
        const neighbors = this.getNeighbors(r, c);
        for (const [nr, nc] of neighbors) {
          if (this.board[nr][nc] === null) {
            liberties.push({ row: nr, col: nc });
          } else {
            dfs(nr, nc);
          }
        }
      };
  
      dfs(row, col);
      return liberties.length > 0;
    }
  
    getNeighbors(row, col) {
      return [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1]
      ];
    }
  
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


    switchPlayer() {
      this.currentPlayer = this.currentPlayer === "b" ? "w" : "b";
    }
  
    getBoard() {
      return this.board;
    }
  
    getCurrentPlayer() {
      return this.currentPlayer;
    }
  
    getLastMove() {
      return this.lastMove;
    }
  
    getCaptures(player) {
      return this.captures[player];
    }
  }
  