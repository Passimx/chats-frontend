interface request {
    headers?: { [key: string]: string | null };
    body?: object;
    method?: string;
    params?: object;
}

export type IData<T> = {
    success: boolean;
    data?: T;
};

export const Envs = {
    chatsServiceUrl: 'http://localhost:7020/api',
    salt: 'SalT_For_ChAt',
};

export async function Api<T>(url: string, { headers, body, method, params }: request = {}): Promise<IData<T>> {
    const badResponse: IData<T> = { success: false, data: undefined };

    let query: string = '?';
    if (params) for (const [key, value] of Object.entries(params)) if (key && value) query += `${key}=${value}`;

    const mainHeaders = {
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
        'Access-Control-Allow-METHODS': 'GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH',
    };

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
        if ([200, 201, 204].includes(result.status)) return (await result.json()) as IData<T>;
        return badResponse;
    } catch (e) {
        console.log(e);
        return badResponse;
    }
}
