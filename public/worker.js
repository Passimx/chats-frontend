let host = 'wss://api.tons-chat.ru/ws';
let socket;
let socketId;
const socketIntervalConnection = 1000;

const connect = () => {
    if (socket) return;
    socket = new WebSocket(host);
    sendMessage(5);

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.event === 'get_socket_id') socketId = data.data;
        sendMessage({ ...data, payload: data.data });
        sendMessage(6);
    });

    socket.addEventListener('close', () => {
        sendMessage(7);
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
    sendMessage(4);
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
        sendMessage(payload);
    }

    if (!socket && host) connect();
});

// // const host = 'ws://api.tons-chat.ru/ws';
// // let socket;
// // let isConnected = false;
//
// self.addEventListener('install', () => self.skipWaiting());
//
// // self.addEventListener('activate', () => {
// //     console.log('✅ Service Worker активирован');
// // });
// //
// // self.addEventListener('message', (event) => {
// //     const { event: eventType } = event.data;
// //
// //     if (eventType === 'CONNECT') {
// //         console.log('🔌 Подключение к WebSocket…');
// //         connectWebSocket();
// //     } else if (eventType === 'DISCONNECT') {
// //         socket?.close();
// //     }
// // });
// //
// // const connectWebSocket = () => {
// //     if (isConnected) return;
// //     socket = new WebSocket(host);
// //
// //     socket.onopen = () => {
// //         isConnected = true;
// //         console.log('✅ WebSocket подключен');
// //     };
// //
// //     socket.onmessage = (event) => {
// //         console.log(event);
// //         const data = JSON.parse(event.data);
// //         if (data.event === 'get_socket_id') {
// //             sendMessageAllClients('GET_SOCKET_ID', data.data);
// //         } else {
// //             sendMessageAllClients(data.event, data);
// //         }
// //     };
// //
// //     socket.onclose = () => {
// //         isConnected = false;
// //         sendMessageAllClients('CLOSE_SOCKET');
// //         setTimeout(connectWebSocket, 3000); // 🔄 Автопереподключение
// //     };
// // };
//
// // 🔹 Рассылаем сообщение всем вкладкам?
