import { FC, useMemo } from 'react';
import { PropsType } from './types.ts';
import styles from './index.module.css';
import { EmptyAvatar } from '../empty-avatar';
import { WatchAvatar } from '../watch-avatar';
import { useAppAction } from '../../root/store';

export const Avatar: FC<PropsType> = ({ images, isClickable, showIcon }) => {
    const { setStateApp } = useAppAction();

    const src = useMemo(() => {
        if (showIcon) return '/assets/icons/favicon.svg';
        // return { small: {} as Types, original: {} as Types } as KeyInfImageType;
        // if (images?.length) return images[0];
    }, [images, showIcon]);

    return (
        <div
            className={styles.background}
            onClick={() => isClickable && setStateApp({ page: <WatchAvatar images={images} /> })}
        >
            {!src && <EmptyAvatar />}
            {src && <img src={src} alt={'avatar'} />}
        </div>
    );
};
