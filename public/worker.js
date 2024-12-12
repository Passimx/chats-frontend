'use strict';
const host = 'ws://localhost:7022';
const ports = [];
let socketId;

let socket;
let isConnected = false;
const socketIntervalConnection = 1000;

const connect = () => {
    if (isConnected) return;
    socket?.close();
    socket = new WebSocket(host);
    socket.addEventListener('open', () => (isConnected = true));
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.event === 'get_socket_id') socketId = data.data;
        sendMessage(data);
    });
    socket.addEventListener('close', () => {
        socketId = undefined;
        isConnected = false;
        sendMessage({ event: 'close_socket' });
        sendMessage({ event: 'error', data: 'Cannot connect to notifications service.' });
        setTimeout(connect, socketIntervalConnection);
    });
};

const sendMessage = (e) => ports.forEach((client) => client.postMessage(e));
self.addEventListener('connect', async (event) => {
    const port = event.ports[0];
    port.start();
    ports.push(port);
    port.onmessage = ({ data }) => sendMessage(data);

    if (socketId) port.postMessage({ event: 'get_socket_id', data: socketId });
    if (ports.length > 1) return;

    connect();
});
