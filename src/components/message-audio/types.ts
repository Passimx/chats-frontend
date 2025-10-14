import { Types } from '../../root/types/files/types.ts';
import { MouseEvent } from 'react';

export type PropsType = {
    file: Types;
};

export type Return = {
    downloadPercent?: number;
    blob?: Blob;
    clickFile: () => void;
    downloadOnDevice: (e: MouseEvent<unknown>) => void;
};
