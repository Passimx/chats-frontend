import { ChangeEvent, useCallback, useContext } from 'react';
import { ContextMedia } from '../../preview-media-context';
import { getFilesWithMetadata } from '../../../common/hooks/get-files-with-metadata.ts';

export const useOpenMedia = (setIsVisible: (value: boolean) => void) => {
    const { setFiles } = useContext(ContextMedia)!;

    const getFiles = (accept?: string) => {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.value = '';
            input.type = 'file';
            input.multiple = true;
            if (accept) input.accept = accept;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            input.onchange = async (e: ChangeEvent<HTMLInputElement>) => {
                const payload = e.target.files;
                if (!payload?.length) return resolve(false);

                const files = await getFilesWithMetadata(Array.from(payload));
                setFiles(files);
                resolve(true);
            };
            input.click();
            setIsVisible(false);
        });
    };

    const openMedia = useCallback(() => getFiles('image/*,video/*'), []);
    const openFiles = useCallback(() => getFiles(), []);

    return [openMedia, openFiles];
};
