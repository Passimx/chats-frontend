import { Envs } from './common/config/envs/envs.ts';
const channel = new BroadcastChannel('ws-channel');

let socketId: string;
let ws: WebSocket;

function connect() {
    ws = new WebSocket(Envs.notificationsServiceUrl);

    ws.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        if (payload.event === 'get_socket_id') socketId = payload.data;
        channel.postMessage(payload);
    };

    ws.onclose = () => {
        channel.postMessage({ event: 'close_socket' });
        channel.postMessage({ event: 'error', data: '[WS2] Disconnected, reconnecting…' });
        setTimeout(connect, 3000);
    };

    ws.onerror = () => {
        ws.close();
    };
}

connect();

channel.onmessage = (ev) => {
    const event = ev.data?.event;
    switch (event) {
        case 'get_socket':
            if (socketId) channel.postMessage({ event: 'get_socket_id', data: socketId });
            break;
        case 'ping':
            channel.postMessage({ event: 'pong', data: 'iframe' });
            break;
    }
};
