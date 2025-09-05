import { createContext, FC, useState } from 'react';
import { ContextType } from './index.type.ts';

export const ContextMedia = createContext<ContextType | null>(null);

export const PreviewMediaContext: FC<{ children: JSX.Element | JSX.Element[] | undefined }> = ({ children }) => {
    const [files, setFiles] = useState<FileList>();

    const value = { files, setFiles };
    return <ContextMedia.Provider value={value}>{children}</ContextMedia.Provider>;
};
