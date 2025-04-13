import { useOpen } from './hooks/use-open.hook.ts';
import { useSaveHeight } from './hooks/use-save-height.hook.ts';

export const useTelegram = () => {
    useOpen();
    useSaveHeight();
};
