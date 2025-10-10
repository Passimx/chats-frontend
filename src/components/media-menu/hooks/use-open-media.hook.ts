import { ChangeEvent, useCallback, useContext } from 'react';
import { ContextMedia } from '../../preview-media-context';

export const useOpenMedia = (setIsVisible: (value: boolean) => void) => {
    const { setFiles } = useContext(ContextMedia)!;

    const getFiles = (accept?: string) => {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.value = '';
            input.type = 'file';
            input.multiple = true;
            if (accept) input.accept = accept;

            // todo
            // input.accept = 'image/*,video/*';
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            input.onchange = (e: ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files;
                if (files?.length) setFiles(files);
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
