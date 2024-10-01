import { useAppAction } from '../../index.ts';
import { useCallback } from 'react';

const useSetPage = () => {
    const { setPage } = useAppAction();
    const time = 300;

    return useCallback((page: JSX.Element | null) => {
        if (page) setPage({ page });
        else {
            setPage({ isOpenPage: false });
            setTimeout(() => setPage({ page: null }), time);
        }
    }, []);
};

export default useSetPage;
