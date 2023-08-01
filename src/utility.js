import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const writeGamesToFile = async (game) => {
    try {
        const date = formateDate(new Date())
        const fileName = `${date} ${game.players.black.name} vs ${game.players.white.name}.json`;
        const filePath = path.join(__dirname, '../games', fileName);

        try {
            await fs.access(path.join(__dirname, '../games'));
        } catch (error) {
            await fs.mkdir(path.join(__dirname, '../games'));
        }

        // Write the game object to the JSON file
        await fs.writeFile(filePath, JSON.stringify(game));
    } catch (error) {
        console.error(`Failed to write to file: ${filePath}`, error);
    }
};

const formateDate = (date) => {
    const yyyy = date.getFullYear();
    // JavaScript months are 0-based, so add 1
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return yyyy + mm + dd;
  }