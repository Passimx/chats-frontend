import { Envs } from '../../../common/config/envs/envs.ts';
import { store } from '../../store';
import { IData } from '../index';

// Типы из mediasoup-client
type RtpCapabilities = any;
type RtpParameters = any;
type DtlsParameters = any;
type IceCandidate = any;
type IceParameters = any;

interface RequestOptions {
    headers?: { [key: string]: string | null };
    body?: object;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    params?: object;
}

// Универсальный вызов Media API. Бэкенд возвращает формат { success, data }
async function MediaApi<T>(url: string, { headers, body, method, params }: RequestOptions = {}): Promise<IData<T>> {
    let query: string = '?';
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (Array.isArray(value) && !value.length) continue;
            if (value) query += `${key}=${value}&`;
        }
    }

    if (query[query.length - 1] === '&') query = query.slice(0, -1);
    if (query === '?') query = '';

    const mainHeaders: any = {
        'Content-Type': 'application/json',
    };

    const userId = store.getState().user.id;
    if (userId) {
        mainHeaders['x-socket-id'] = userId;
    }

    try {
        const result = await fetch(`${Envs.mediaCallsServiceUrl}${url}${query}`, {
            headers: {
                ...headers,
                ...mainHeaders,
            },
            body: body ? JSON.stringify(body ?? {}) : undefined,
            method: method || 'GET',
            credentials: 'include',
        });

        if (result.status.toString()[0] === '2') {
            const response = await result.json();
            // Бэкенд возвращает { success, data }
            return response as IData<T>;
        }

        return { success: false, data: `HTTP error: ${result.status} ${result.statusText}` };
    } catch (error) {
        console.error('Media API error:', error);
        return { success: false, data: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Types
export interface RoomResponse {
    roomId: string;
    routerRtpCapabilities: RtpCapabilities;
}

export interface TransportResponse {
    id: string;
    iceParameters: IceParameters;
    iceCandidates: IceCandidate[];
    dtlsParameters: DtlsParameters;
}

export interface ProducerResponse {
    producerId: string;
}

export interface ConsumerResponse {
    id: string;
    producerId: string;
    kind: string;
    rtpParameters: RtpParameters;
}

export interface ProducerInfo {
    peerId: string;
    producerId: string;
    kind: string;
}

export interface ProducersListResponse {
    producers: ProducerInfo[];
}

export interface LeaveRoomResponse {
    success: boolean;
    message: string;
}

export const createRoom = async (roomId: string, initiatorId?: string): Promise<IData<RoomResponse>> => {
    return MediaApi<RoomResponse>('/room', {
        method: 'POST',
        body: { roomId, initiatorId },
    });
};

export const createTransport = async (
    roomId: string,
    peerId: string,
    direction: 'send' | 'recv',
): Promise<IData<TransportResponse>> => {
    return MediaApi<TransportResponse>(`/transport/${roomId}`, {
        method: 'POST',
        body: { peerId, direction },
    });
};

export const connectTransport = async (
    transportId: string,
    dtlsParameters: DtlsParameters,
): Promise<IData<{ success: boolean }>> => {
    return MediaApi<{ success: boolean }>(`/transport/${transportId}/connect`, {
        method: 'POST',
        body: { dtlsParameters },
    });
};

export const createProducer = async (
    roomId: string,
    peerId: string,
    transportId: string,
    kind: 'audio' | 'video',
    rtpParameters: RtpParameters,
): Promise<IData<ProducerResponse>> => {
    return MediaApi<ProducerResponse>('/producer', {
        method: 'POST',
        body: { roomId, peerId, transportId, kind, rtpParameters },
    });
};

export const createConsumer = async (
    roomId: string,
    peerId: string,
    transportId: string,
    producerId: string,
    rtpCapabilities: RtpCapabilities,
): Promise<IData<ConsumerResponse>> => {
    return MediaApi<ConsumerResponse>('/consumer', {
        method: 'POST',
        body: { roomId, peerId, transportId, producerId, rtpCapabilities },
    });
};

export const getRoomProducers = async (
    roomId: string,
    excludePeerId?: string,
): Promise<IData<ProducersListResponse>> => {
    return MediaApi<ProducersListResponse>(`/room/${roomId}/producers`, {
        method: 'GET',
        params: excludePeerId ? { excludePeerId } : undefined,
    });
};

export const leaveRoom = async (roomId: string, peerId: string): Promise<IData<LeaveRoomResponse>> => {
    return MediaApi<LeaveRoomResponse>(`/room/${roomId}/leave`, {
        method: 'POST',
        body: { peerId },
    });
};
