import { FC, useEffect, useRef } from 'react';
import { PropsType } from './types/props.type.ts';

const VisibilityAction: FC<PropsType> = ({ action, loading, size }) => {
    const observerTarget = useRef(null);

    useEffect(() => {
        if (!size) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) action();
            },
            { threshold: 1 },
        );

        if (observerTarget.current) observer.observe(observerTarget.current);

        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, [loading, size]);

    if (!loading) return <div ref={observerTarget}></div>;
};

export default VisibilityAction;
