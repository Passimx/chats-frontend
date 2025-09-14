import { Types } from '../../root/types/files/types.ts';

export type PropsType = {
    file: Types;
};

export type Return = [number | undefined, () => void, Blob | undefined];
