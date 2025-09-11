import { IData } from '../index.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { Types } from '../../types/files/types.ts';

export const uploadFile = async (body: FormData): Promise<IData<string[]>> => {
    const response = await fetch(`${Envs.chatsServiceUrl}/files/upload`, { method: 'POST', body }).then((response) =>
        response.json(),
    );

    return response as IData<string[]>;
};

export const DownloadFile = async (file: Types): Promise<void> => {
    const response = await fetch(`${Envs.chatsServiceUrl}/files/${file.id}`);

    if (!response.ok) {
        throw new Error(`Ошибка загрузки файла: ${response.statusText}`);
    }

    const blob = await response.blob();
    const filename = file.originalName;
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
};
