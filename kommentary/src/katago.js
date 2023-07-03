import { spawn } from 'child_process';

export default class KataGo {
  constructor(katagoPath, configPath, modelPath) {
    this.queryCounter = 0;
    this.katago = spawn(katagoPath, [
      'analysis',
      '-config',
      configPath,
      '-model',
      modelPath
    ]);
    this.stderrThread = null;
    this.startErrorThread();
  }

  moveToString(move) {
    const [x, y] = move;
    const col = String.fromCharCode(97 + x); // Convert 0-based column index to letter ('a' to 's')
    const row = y + 1; // Add 1 to row index to convert to number
    return col + row;
  }  

  startErrorThread() {
    this.stderrThread = setInterval(() => {
      const data = this.katago.stderr.read();
      if (data) {
        console.log('KataGo: ', data.toString());
      }
    }, 100);
  }

  close() {
    this.katago.stdin.end();
    clearInterval(this.stderrThread);
    console.log('Closing KataGo Engine')
  }

  query(initialBoard, moves, komi, maxVisits = null) {
    const query = {};
  
    query.id = String(this.queryCounter);
    this.queryCounter += 1;
  
    query.moves = moves.map(([color, move]) => [color, this.moveToString(move)]);
    query.rules = 'Chinese';
    query.komi = komi;
    query.boardXSize = initialBoard.size;
    query.boardYSize = initialBoard.size;
    query.includePolicy = true;
    // query.kata_analysis = true;
    query.includeOwnership = true;
    query.includeOwnershipStdev = true;
    if (maxVisits !== null) {
      query.maxVisits = maxVisits;
    }
    console.log(JSON.stringify(query))
    this.katago.stdin.write(JSON.stringify(query) + '\n');

    return new Promise((resolve, reject) => {
      this.katago.stdout.once('data', (data) => {
        const response = JSON.parse(data.toString().trim());
        resolve(response);
      });

      this.katago.once('error', (error) => {
        reject(error);
      });
    });
  }
}
