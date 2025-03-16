const socketIntervalConnection = 1000;
let host;
let socket;
let socketId;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// const sendPing = () => {
//     // ping web socket
//     if (!socket || socket.readyState !== WebSocket.OPEN) return;
//     socket.send(JSON.stringify({ event: 'ping' }));
// };

const connect = () => {
    if (socket) return;
    socket = new WebSocket(host);

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.event === 'get_socket_id') socketId = data.data;
        sendMessage({ ...data, payload: data.data });
    });

    socket.addEventListener('close', () => {
        socket?.close();
        socketId = undefined;
        socket = null;
        sendMessage({ event: 'close_socket' });
        sendMessage({ event: 'error', data: 'Cannot connect to notifications service.' });
        setTimeout(connect, socketIntervalConnection);
    });
};

const sendMessage = (payload) => {
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage(payload));
    });
};

self.addEventListener('message', (event) => {
    const { event: eventType, payload } = event.data;

    if (eventType === 'RE_CONNECT') {
        if (socket?.readyState === WebSocket.OPEN) return;
        socket?.close();
        socket = null;
        socketId = undefined;
        connect();
    }

    if (eventType === 'CONNECT') {
        if (!host && payload) host = payload;
        if (socketId)
            event.source?.postMessage({
                event: 'get_socket_id',
                data: socketId,
            });
    }

    if (eventType === 'SEND_MESSAGE') {
        sendMessage(payload);
    }

    if (!socket && host) connect();
});
