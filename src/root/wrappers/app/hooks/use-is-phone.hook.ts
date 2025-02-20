import { useAppAction } from '../../../store';
import { useEffect } from 'react';

export const useIsPhone = () => {
    const { setIsPhone } = useAppAction();

    useEffect(() => {
        setIsPhone();
        window.addEventListener('resize', () => setIsPhone());
    }, []);
};
