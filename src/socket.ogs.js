import io from 'socket.io-client';
import { createGame } from './games.util.js';


export const connectToOGS = (url, params) => {
    const socketOGS = io(url, params);

    socketOGS.on('connect', () => {
        console.log('socket connected');
        socketOGS.emit('hostinfo');
        socketOGS.emit('authenticate', { device_id: 'live_stream_commentary' })
    });

    socketOGS.on('hostinfo', (hostinfo) => {
        console.log('Termination server', hostinfo);
    });

    socketOGS.on('authenticate', (auth) => {
        console.log(auth)
    });

    socketOGS.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    socketOGS.on('error', (error) => {
        console.error('Socket connection error:', error);
    });

    return socketOGS
}

export const processReviews = (badukServer, socketOGS, reviews, games, kataGo) => {
    const links = reviews
    links.forEach((review, index) => {
        const parts = review.split("/");
        const id = parts[parts.length - 1];

        socketOGS.emit('review/connect', {
            'review_id': id,
            'chat': false
        })

        socketOGS.on('review/' + id + '/full_state', state => {
            console.log(`connected to game: ${id}`)
            createGame(state, id, index, games);
            kataGo.queueSystem.process(badukServer, games[id], games[id].moves.list[-1], kataGo)
        })

        socketOGS.on("review/" + id + "/r", (move) => {
            if (move.m) {
              const data = move.m;
              games[id].query.amount += 1;
              kataGo.queueSystem.process(badukServer, games[id], data, kataGo); // Use the queue
            }
          });
    });
}

