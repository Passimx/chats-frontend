import { useCallback, useContext } from 'react';
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

            document.body.appendChild(input);

            input.onchange = async (e: Event) => {
                const target = e.target as HTMLInputElement;
                const payload = target.files;
                if (!payload?.length) {
                    document.body.removeChild(input);
                    return resolve(false);
                }

                const files = await getFilesWithMetadata(Array.from(payload));
                setFiles(files);
                document.body.removeChild(input);
                resolve(true);
            };

            setTimeout(() => {
                input.click();
                setIsVisible(false);
            }, 0);
        });
    };

    const openMedia = useCallback(() => getFiles('image/*,video/*'), []);
    const openFiles = useCallback(() => getFiles(), []);

    return { openMedia, openFiles };
};
