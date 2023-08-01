import connectBadukServer from './socket.baduk.js'
import Goban from './goban/goban.js';
let analyzedGames = {}

let badukServer = connectBadukServer()

badukServer.on('game', (data) => {
    const parsedData = JSON.parse(data); // Parsing the JSON string
    const game = parsedData.data; // Accessing the data property
    updateGames(game);
    updateDoms(analyzedGames)
});

const updateGames = (updateData) => {
    const id = updateData.query.id;
    const existingMoves = analyzedGames[id]?.moves?.list || [];
    const newMoves = updateData.moves.list;
    const movesToAdd = newMoves.filter((move) => !existingMoves.some((existingMove) => JSON.stringify(existingMove) === JSON.stringify(move)));
    // Storing the movesToAdd in the updateData
    updateData.movesToAdd = movesToAdd;
  
    analyzedGames[id] = { ...analyzedGames[id], ...updateData };
  };
  

const createTextDiv = (text) => {
    const div = document.createElement('div');
    const textNode = document.createTextNode(text);
    div.appendChild(textNode);
    div.style.marginTop = '5px'; // Adding the top margin
    return div;
};

const createWinRateBar = (className, winRateText = '') => {
    const div = document.createElement('div');
    div.className = className;
    div.style.height = '100%';
    if (winRateText) {
        const winRateTextNode = document.createTextNode(winRateText);
        const winRateTextDiv = document.createElement('span');
        winRateTextDiv.appendChild(winRateTextNode);
        winRateTextDiv.style.position = 'absolute';
        winRateTextDiv.style.left = '5px'; // Position 5 pixels from the left
        winRateTextDiv.style.color = 'black'; // Change the text color if necessary
        div.appendChild(winRateTextDiv);
    } else {
        // Creating an empty span for blackWinRate
        const emptySpan = document.createElement('span');
        div.appendChild(emptySpan);
    }
    return div;
};

const createEvaluationContainer = (evaluation) => {
    const container = document.createElement('div');
    container.className = 'evaluationContainer';

    let whiteRate = 0;
    let blackRate = 0;
    if (evaluation.startsWith('W:')) {
        whiteRate = parseFloat(evaluation.split(' ')[1]) * 100;
        blackRate = 100 - whiteRate;
    } else if (evaluation.startsWith('B:')) {
        blackRate = parseFloat(evaluation.split(' ')[1]) * 100;
        whiteRate = 100 - blackRate;
    }

    container.appendChild(createWinRateBar('winRateBar whiteWinRate', `W: ${whiteRate}%`)); // Here it is
    container.appendChild(createWinRateBar('winRateBar blackWinRate'));

    container.querySelector('.whiteWinRate').style.width = `${whiteRate}%`;
    container.querySelector('.blackWinRate').style.width = `${blackRate}%`;

    return container;
};

const createGameDiv = (game) => {
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';

    const gameInfo = `${game.players.white.name} vs ${game.players.black.name}`;
    const gameScore = `Score: ${game.evaluation.score.replace('+', ':')}`;

    
    // Create Goban instance and attach to the game object
    const goban = new Goban(game);
    game.goban = goban;
    game.goban.moves = game.moves.list
    game.goban.update(game.moves.list)
    
    // Append goban element to gameDiv
    gameDiv.appendChild(createTextDiv(gameInfo));
    gameDiv.appendChild(goban.element);
    gameDiv.appendChild(createEvaluationContainer(game.evaluation.percentage));
    gameDiv.appendChild(createTextDiv(gameScore));
    return gameDiv;
};

const updateDoms = (games) => {
    const gamesDiv = document.getElementById("GamesList");

    for (const gameId in games) {
        const game = games[gameId];
        let gameDiv = gamesDiv.querySelector(`.game[data-game-id="${gameId}"]`);

        if (!gameDiv) {
            gameDiv = createGameDiv(game);
            // Add a data attribute to identify the gameDiv, assuming game.id is correct
            gameDiv.dataset.gameId = game.query.id; 
            gamesDiv.appendChild(gameDiv);
        } else {
            updateGameDiv(gameDiv, game);
        }
    }
};


