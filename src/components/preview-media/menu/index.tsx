import styles from './index.module.css';
import { FC, useContext, useEffect } from 'react';
import setVisibilityCss from '../../../common/hooks/set-visibility-css';
import useClickOutside from '../../../common/hooks/use-click-outside';
import { PropsType } from './props.type';
import { BsCheck } from 'react-icons/bs';
import { ContextMedia } from '../../preview-media-context';

const PreviewMediaMenu: FC<PropsType> = ({ isVisibleOutside, setIsVisibleOutside }) => {
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside();
    const { lossless, setLossless } = useContext(ContextMedia)!;

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

    return (
        <>
            {
                <div
                    id={styles.media_menu}
                    className={setVisibilityCss(styles.show_slowly, styles.hide_slowly, isVisible)}
                    ref={wrapperRef}
                    onClick={() => setIsVisible(false)}
                >
                    <div className={styles.media_menu_item}>Add file</div>
                    <div className={styles.media_menu_item} onClick={() => losslessHandler()}>
                        {!lossless && <BsCheck />}
                        Send as media
                    </div>
                </div>
            }
        </>
    );
};

export default PreviewMediaMenu;
