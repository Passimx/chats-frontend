import { DataType } from '../../types/events/event-data.type.ts';
import { EventsEnum } from '../../types/events/events.enum.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { EventsFromServer } from '../../types/events/events-from-server.type.ts';

let socketId: string | undefined;
let token: string | undefined;
let ws: WebSocket;
let handlerPing: NodeJS.Timeout | undefined;
let handleCloseSocket: NodeJS.Timeout | undefined;
let handlerDisconnect: NodeJS.Timeout | undefined;

const channel = new BroadcastChannel('ws-channel');

function ping() {
    clearTimeout(handleCloseSocket);
    if (ws.readyState == 1) ws?.send(JSON.stringify({ event: 'ping', data: Date.now() }));
    handlerDisconnect = setTimeout(() => ws?.close(), Envs.waitPong);
}

async function connect() {
    if (!token?.length || socketId) return;
    if (!navigator.onLine) return;
    ws = new WebSocket(`${Envs.notificationsServiceUrl}?token=${token}`);
    ws.onopen = ping;
    ws.onmessage = (event: MessageEvent<string>) => {
        const payload = JSON.parse(event.data) as EventsFromServer;
        if (payload.event === EventsEnum.GET_SOCKET_ID) socketId = payload.data.data;
        switch (payload.event) {
            case EventsEnum.PONG:
                clearTimeout(handlerPing);
                clearTimeout(handlerDisconnect);
                handlerPing = setTimeout(ping, Envs.intervalPing);
                break;
            default:
                channel.postMessage(payload);
        }
    };

    ws.onclose = () => {
        socketId = undefined;
        channel.postMessage({ event: EventsEnum.CLOSE_SOCKET });
        clearTimeout(handlerPing);
        clearTimeout(handlerDisconnect);
        setTimeout(connect, 2000);
    };

    ws.onerror = () => {
        channel.postMessage({ event: EventsEnum.ERROR, data: '[WS2] Disconnected, reconnecting…' });
        ws.close();
    };
}

self.onmessage = async (dataEvent: MessageEvent<DataType>) => {
    const event = dataEvent.data?.event;
    switch (event) {
        case EventsEnum.CONNECT_NOTIFICATIONS:
            token = dataEvent.data.data.token;
            await connect();
            break;
    }
};

self.addEventListener('online', () => {
    if (socketId) ws?.close();
    else connect();
});
