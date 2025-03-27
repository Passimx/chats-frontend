import { useEffect } from 'react';

export const useOpen = () => {
    useEffect(() => {
        window.Telegram?.WebApp.expand();
    }, []);
};
