import { FC, memo, useEffect } from 'react';
import styles from './index.module.css';
import { GoFileMedia } from 'react-icons/go';
import { CiFileOn } from 'react-icons/ci';
import { useOpenMedia } from './hooks/use-open-media.hook.ts';
import { PropsType } from './types.ts';
import useVisibility from '../../common/hooks/use-visibility.ts';
import useClickOutside from '../../common/hooks/use-click-outside.ts';
import { useTranslation } from 'react-i18next';

export const MediaMenu: FC<PropsType> = memo(({ isVisibleMediaMenuOutside, setIsVisibleMediaMenuOutside }) => {
    const visibility = useVisibility;
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside();
    const [openMedia, openFiles] = useOpenMedia(setIsVisible);
    const { t } = useTranslation();

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
            <div className={styles.menu_item} onClick={openMedia}>
                <GoFileMedia className={styles.menu_item_icon} />
                <div className="text_translate">{t('media')}</div>
            </div>
            <div className={styles.menu_item} onClick={openFiles}>
                <CiFileOn className={styles.menu_item_icon} strokeWidth={1} />
                <div className="text_translate">{t('file')}</div>
            </div>
            {/*<div className={styles.menu_item}>*/}
            {/*    <MdOutlineLocationOn className={styles.menu_item_icon} />*/}
            {/*    <div>Геолокация</div>*/}
            {/*</div>*/}
        </div>
    );
});
