import { writeGamesToFile } from "./utility.js";
import { handleKataGoEvaluation, handleMoves } from "./games.util.js";

export const KataGoQueryMap = (queryLog) => {
    const setToGrid = (ownership) => {
        const size = 19;
        const board = [];

        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                const index = i * size + j;
                row.push(ownership[index]);
            }
            board.push(row);
        }

        return board;
    }

    const movesByInfo = (queryMoves) => {
        return queryMoves.map((queryMove) => {
            return [
                queryMove["move"],
                queryMove["lcb"],
                queryMove["prior"],
                queryMove["pv"]
            ];
        });
    };

    const queryMap = {
        currentPlayer: queryLog["rootInfo"]["currentPlayer"],
        root: {
            scoreLead: queryLog["rootInfo"]["scoreLead"],
            winrate: queryLog["rootInfo"]["winrate"]
        },
        sent: queryLog["sent"],
        moves: movesByInfo(queryLog["moveInfos"]),
        ownerShipMap: setToGrid(queryLog["ownership"])
    };

    return queryMap;
};

export const queryHandler = async (badukServer, game, move, kataGo) => {
    game.moves.list = handleMoves(move);
    game.moves.string = move;

    try {
        console.log(`query started for game ${game.query.id}`)
        console.log(`query:`, game.id + game.query.amount)
        const result = await kataGo.query(game);
        const evaluation = KataGoQueryMap(result);
        handleKataGoEvaluation(game, evaluation);
        await writeGamesToFile(game)
        const sendGame = game
        const payload = {
            type: 'game',
            data: sendGame
        }
        badukServer.client.emit('game', JSON.stringify(payload))

    } catch (err) {
        return
    }
};

