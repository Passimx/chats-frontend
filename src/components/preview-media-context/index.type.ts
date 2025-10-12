import { FilesType } from '../../root/types/files/types.ts';

export type ContextType = {
    files?: FilesType[];
    setFiles: (files?: FilesType[]) => void;
    deleteFile: (fileIndex: number) => void;
};
