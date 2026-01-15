import styles from './index.module.css';
import { FC, useContext, useEffect } from 'react';
import setVisibilityCss from '../../../common/hooks/set-visibility-css';
import useClickOutside from '../../../common/hooks/use-click-outside';
import { PropsType } from './props.type';
import { ContextMedia } from '../../preview-media-context';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../root/store';
import { useOpenMedia } from '../../media-menu/hooks/use-open-media.hook';

const PreviewMediaMenu: FC<PropsType> = ({ isVisibleOutside, setIsVisibleOutside }) => {
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside(isVisibleOutside);
    const { files, lossless, setLossless } = useContext(ContextMedia)!;
    const { t } = useTranslation();
    const lang = useAppSelector((state) => state.app.settings?.lang);
    const { openMedia, openFiles } = useOpenMedia(setIsVisible);

    useEffect(() => {
        if (isVisible !== isVisibleOutside && isVisibleOutside !== undefined) {
            setIsVisible(isVisibleOutside);
        }
    }, [isVisibleOutside]);

    useEffect(() => {
        if (isVisible !== isVisibleOutside) setIsVisibleOutside(isVisible);
    }, [isVisible]);

    const losslessHandler = () => {
        if (!lossless) {
            setLossless(true);
        } else {
            setLossless(false);
        }
    };

    const addItem = () => {
        lossless ? openFiles() : openMedia();
    };

    return (
        <>
            {
                <div
                    id={styles.media_menu}
                    className={setVisibilityCss(styles.show_slowly, styles.hide_slowly, isVisible)}
                    ref={wrapperRef}
                    onClick={() => setIsVisible(false)}
                >
                    <div className={styles.media_menu_item} onClick={addItem}>
                        {t('add')}
                    </div>
                    <div className={styles.media_menu_item} onClick={() => losslessHandler()}>
                        {`${lossless ? t('send_as_media') : lang !== 'zh' && files && files?.length > 1 ? t('send_as_files') : t('send_as_file')}`}
                    </div>
                </div>
            }
        </>
    );
};

export default PreviewMediaMenu;
