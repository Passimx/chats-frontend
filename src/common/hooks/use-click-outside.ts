import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

const useClickOutside = (
    visible?: boolean,
): [RefObject<HTMLDivElement>, boolean | undefined, (value: boolean) => void] => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>();

    const handleClickOutside = useCallback((event: any) => {
        if (event && ref.current && !ref.current.contains(event.target)) {
            setTimeout(() => setIsVisible(false), 50);
        }
    }, []);

    useEffect(() => {
        if (visible) setIsVisible(visible);

        return () => document.removeEventListener('mouseup', handleClickOutside, false);
    }, []);

    useEffect(() => {
        if (isVisible) document.addEventListener('mouseup', handleClickOutside, false);
        else document.removeEventListener('mouseup', handleClickOutside, false);
    }, [isVisible]);

    return [ref, isVisible, setIsVisible];
};

export default useClickOutside;
