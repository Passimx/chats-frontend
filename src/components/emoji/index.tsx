import styles from './index.module.css';
import { FC, useEffect } from 'react';
import useVisibility from '../../common/hooks/use-visibility.ts';
import useClickOutside from '../../common/hooks/use-click-outside.ts';
import { PropsType } from './props.type.ts';
import { emojiList } from './common/array.ts';
import { useTranslation } from 'react-i18next';

const Emoji: FC<PropsType> = ({ isVisibleOutside, setIsVisibleOutside, setEmoji }) => {
    const visibility = useVisibility;
    const { t } = useTranslation();
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside();

    useEffect(() => {
        if (isVisible !== isVisibleOutside && isVisibleOutside !== undefined) {
            setIsVisible(isVisibleOutside);
        }
    }, [isVisibleOutside]);

    useEffect(() => {
        if (isVisible !== isVisibleOutside) setIsVisibleOutside(isVisible);
    }, [isVisible]);

    return (
        <div
            ref={wrapperRef}
            id={styles.background}
            className={visibility(styles.show_slowly, styles.hide_slowly, isVisible)}
        >
            <div>fast search</div>
            <div className={styles.emoji_rows}>
                {Object.entries(emojiList).map(([key, array]) => (
                    <div id={key} className={styles.emoji_row}>
                        <div className={styles.emoji_name}>{t(key)}</div>
                        <div className={styles.emoji_list}>
                            {array.map((emoji) => (
                                <div onClick={() => setEmoji(emoji)} className={styles.emoji_list_item}>
                                    {emoji}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Emoji;
