import { RsaKeysStringType } from '../../types/keys/create-rsa-keys.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { CryptoService } from '../../../common/services/crypto.service.ts';
import { EventsFromServer } from '../../types/events/events-from-server.type.ts';
import { EventsEnum } from '../../types/events/events.enum.ts';
import { TabsEnum } from '../../types/events/tabs.enum.ts';

const channel = new BroadcastChannel('ws-channel');

let socketId: string | undefined;
let ws: WebSocket;
let handlerDisconnect: NodeJS.Timeout | undefined;
let handlerPing: NodeJS.Timeout | undefined;
let handleCloseSocket: NodeJS.Timeout | undefined;
let RASKeysString: RsaKeysStringType;
let RASKeys: CryptoKeyPair;

function ping() {
    clearTimeout(handleCloseSocket);
    if (ws.readyState == 1) ws?.send(JSON.stringify({ event: 'ping', data: Date.now() }));
    handlerDisconnect = setTimeout(() => ws?.close(), Envs.waitPong);
}

async function connect() {
    if (!RASKeysString) {
        const payloadKeys = localStorage.getItem('keys');
        if (!payloadKeys) return;
        RASKeysString = JSON.parse(payloadKeys) as RsaKeysStringType;
        const keys = await CryptoService.importRSAKeys(RASKeysString);
        if (keys) RASKeys = keys;
    }

    if (socketId) return;
    ws = new WebSocket(`${Envs.notificationsServiceUrl}?publicKey=${RASKeysString.publicKey}`);
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
            case EventsEnum.VERIFY:
                CryptoService.decryptByRSAKey(RASKeys.privateKey, payload.data).then((result) =>
                    ws.send(JSON.stringify({ event: EventsEnum.VERIFY, data: result })),
                );
                break;
            default:
                channel.postMessage(payload);
        }
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

channel.onmessage = (ev) => {
    const event = ev.data?.event;
    switch (event) {
        case TabsEnum.CREATE_TAB:
            if (socketId)
                channel.postMessage({ event: EventsEnum.GET_SOCKET_ID, data: { success: true, data: socketId } });
            break;
    }
};

self.addEventListener('online', () => {
    if (socketId) ws?.close();
    else connect();
});

connect();
document.addEventListener('pageshow', () => {
    console.log('Страница снова стала видимой!');

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        connect();
    }
});
