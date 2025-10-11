import { useAppSelector } from '../../../store';
import { useEffect } from 'react';

export const useUpdateBadge = () => {
    const { messageCount } = useAppSelector((state) => state.chats);

    useEffect(() => {
        if (navigator.setAppBadge) navigator.setAppBadge(messageCount);
    }, [messageCount]);
};
