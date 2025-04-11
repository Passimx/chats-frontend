import { useAppAction } from '../../../store';

export const useOnline = () => {
    const { setOnline, setIsListening } = useAppAction();

    const updateOnlineStatus = () => {
        if (!navigator.onLine) setIsListening(false);
        setOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
};
