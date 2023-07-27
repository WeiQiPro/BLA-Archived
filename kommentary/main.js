import { EnumStates, Letters, Numbers, Coordinates, PathToKatago, Games, CashedGames, kataGo, NewBoard, CreateGame, moveToString, newBoardState, Vector, Move, Query, State } from './constants.js';
import KataGo from './src/katago.js';
import { CheckGuiConfig, SetGuiConfigVariable, GuiConfig, queryLogWriter, KataGoQueryMap } from './utility.js';
import OGS from './websocket.js'

const StateManagementSystem = (state) => {
    switch (state) {
        case EnumStates.LOAD:
            if (GuiConfig.value == 0) {
                CheckGuiConfig();
                SetGuiConfigVariable();
            } else {
                Games.push(CreateGame())
                State.value = EnumStates.GAMES
            }
            break;

        case EnumStates.IDLE:
            if (Games.length != 0) {
                State.value = EnumStates.GAMES
            }

            break;

        case EnumStates.GAMES:
            if (Games.length === 0) {
                State.value = EnumStates.IDLE
            }
            return GamesInProgress()

        case EnumStates.CLOSE:
            break;

        default:
            State.value = EnumStates.IDLE
    }
}

const GamesInProgress = () => {

    while (Games.length !== 0) {
        UpdateGames();
        GamesForAnalysis();

        if (Games.length === 0) {
            State.value = EnumStates.IDLE;
            break; // Exit the loop when no games are in the array
        }
    }
};

const UpdateGames = () => {
    // update games based on websocket interaction
}

const GamesForAnalysis = async () => { // Mark the function as async
    const queue = [];

    for (const index in Games) {
        const game = Games[index];
        const { current, previous } = game.move;
        if (current === previous) {
            continue;
        }
        queue.push(game);
    }

    if (queue.length !== 0) {
        for (const index in queue) {
            const game = queue[index];
            try {
                const analysis = await Query(game);
                analysis = KataGoQueryMap(analysis); //
                game.evaluation.unshift(analysis); // push eval to front
                queue.splice(index, 1); // Remove the processed game from the queue
            } catch (error) {
                console.error("Error occurred while querying:", error);
            }
        }
    }
};

const main = function () {
    OGS.onOpen();

    while (State.value != EnumStates.CLOSE) {
        StateManagementSystem(State.value);
    }
    
    if(State.value === EnumStates.CLOSE){
        kataGo.close();
        OGS.onClose();
    }
};

main();

