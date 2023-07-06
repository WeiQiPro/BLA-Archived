import fs from 'fs'

export const queryLogWriter = function (response) {
    const queryLog = 'query_logs/querylogs.json';

    fs.access(queryLog, fs.constants.F_OK, (findError) => {
        if (findError) {
            fs.writeFile(queryLog, JSON.stringify(response), (writeError) => {
                if (writeError) {
                    console.error('Error writing to file:', writeError);
                    return;
                }
                console.log('Query was written to queryLog');
            });
        } else {
            fs.writeFile(queryLog, JSON.stringify(response), (writeError) => {
                if (writeError) {
                    console.error('Error writing to file:', writeError);
                    return;
                }
                console.log('Query was written to queryLog');
            });
        }
    });
};

export const KataGoQueryMap = function (queryLog) {

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
        root: {
            scoreLead: queryLog["rootInfo"]["scoreLead"],
            winrate: queryLog["rootInfo"]["winrate"]
        },
        moves: movesByInfo(queryLog["moveInfos"]),
        ownerShipMap: setToGrid(queryLog["ownership"])
    };

    for (const move of queryMap.moves) {
        console.log(move[0]);
        console.log(move[1]);
    }
      

    return queryMap;
};
