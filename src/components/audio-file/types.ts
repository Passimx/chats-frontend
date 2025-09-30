import { Types } from '../../root/types/files/types.ts';

export type PropsType = {
    file: Types;
};

export type Return = { downloadPercent?: number; blob?: Blob; clickFile: () => void; downloadOnDevice: () => void };
