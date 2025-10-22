import { FC, memo, useEffect } from 'react';
import styles from './index.module.css';
import { GoFileMedia } from 'react-icons/go';
import { CiFileOn } from 'react-icons/ci';
import { useOpenMedia } from './hooks/use-open-media.hook.ts';
import { PropsType } from './types.ts';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';
import useClickOutside from '../../common/hooks/use-click-outside.ts';
import { useTranslation } from 'react-i18next';

export const MediaMenu: FC<PropsType> = memo(({ isVisibleMediaMenuOutside, setIsVisibleMediaMenuOutside }) => {
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
            className={`${styles.background} ${setVisibilityCss(styles.show_slowly, styles.hide_slowly, isVisible)}`}
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
