import { ChangeEvent, useCallback, useContext } from 'react';
import { ContextMedia } from '../../preview-media-context';

export const useOpenMedia = (setIsVisible: (value: boolean) => void) => {
    const { setFiles } = useContext(ContextMedia)!;

    const getFiles = (accept?: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        if (accept) input.accept = accept;

        // input.accept = 'image/*,video/*';
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        input.onchange = (e: ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files?.length) setFiles(files);
        };
        input.click();
        setIsVisible(false);
    };

    const openMedia = useCallback(() => getFiles('image/*,video/*'), []);
    const openFiles = useCallback(() => getFiles(), []);

    return [openMedia, openFiles];
};