const updateGameDiv = (gameDiv, game) => {
    // Update game info
    const gameInfo = `${game.players.white.name} vs ${game.players.black.name}`;
    const gameScore = `Score: ${game.evaluation.score.replace('+', ':')}`;

    gameDiv.querySelector(':nth-child(1)').textContent = gameInfo;
    gameDiv.querySelector(':nth-child(4)').textContent = gameScore;

    // Update evaluation container
    updateEvaluationContainer(gameDiv.querySelector('.evaluationContainer'), game.evaluation.percentage);
    const goban = gameDiv.querySelector(`#goban-${game.query.id}`);
    // Update Goban Board using game.goban
    if (goban) {
        game.goban.moves = game.moves.list
        game.goban.update(game.moves.list)
        // Assuming the update method takes the new board state
    } else {
        console.error(`No goban found for game with id: ${game.query.id}`);
    }
};


const updateEvaluationContainer = (evaluationContainer, newEvaluation) => {
    const previousWhiteRate = parseFloat(evaluationContainer.dataset.whiteRate || 0);
    const previousBlackRate = parseFloat(evaluationContainer.dataset.blackRate || 0);

    let whiteRateChange = 0;
    let blackRateChange = 0;

    if (newEvaluation.startsWith('W:')) {
        whiteRateChange = parseFloat(newEvaluation.split(' ')[1]) * 100 - previousWhiteRate;
    } else if (newEvaluation.startsWith('B:')) {
        blackRateChange = parseFloat(newEvaluation.split(' ')[1]) * 100 - previousBlackRate;
    }

    let whiteRate = previousWhiteRate + whiteRateChange;
    let blackRate = previousBlackRate + blackRateChange;

    whiteRate = Math.min(Math.max(whiteRate, 0), 100);
    blackRate = Math.min(Math.max(blackRate, 0), 100);

    // Storing the updated rates
    evaluationContainer.dataset.whiteRate = whiteRate;
    evaluationContainer.dataset.blackRate = blackRate;

    evaluationContainer.querySelector('.whiteWinRate').style.width = `${whiteRate}%`;
    evaluationContainer.querySelector('.blackWinRate').style.width = `${blackRate}%`;

    // Update the text content of the win rate as well
    evaluationContainer.querySelector('.whiteWinRate span').textContent = `W: ${whiteRate.toFixed(2)}%`;
    evaluationContainer.querySelector('.blackWinRate span').textContent = `B: ${blackRate.toFixed(2)}%`;
};




let links = [];

const addLinkToList = (url) => {
    links.push(url);
    updateLinkList();
};

const removeLinkFromList = (index) => {
    links.splice(index, 1);
    updateLinkList();
};

const updateLinkList = () => {
    const linkListElement = document.getElementById('linkList');
    linkListElement.innerHTML = ""; // Clear existing links
    links.forEach((link, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = link;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "-";
        deleteButton.className = "deleteLink"; // Add this line to apply the class
        deleteButton.addEventListener('click', () => removeLinkFromList(index));

        listItem.appendChild(deleteButton);
        linkListElement.appendChild(listItem);
    });
};

const sendLinksToKataGo = () => {
    const payload = {
        type: 'links',
        data: links
    }
    badukServer.emit('links', JSON.stringify(payload));
    links = []; // Clear the links
    addLinkToList(links);
};

document.getElementById('addButton').addEventListener('click', () => {
    const urlInput = document.getElementById('urlInput');
    const inputUrls = urlInput.value.split(','); // Split input by commas

    inputUrls.forEach((url) => {
        const trimmedUrl = url.trim(); // Remove leading and trailing spaces
        if (trimmedUrl !== "") {
            addLinkToList(trimmedUrl);
        }
    });

    urlInput.value = ""; // Clear the input field
});


document.getElementById('sendButton').addEventListener('click', sendLinksToKataGo);
