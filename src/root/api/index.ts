import { Envs } from '../../common/config/envs/envs.ts';

interface request {
    headers?: { [key: string]: string | null };
    body?: object;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    params?: object;
}

export type IData<T> =
    | {
          success: true;
          data: T;
      }
    | { success: false; data: string };

export async function Api<T>(url: string, { headers, body, method, params }: request = {}): Promise<IData<T>> {
    let query: string = '?';
    if (params) for (const [key, value] of Object.entries(params)) if (key && value) query += `${key}=${value}&`;

    const mainHeaders: any = {
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
        'Access-Control-Allow-METHODS': 'GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH',
    };

    if (Envs.socketId.length) mainHeaders['Websocket-key'] = Envs.socketId;

    try {
        const result = await fetch(`${Envs.chatsServiceUrl}${url}${query}`, {
            headers: {
                ...headers,
                ...mainHeaders,
            },
            body: body ? JSON.stringify(body ?? {}) : undefined,
            method,
            credentials: 'include',
        });
        // todo
        // заменить на первая фйифра 2
        if ([200, 201, 204].includes(result.status)) return (await result.json()) as IData<T>;
    } catch (e) {
        console.log(e);
    }

    return { success: false, data: 'Неизвестная ошибка при запросе.' };
}
