import { resolve } from 'path'
import KataGo from './src/katago.js'
import { KataGoQueryMap, queryLogWriter } from './src/utils.js'

const board = (size) => {
    let grid = []
    for (let i = 0; i < size; i++) {
        grid[i] = new Array(size).fill(null)
    }

    return grid
}

const main = async function () {

    const path = {
        katago: 'src/katago/katago.exe',
        config: 'src/katago/default_gtp.cfg',
        model: 'src/katago/default_model.bin.gz'
    }
    const katago = new KataGo(path.katago, path.config, path.model);

    let kataGoQueryMap

    const update = async (initialBoard, moves, komi) => {
        return new Promise((resolve, reject) => {
            katago.query(initialBoard, moves, komi)
                .then((response) => {
                    kataGoQueryMap = KataGoQueryMap(response);
                    queryLogWriter(kataGoQueryMap);
                    resolve(); // Resolve the promise to indicate completion
                })
                .catch((error) => {
                    console.error('Error:', error);
                    reject(error); // Reject the promise in case of an error
                });
        });
    }

    let initialBoard = board(19); // Create a 19x19 board
    let komi = 7.5;
    let moves = [['b', [3, 3]]];
    initialBoard[3][3] = 'b'

    // await update(initialBoard, moves, komi); // Wait for the update to finish
    moves.push(['w',[15,15]]);
    // await update(initialBoard, moves, komi); // Wait for the update to finish
    moves.push(['b',[3,15]]);
    // await update(initialBoard, moves, komi); // Wait for the update to finish
    moves.push(['w', [15, 3]])
    await update(initialBoard, moves, komi); // Wait for the update to finish

    katago.close()

}
main();
