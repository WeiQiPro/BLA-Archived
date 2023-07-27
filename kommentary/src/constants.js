// Import the KataGo class from the provided file
import KataGo from "./src/katago.js";

// Constants
export const CashedGames = [];
export const Games = [];

export const PathToKatago = ['src/katago/katago.exe', 'src/katago/default_gtp.cfg', 'src/katago/default_model.bin.gz']; //katago, config, model
export const kataGo = new KataGo(PathToKatago[0], PathToKatago[1], PathToKatago[2]);

export const Letters = 'ABCDEFGHJKLMNOPQRST';
export const Numbers = Array.from({ length: 19 }, (_, i) => i + 1);
export const Coordinates = { letters: Letters, numbers: Numbers };

export const EnumStates = {
  IDLE: 1,
  GAMES: 2,
  CLOSE: 3,
  LOAD: 0
}
export const State = { value: EnumStates.LOAD }


export const NewBoard = (size) => Array.from({ length: size }, () => Array(size).fill(null));
export const Vector = (x, y) => [x, y];
export const Move = (player, vector) => [player, vector];

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
    moves: {
      list: [],
      current: "",
      previous: ""
    },
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

export const moveToString = (move) => {
  const [x, y] = move;
  const col = Letters[x] || '';
  const row = Numbers[y - 1] || '';
  return col + row;
};

export const newBoardState = (board, move) => {
  // Implementation for updating the board state based on the move
};

export const Query = async (GameInput, maxVisits = null) => {
  const game = GameInput;
  const query = {};

  query.id = String(game.info.id + game.queries);
  game.queries += 1;

  query.moves = game.moves.list.map(([color, move]) => [color, moveToString(move)]);
  query.rules = game.info.rules;
  query.komi = game.info.komi;
  query.boardXSize = game.info.size;
  query.boardYSize = game.info.size;
  query.includePolicy = true;
  query.kata_analysis = true;
  query.includeOwnership = true;
  
  if (maxVisits !== null) {query.maxVisits = maxVisits;}

  kataGo.stdin.write(JSON.stringify(query) + '\n');

  return new Promise((resolve, reject) => {
    kataGo.stdout.once('data', (data) => {
      const response = JSON.parse(data.toString());
      resolve(response);
    });

    kataGo.once('error', (error) => {
      reject(error);
    });
  })
    .catch((error) => {
      console.error("Error occurred while querying:", error);
      throw error; // Re-throw the error to propagate it to the caller
    });
};