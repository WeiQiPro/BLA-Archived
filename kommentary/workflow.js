// Import the KataGo class from the provided file
import KataGo from "./src/katago.js";

// Constants
export const States = {
  IDLE: 1,
  GAMES: 2,
  CLOSE: 3,
  LOAD: 0
}
export const State = {value: States.LOAD}
export const GuiConfig = {value: 0}
export const Letters = 'ABCDEFGHJKLMNOPQRST';
export const Numbers = Array.from({ length: 19 }, (_, i) => i + 1);
export const Coordinates = { letters: Letters, numbers: Numbers };
export const PathToKatago = ['src/katago/katago.exe', 'src/katago/default_gtp.cfg', 'src/katago/default_model.bin.gz']; //katago, config, model
export const Games = [];
export const CashedGames = [];


// Create a new instance of KataGo with the provided paths
export const kataGo = new KataGo(PathToKatago[0], PathToKatago[1], PathToKatago[2]);

// Function to create a new board with a given size
export const NewBoard = (size) => Array.from({ length: size }, () => Array(size).fill(null));

// Function to create a new game
export const CreateGame = () => {
  return {
    info: {
      id: "",
      size: 19,
      rules: "Chinese",
      komi: 7.5
    },
    queries: 0,
    board: {
      size: 19,
      current: NewBoard(19),
      previous: [],
      history: []
    },
    moves: [],
    players: {
      black: {
        id: "black player",
        rank: "?"
      },
      white: {
        id: "white player",
        rank: "?"
      }
    },
    evaluation: []
  };
};

// Function to convert a move (vector) to a string representation
export const moveToString = (move) => {
  const [x, y] = move;
  const col = Letters[x] || '';
  const row = Numbers[y - 1] || '';
  return col + row;
};

// Function to update the board state based on the move
export const newBoardState = (board, move) => {
  // Implementation for updating the board state based on the move
};

// Function to create a vector from given x and y components
export const Vector = (x, y) => [x, y];

// Function to create a move object from the given player and vector
export const Move = (player, vector) => [player, vector];

// Function to create and execute a query
export const Query = (GameInput, maxVisits = null) => {
  const game = GameInput;
  const query = {};

  query.id = String(game.info.id + game.queries);
  game.queries += 1;

  query.moves = game.moves.map(([color, move]) => [color, moveToString(move)]);
  query.rules = game.info.rules;
  query.komi = game.info.komi;
  query.boardXSize = game.info.size;
  query.boardYSize = game.info.size;
  query.includePolicy = true;
  query.kata_analysis = true;
  query.includeOwnership = true;
  if (maxVisits !== null) {
    query.maxVisits = maxVisits;
  }

  console.log(JSON.stringify(query));
  kataGo.stdin.write(JSON.stringify(query) + '\n');

  return new Promise((resolve, reject) => {
    kataGo.stdout.once('data', (data) => {
      const response = JSON.parse(data.toString());
      resolve(response);
    });

    kataGo.once('error', (error) => {
      reject(error);
    });
  });
};