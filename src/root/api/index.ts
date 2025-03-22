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
    if (params)
        for (const [key, value] of Object.entries(params)) {
            if (Array.isArray(value) && !value.length) continue;
            if (value) query += `${key}=${value}&`;
        }

    if (query[query.length - 1] === '&') query = query.slice(0, -1);

    const mainHeaders: any = {
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
        'Access-Control-Allow-METHODS': 'GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH',
    };

    if (Envs.socketId?.length) mainHeaders['x-socket-id'] = Envs.socketId;

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
        if (result.status.toString()[0] === '2') return (await result.json()) as IData<T>;
    } catch (e) {
        console.log(e);
    }

    return { success: false, data: 'Неизвестная ошибка при запросе.' };
}
