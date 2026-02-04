import { createContext, FC, useCallback, useState } from 'react';
import { ContextType } from './index.type.ts';
import { FilesType } from '../../root/types/files/types.ts';

export const ContextMedia = createContext<ContextType | null>(null);

export const PreviewMediaContext: FC<{ children: JSX.Element | JSX.Element[] | undefined }> = ({ children }) => {
    const [files, setFiles] = useState<FilesType[]>();
    const [lossless, setLossless] = useState(true);

    const deleteFile = useCallback(
        (fileIndex: number) => {
            if (!files) return;
            const data = files.filter((_file, index) => index !== fileIndex);
            setFiles(data);
        },
        [files],
    );

    const value = { files, setFiles, deleteFile, lossless, setLossless };
    return <ContextMedia.Provider value={value}>{children}</ContextMedia.Provider>;
};
