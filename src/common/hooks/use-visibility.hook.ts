import { RefObject, useEffect, useRef, useState } from 'react';

export const useVisibility = (): [RefObject<HTMLDivElement>, boolean] => {
    const observerTarget = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setVisible(entry.isIntersecting);
            },
            { threshold: 0.001 },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    return [observerTarget, visible];
};
