import { FC, memo, useMemo } from 'react';
import styles from './index.module.css';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';
import { PropsType } from './types.ts';

export const Link: FC<PropsType> = memo(({ href, children }) => {
    const navigate = useCustomNavigate();

    const ownPath = useMemo(() => {
        const url = new URL(href ?? '', window.location.origin);
        return url.origin === window.location.origin ? url.pathname : undefined;
    }, [href]);

    if (ownPath)
        return (
            <div className={styles.link} onClick={() => navigate(ownPath)}>
                {children}
            </div>
        );
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {children}
        </a>
    );
});
