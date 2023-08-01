import { spawn } from 'child_process';
import QueryQueue from './kataGo.queue.js';



export default class KataGo {
    constructor(filePaths) {
        this.engine = spawn(filePaths.exe, [
            'analysis',
            '-config',
            filePaths.config,
            '-model',
            filePaths.model
        ]);
        this.queueSystem = new QueryQueue()
        this.Letters = 'ABCDEFGHJKLMNOPQRST';
        this.Numbers = Array.from({ length: 19 }, (_, i) => 19 - i);
        this.querycounter = 1
        this.stderrThread = null;
        this.startErrorThread();
    }

    startErrorThread() {
        this.stderrThread = setInterval(() => {
            const data = this.engine.stderr.read();
            if (data) {
                console.log('KataGo: ', data.toString());
            }
        }, 100);
    }

    moveToString(move) {
        const [x, y] = move
        const col = this.Letters[x] || '';
        const row = this.Numbers[y] || '';
        return col + row;
    }

    async query(GameInput, maxVisits = null, maxRetries = 3) {
        const game = GameInput;
        const query = {};

        console.log(this.querycounter)
        query.id = String(this.querycounter);
        this.querycounter++

        query.moves = game.moves.list.map(([color, x, y]) => [color, this.moveToString([x, y])]);
        query.rules = 'chinese';
        query.komi = 7.5;
        query.boardXSize = 19;
        query.boardYSize = 19;
        query.includePolicy = true;
        query.kata_analysis = true;
        query.includeOwnership = true;

        if (maxVisits !== null) { query.maxVisits = maxVisits; }

        this.engine.stdin.write(JSON.stringify(query) + '\n');

        return new Promise((resolve, reject) => {
            const tryParse = (data, retries = 0) => {
                try {
                    const response = JSON.parse(data.toString());
                    response["sent"] = query.moves
                    resolve(response);
                } catch (error) {
                    if (retries < maxRetries) {
                        console.warn('query: ', game.id + game.query.amount, `Error parsing JSON. Retrying... (${retries + 1}/${maxRetries})`);
                        tryParse(data, retries + 1); // Recursive call
                    } else {
                        console.error('query: ', game.id + game.query.amount, ' Error parsing JSON. Max retries reached.');
                        reject('failed to parse'); // Reject the promise if max retries reached
                    }
                }
            };

            this.engine.stdout.once('data', (data) => {
                tryParse(data);
            });

            this.engine.once('error', (error) => {
                reject(error);
            });
        })
            .catch((error) => {
                console.error('query: ', game.id + game.query.amount, "Error occurred while querying:");
                throw error; // Re-throw the error to propagate it to the caller
            });
    };


    close() {
        this.engine.stdin.end();
        clearInterval(this.stderrThread);
        console.log('Closing KataGo Engine')
    }
}

