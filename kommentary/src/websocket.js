import io from 'socket.io-client'

const url = 'https://online-go.com';
const params = {
  transports: ['websocket'],
};
const game_id = 55647127
const review_id = 1112986
const socket = io(url, params);

socket.on('connect', () => {
  console.log('socket connected');
  socket.emit('hostinfo');
  socket.emit('net/ping',{'client':1690346734977,'drift':0,'latency':0})
  socket.emit('authenticate', {device_id: 'live_stream_commentary'})
  // socket.emit('game/connect',{'game_id':game_id,'chat':true})
  // socket.emit('review/connect',{'review_id':review_id,'chat':true})
  let last_clock_drift = 0.0;
  let last_latency = 0.0;

  if (socket.connected) {
    socket.send('net/ping', {
      client: Date.now(),
      drift: last_clock_drift,
      latency: last_latency,
    });
  }
});

socket.emit('review/connect',{'review_id':review_id,'chat':true})


socket.on('ui-pushes/subscribe', (gamedata) => {
  console.log(gamedata)
})

socket.on('game/' + game_id + '/move', (gamemove) => {
  console.log(gamemove)
})

socket.on('game/' + game_id + '/gamedata', (gamedata) => {
  // console.log(gamedata)
})

socket.on('review/' + review_id + '/move', (reviewmove) => {
  console.log(reviewmove)
})

socket.on('review/' + review_id + '/full_state', (state) => {
  console.log(state)
})

socket.on("review/" + review_id + "/r", (reviewdata) => {
  console.log(reviewdata)
})

socket.on('remote_storage/sync?,')

socket.on('net/pong', (ping) => {
  console.log(ping)
})

socket.on('hostinfo', (hostinfo) => {
  console.log('Termination server', hostinfo);
});

socket.on('authenticate', (auth) => {
  console.log(auth)
});

socket.on('disconnect', () => {
  console.log('socket disconnected');
});

socket.on('error', (error) => {
  console.error('Socket connection error:', error);
});
