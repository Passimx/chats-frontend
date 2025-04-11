import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../root/store';
import { useCallback } from 'react';

type T = { replace?: boolean; state?: any; preventScrollReset?: boolean };

export const useCustomNavigate = (): ((to: string, data?: T) => void) => {
    const { isPhone } = useAppSelector((state) => state.app);
    const navigate = useNavigate();

    return useCallback(
        (to: string, data?: T) => {
            navigate(to, { replace: isPhone, ...data });
        },
        [isPhone],
    );
};
