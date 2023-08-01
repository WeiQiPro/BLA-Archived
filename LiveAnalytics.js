import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; 

import KataGo from './src/katago.js'
import { connectToOGS, processReviews } from './src/socket.ogs.js';
import { createBadukAnalyticsServer } from './src/server.baduk.js';

const startKataGo = (filePaths) => {
    return new KataGo(filePaths)
}

async function findEntryPoint() {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const filePath = join(moduleDir, 'entryPoint.json');

  try {
    const entryPointData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(entryPointData);
  } catch (err) {
    throw new Error(`Failed to read and parse entryPoint.json: ${err.message}`);
  }
}
  
export default async function main() {
    let games = {};
    let entryPoint;
    try {
        entryPoint = await findEntryPoint();
        console.log('Parsed entryPoint.json:', entryPoint);
        // Do something with the parsed data
      } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
    const kataGo = startKataGo(entryPoint.katago);
    const socketOGS = connectToOGS(entryPoint.url, entryPoint.params);
    const badukServer = createBadukAnalyticsServer();

    badukServer.server.on('connection', (client) => {
        console.log('A client connected. Welcome to the server.');
        badukServer.client = client

        client.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });

        client.on('links', (links) => {
            console.log(links)
            const parseData = JSON.parse(links)
            const reviews = parseData.data
            processReviews(badukServer, socketOGS, reviews, games, kataGo);
        })
    });

    process.on('SIGINT', () => {
        console.log('\nGracefully shutting down from SIGINT (Ctrl+C)');
        kataGo.close();
        socketOGS.close();
        badukServer.close();
        process.exit();
    });

}
