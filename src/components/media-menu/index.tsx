import { FC, useEffect } from 'react';
import styles from './index.module.css';
import { GoFileMedia } from 'react-icons/go';
import { CiFileOn } from 'react-icons/ci';
import { useOpenMedia } from './hooks/use-open-media.hook.ts';
import { PropsType } from './types.ts';
import useVisibility from '../../common/hooks/use-visibility.ts';
import useClickOutside from '../../common/hooks/use-click-outside.ts';

export const MediaMenu: FC<PropsType> = ({ isVisibleMediaMenuOutside, setIsVisibleMediaMenuOutside }) => {
    const visibility = useVisibility;
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside();
    const [openMedia, openFiles] = useOpenMedia(setIsVisible);

    useEffect(() => {
        if (isVisible !== isVisibleMediaMenuOutside && isVisibleMediaMenuOutside !== undefined) {
            setIsVisible(isVisibleMediaMenuOutside);
        }
    }, [isVisibleMediaMenuOutside]);

    useEffect(() => {
        if (isVisible !== isVisibleMediaMenuOutside) setIsVisibleMediaMenuOutside(isVisible);
    }, [isVisible]);

    return (
        <div
            ref={wrapperRef}
            className={`${styles.background} ${visibility(styles.show_slowly, styles.hide_slowly, isVisible)}`}
        >
            <button className={styles.menu_item} onClick={openMedia}>
                <GoFileMedia className={styles.menu_item_icon} />
                <div>Фото и видео</div>
            </button>
            <button className={styles.menu_item} onClick={openFiles}>
                <CiFileOn className={styles.menu_item_icon} strokeWidth={1} />
                <div>Файл</div>
            </button>
            {/*<div className={styles.menu_item}>*/}
            {/*    <MdOutlineLocationOn className={styles.menu_item_icon} />*/}
            {/*    <div>Геолокация</div>*/}
            {/*</div>*/}
        </div>
    );
};
