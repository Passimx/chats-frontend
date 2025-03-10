let host;
let socket;
let socketId;
let isConnected = false;
const socketIntervalConnection = 1000;

const connect = () => {
    if (socket) socket?.close();
    socket = new WebSocket(host);
    socket.addEventListener('open', () => (isConnected = true));
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.event === 'get_socket_id') socketId = data.data;
        sendMessage({ ...data, payload: data.data });
    });
    socket.addEventListener('close', () => {
        socketId = undefined;
        isConnected = false;
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

    if (eventType === 'CONNECT') {
        if (!host && payload) host = payload;
        if (socketId)
            event.source?.postMessage({
                event: 'get_socket_id',
                data: socketId,
            });
    }

    if (eventType === 'SEND_MESSAGE') {
        // console.log(event);
        sendMessage(payload);
    }

    if (!isConnected && host) connect();
});

// const host = 'ws://api.tons-chat.ru/ws';
// let socket;
// let isConnected = false;

self.addEventListener('install', () => self.skipWaiting());

// self.addEventListener('activate', () => {
//     console.log('✅ Service Worker активирован');
// });
//
// self.addEventListener('message', (event) => {
//     const { event: eventType } = event.data;
//
//     if (eventType === 'CONNECT') {
//         console.log('🔌 Подключение к WebSocket…');
//         connectWebSocket();
//     } else if (eventType === 'DISCONNECT') {
//         socket?.close();
//     }
// });
//
// const connectWebSocket = () => {
//     if (isConnected) return;
//     socket = new WebSocket(host);
//
//     socket.onopen = () => {
//         isConnected = true;
//         console.log('✅ WebSocket подключен');
//     };
//
//     socket.onmessage = (event) => {
//         console.log(event);
//         alert(32);
//         const data = JSON.parse(event.data);
//         if (data.event === 'get_socket_id') {
//             sendMessageAllClients('GET_SOCKET_ID', data.data);
//         } else {
//             sendMessageAllClients(data.event, data);
//         }
//     };
//
//     socket.onclose = () => {
//         isConnected = false;
//         sendMessageAllClients('CLOSE_SOCKET');
//         setTimeout(connectWebSocket, 3000); // 🔄 Автопереподключение
//     };
// };

// // 🔹 Рассылаем сообщение всем вкладкам
