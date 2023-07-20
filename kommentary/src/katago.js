import { spawn } from 'child_process';

export default class KataGo {
  constructor(katagoPath, configPath, modelPath) {
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
}
