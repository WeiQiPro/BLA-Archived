export const createGame = (state, id, index, games) => {
    const letters = 'abcdefghijklmnopqrstuvwxyz'
    if (!games[id]) {
        const firstElement = state.shift();
        const reviewString = state.pop();

        games[id] = {
            id: letters[index],
            name: firstElement.gamedata.game_name,
            players: firstElement.gamedata.players,
            moves: {
                list: (typeof reviewString !== 'undefined' && typeof reviewString.m !== 'undefined') ? handleMoves(reviewString.m) : [],
                string: (typeof reviewString !== 'undefined' && typeof reviewString.m !== 'undefined') ? reviewString.m : ''
            },
            query: {
                id: id,
                amount: 0
            }
        };

    };


}

export const handleMoves = (moveString) => {
    if (!moveString) {
        return [];
    }

    const coordinates = 'abcdefghijklmnopqrs';
    const pairs = moveString.match(/.{1,2}/g); // split into pairs

    if (!pairs) {
        return [];
    }

    const moves = pairs.map((pair, i) => {
        const x = coordinates.indexOf(pair[0]);
        const y = coordinates.indexOf(pair[1]); // subtract from 19 for correct row
        const player = i % 2 === 0 ? 'b' : 'w'; // assume 'b' goes first
        return [player, x, y];
    });

    return moves;
};

export const handleKataGoEvaluation = (game, evaluation) => {
    const percentage = evaluation.root.winrate
    const scorelead = evaluation.root.scoreLead
    const ownerShipMap = evaluation.ownerShipMap
    const suggestedMoves = evaluation.moves
    const currentPlayer = evaluation.currentPlayer
    const territroy = getTerritoryFromOwnership(game, ownerShipMap)

    game.evaluation = {
        query: {
            moves: suggestedMoves
        },
        percentage:  currentPlayer + ': ' + percentage.toFixed(2),
        score: currentPlayer + ' + ' + scorelead.toFixed(2),
        territroy: {
            help: 'these are just estimates',
            black: territroy.black,
            white: territroy.white
        }
    }

    console.log(`Query: ${game.id}${game.query.amount} : \n black: ${game.players.black.name} \n white: ${game.players.white.name} \n score: ${game.evaluation.score} \n winrate: ${game.evaluation.percentage}`)
}

export const getTerritoryFromOwnership = (game, ownerShipMap) => {
    const threshold = 0.4;
    let black_points = 0;
    let white_points = 0;

    ownerShipMap.forEach((row, y) => {
        row.forEach((value, x) => {
            // Check the ownership value against the threshold
            if (Math.abs(value) > threshold) {
                if (value > 0) {
                    white_points += Math.abs(value); // Adding the absolute value for white
                } else {
                    black_points += Math.abs(value); // Adding the value for black
                }
            }
        });
    });

    // Deducting points based on total moves
    const totalMoves = game.moves.list.length;
    black_points -= totalMoves / 2;
    white_points -= totalMoves / 2;
    white_points += 7.5

    return { black: black_points, white: white_points };
};
