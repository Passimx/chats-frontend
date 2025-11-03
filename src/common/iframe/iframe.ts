import { Envs } from '../config/envs/envs.ts';
import { EventsFromServer } from '../../root/types/events/events-from-server.type.ts';
import { EventsEnum } from '../../root/types/events/events.enum.ts';
const channel = new BroadcastChannel('ws-channel');

let socketId: string | undefined;
let ws: WebSocket;
let handlerDisconnect: NodeJS.Timeout | undefined;
let handlerPing: NodeJS.Timeout | undefined;
let handleCloseSocket: NodeJS.Timeout | undefined;

function ping() {
    clearTimeout(handleCloseSocket);
    if (ws.readyState == 1) ws?.send(JSON.stringify({ event: 'ping', data: Date.now() }));
    handlerDisconnect = setTimeout(() => ws?.close(), Envs.waitPong);
}

function connect() {
    ws = new WebSocket(Envs.notificationsServiceUrl);

    ws.onopen = ping;

    ws.onmessage = (event: MessageEvent<string>) => {
        const payload = JSON.parse(event.data) as EventsFromServer;
        if (payload.event === EventsEnum.GET_SOCKET_ID) socketId = payload.data.data;
        else if (payload.event === EventsEnum.PONG) {
            clearTimeout(handlerPing);
            clearTimeout(handlerDisconnect);
            handlerPing = setTimeout(ping, Envs.intervalPing);
        }
        channel.postMessage(payload);
    };

    ws.onclose = () => {
        socketId = undefined;
        handleCloseSocket = setTimeout(() => channel.postMessage({ event: EventsEnum.CLOSE_SOCKET }), Envs.waitPong);
        clearTimeout(handlerPing);
        clearTimeout(handlerDisconnect);
        if (navigator.onLine) connect();
    };

    ws.onerror = () => {
        channel.postMessage({ event: EventsEnum.ERROR, data: '[WS2] Disconnected, reconnecting…' });
        ws.close();
    };
}

connect();

channel.onmessage = (ev) => {
    const event = ev.data?.event;
    switch (event) {
        case 'create_tab':
            if (socketId)
                channel.postMessage({ event: EventsEnum.GET_SOCKET_ID, data: { success: true, data: socketId } });
            break;
    }
};

self.addEventListener('online', () => {
    if (socketId) ws?.close();
    else connect();
});
