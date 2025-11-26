import { useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { rawApp } from '../../../store/app/app.raw.ts';

export const useUpdateBadge = () => {
    const { messageCount } = useAppSelector((state) => state.chats);

    useEffect(() => {
        if (!rawApp.isMainTab) return;
        if (!messageCount) return;
        if (navigator.setAppBadge) navigator.setAppBadge(messageCount);
    }, [messageCount]);
};
