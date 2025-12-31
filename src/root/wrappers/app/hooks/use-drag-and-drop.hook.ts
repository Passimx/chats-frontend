import { useEffect } from 'react';

export const useDragAndDropHook = () => {
    useEffect(() => {
        document.addEventListener(
            'dragover',
            (e) => {
                e.preventDefault();
            },
            false,
        );

        document.addEventListener(
            'drop',
            (e) => {
                e.preventDefault();
            },
            false,
        );
    }, []);
};
