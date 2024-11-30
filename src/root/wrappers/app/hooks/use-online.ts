import { useAppAction } from '../../../store';

export const useOnline = () => {
    const { setOnline } = useAppAction();

    const updateOnlineStatus = () => {
        setOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
};
