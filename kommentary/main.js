import { States, Letters, Numbers, Coordinates, PathToKatago, Games, CashedGames, kataGo, NewBoard, CreateGame, moveToString, newBoardState, Vector, Move, Query, State} from './workflow.js';
import { CheckGuiConfig, SetGuiConfigVariable, GuiConfig, queryLogWriter, KataGoQueryMap } from './utility.js';
const StateManagementSystem = (state) => {
    switch (state) {
        case States.LOAD:
            if(GuiConfig.value == 0){
            CheckGuiConfig();
            SetGuiConfigVariable();
            } else {
                Games.push(CreateGame())
                State.value = States.GAMES
            }
            break;

        case States.IDLE:
            if(Games.length != 0){
                State.value = States.GAMES
            }

            break;

        case States.GAMES:
            if(Games.length === 0){
                State.value = States.IDLE
            }
            return GamesInProgress()

        case States.CLOSE:
            break;

        default:
            State.value = States.IDLE
    }
}

const GamesInProgress = () => {
    while (Games.length != 0) {
        for(const game in Games) {
            console.log(`found a game... ${Games[game]}`)
            Games.splice(0, Games.length)
        }
        
        //for game in Games eventlisteners or websocket update
        //check current board state with previous board state
        //add moves to the game in the Games array
        //send query to katago to update evaluation
        //evaluation should hold history of query searches for 
        if (Games.length === 0) {
            State.value = States.IDLE;
            break; // Exit the loop when no games are in the array
          }
    }
}

const main = function () {
    while (State.value != States.CLOSE) {
        StateManagementSystem(State.value);
    }
};

main();

