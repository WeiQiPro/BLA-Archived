import KataGo from './src/katago.js'
import Kifu from './src/goban/kifu.js'
import Board from './src/goban/board.js'
import fs, { write } from 'fs'

const queryLogWriter = function (response) {
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

const path = {
    katago: 'src/katago/katago.exe',
    config: 'src/katago/default_gtp.cfg',
    model: 'src/katago/default_model.bin.gz'
}
const katago = new KataGo(path.katago, path.config, path.model);

const initialBoard = new Board(19); // Create a 19x19 board
initialBoard.playMove(3, 3); // Play a black stone at position (3, 3)
const komi = 7.5;
const moves = [['b', [3, 3]]];


// Query KataGo
katago.query(initialBoard, moves, komi)
    .then((response) => {
        queryLogWriter(response);
        katago.close();
    })
    .catch((error) => {
        console.error('Error:', error);
        katago.close();
    });