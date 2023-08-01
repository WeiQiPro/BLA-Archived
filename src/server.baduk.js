import { Server } from 'socket.io';
import http from 'http';

export const createBadukAnalyticsServer = () => {
  const nodeServer = http.createServer();
  const badukAnalytics = {
    http: nodeServer,
    client: {},
    server: new Server(nodeServer),
    port: 2468,
  };

  nodeServer.listen(2468, () => {
    console.log('Node server is running on http://localhost:2468');
  });

  console.log('Server is running on ws://localhost:2468'); // Updated port
  return badukAnalytics;
};
