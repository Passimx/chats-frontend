const ports = [];
const sendMessage = (e) => ports.forEach((client) => client.postMessage(e));
self.addEventListener('connect', async (event) => {
    const port = event.ports[0];
    port.start();
    ports.push(port);
    port.onmessage = ({ data }) => sendMessage(data);

    if (ports.length > 1) return;

    const socket = new WebSocket('ws://localhost:7022');

    socket.addEventListener('message', (event) => sendMessage(JSON.parse(event.data)));
});
