import { IData } from '../index.ts';
import { Envs } from '../../../common/config/envs/envs.ts';

export const uploadFile = async (body: FormData): Promise<IData<string[]>> => {
    const response = await fetch(`${Envs.chatsServiceUrl}/files/upload`, { method: 'POST', body }).then((response) =>
        response.json(),
    );

    return response as IData<string[]>;
};
