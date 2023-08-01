
export default function connectBadukServer() {
    const badukServer = io('http://localhost:2468')

    badukServer.on('connect', () => {
        alert('Socket connected')
    });

    badukServer.on('message', (data) => {
        console.log('Received message from the server:', data);
    });

    return badukServer
}