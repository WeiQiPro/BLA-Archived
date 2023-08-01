import { queryHandler } from "./katago.util.js";

export default class QueryQueue {
    constructor() {
      this.queue = [];
      this.processing = false;
    }
  
    async process(badukServer, game, move, kataGo) {
      this.queue.push({ badukServer, game, move, kataGo });
      if (!this.processing) this.processNext();
    }
  
    async processNext() {
      if (this.queue.length === 0) {
        this.processing = false;
        return;
      }
  
      this.processing = true;
      const { badukServer, game, move, kataGo } = this.queue.shift();
      try {
        await queryHandler(badukServer, game, move, kataGo);
      } catch (error) {
        console.error('Error processing query:', error);
      }
      this.processNext();
    }
  }
  