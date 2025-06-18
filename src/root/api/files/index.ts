import { FileType } from '../../types/files/file.type.ts';
import { IData } from '../index.ts';
import { Envs } from '../../../common/config/envs/envs.ts';

export const uploadFile = async (body: FormData): Promise<IData<FileType>> => {
    const response = await fetch(`${Envs.chatsServiceUrl}/files/upload`, { method: 'POST', body }).then((f) =>
        f.json(),
    );

    return response as IData<FileType>;
};
