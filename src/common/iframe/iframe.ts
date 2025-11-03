import { EventsFromServer } from '../../root/types/events/events-from-server.type.ts';
const channel = new BroadcastChannel('ws-channel');

let socketId: string | undefined;
let ws: WebSocket;
let handlerDisconnect: NodeJS.Timeout | undefined;
let handlerPing: NodeJS.Timeout | undefined;
let handleCloseSocket: NodeJS.Timeout | undefined;

function ping() {
    clearTimeout(handleCloseSocket);
    if (ws.readyState == 1) ws?.send(JSON.stringify({ event: 'ping', data: Date.now() }));
    handlerDisconnect = setTimeout(() => ws?.close(), 4 * 1000);
}

function connect() {
    ws = new WebSocket(import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL);

    ws.onopen = ping;

    ws.onmessage = (event: MessageEvent<string>) => {
        const payload = JSON.parse(event.data) as EventsFromServer;
        if (payload.event === 'get_socket_id') socketId = payload.data.data;
        else if (payload.event === 'pong') {
            clearTimeout(handlerPing);
            clearTimeout(handlerDisconnect);
            handlerPing = setTimeout(ping, 4 * 1000);
        }
        channel.postMessage(payload);
    };

    ws.onclose = () => {
        socketId = undefined;
        handleCloseSocket = setTimeout(() => channel.postMessage({ event: 'close_socket' }), 4 * 1000);
        clearTimeout(handlerPing);
        clearTimeout(handlerDisconnect);
        if (navigator.onLine) connect();
    };

    ws.onerror = () => {
        channel.postMessage({ event: 'error', data: '[WS2] Disconnected, reconnecting…' });
        ws.close();
    };
}

connect();

channel.onmessage = (ev) => {
    const event = ev.data?.event;
    switch (event) {
        case 'create_tab':
            if (socketId) channel.postMessage({ event: 'get_socket_id', data: { success: true, data: socketId } });
            break;
    }
};

self.addEventListener('online', () => {
    if (socketId) ws?.close();
    else connect();
});
