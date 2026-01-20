import { useCallback, useContext } from 'react';
import { ContextMedia } from '../../preview-media-context';
import { getFilesWithMetadata } from '../../../common/hooks/get-files-with-metadata.ts';
import { FilesType } from '../../../root/types/files/types.ts';

export const useOpenMedia = (setIsVisible: (value: boolean) => void) => {
    const { files, setFiles, setLossless } = useContext(ContextMedia)!;

    function filterNewArrayByName(newArray: FilesType[], oldArray?: FilesType[]): FilesType[] {
        if (!newArray || newArray.length === 0) {
            return [];
        }

        if (!oldArray || oldArray.length === 0) {
            return newArray;
        }

        const oldMetadataNames = new Set<string>();

        for (let i = 0; i < oldArray.length; i++) {
            if (oldArray[i]?.name) {
                oldMetadataNames.add(oldArray[i].name);
            }
        }

        const filteredArray: FilesType[] = [];

        for (let i = 0; i < newArray.length; i++) {
            const newItem = newArray[i];
            const newName = newItem?.name;

            // Only push items that DON'T exist in oldArray
            if (newName && !oldMetadataNames.has(newName)) {
                filteredArray.push(newItem);
            }
        }

        return filteredArray;
    }

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

                const newFiles = await getFilesWithMetadata(Array.from(payload));
                const newFilesFiltered = filterNewArrayByName(newFiles, files);
                // Сheck whether the files were selected earlier
                setFiles(files && files.length > 0 ? [...files, ...newFilesFiltered] : newFilesFiltered);
                document.body.removeChild(input);
                resolve(true);
            };

            setTimeout(() => {
                input.click();
                setIsVisible(false);
            }, 0);
        });
    };

    const openMedia = useCallback(() => {
        getFiles('image/*,video/*');
        setLossless(false);
    }, []);

    const openFiles = useCallback(() => {
        getFiles();
        setLossless(true);
    }, []);

    return { openMedia, openFiles };
};
