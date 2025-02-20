import styles from './index.module.css';
import { FC, useCallback, useEffect } from 'react';
import useVisibility from '../../common/hooks/use-visibility.ts';
import useClickOutside from '../../common/hooks/use-click-outside.ts';
import { PropsType } from './props.type.ts';
import { emojiList } from './common/array.ts';
import { useTranslation } from 'react-i18next';
import { HiOutlineFaceSmile, HiOutlineNoSymbol } from 'react-icons/hi2';
import { GoPeople } from 'react-icons/go';
import { LuDog } from 'react-icons/lu';
import { IoAirplaneOutline, IoFastFoodOutline, IoFlagOutline } from 'react-icons/io5';
import { AiOutlineBulb } from 'react-icons/ai';
import { CiBasketball } from 'react-icons/ci';

const Emoji: FC<PropsType> = ({ isVisibleOutside, setIsVisibleOutside, setEmoji }) => {
    const iconSize = 24;
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

    useEffect(() => {
        const element = document.getElementById(styles.emoji_rows)!;
        const sections = document.querySelectorAll(`.${styles.emoji_icon}`);
        let activeTab = 0;

        element.addEventListener('scroll', () => {
            document.querySelectorAll('section').forEach((section, index) => {
                const rect = section.getBoundingClientRect();

                // todo
                // добавить условие для нижнего края, инаяе при клике ломается
                if (rect.top < element.offsetHeight + 330) {
                    // if (rect.top < element.offsetHeight + 330 && rect.bottom > 5) {
                    if (activeTab === index) return;
                    activeTab = index;
                    const activeLink = sections[index];
                    sections.forEach((section) => section.classList.remove(styles.active));
                    if (section) activeLink.classList.add(styles.active);
                }
            });
        });
    }, []);

    const focusEmojiRow = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (!element) return;
        element.scrollIntoView({ behavior: 'instant' });
    }, []);

    return (
        <div
            ref={wrapperRef}
            id={styles.background}
            className={visibility(styles.show_slowly, styles.hide_slowly, isVisible)}
        >
            <div id={styles.emoji_rows}>
                {Object.entries(emojiList).map(([key, array], index) => (
                    <section id={key} key={key} className={styles.emoji_row}>
                        <div id={`section${index}`} className={styles.emoji_name}>
                            {t(key)}
                        </div>
                        <div className={styles.emoji_list}>
                            {array.map((emoji) => (
                                <div key={emoji} onClick={() => setEmoji(emoji)} className={styles.emoji_list_item}>
                                    {emoji}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
            <div className={styles.emoji_icons}>
                <div
                    className={`${styles.emoji_icon} ${styles.active}`}
                    onClick={() => focusEmojiRow(Object.keys(emojiList)[0])}
                >
                    <HiOutlineFaceSmile size={iconSize} />
                </div>
                <div className={styles.emoji_icon} onClick={() => focusEmojiRow(Object.keys(emojiList)[1])}>
                    <GoPeople size={iconSize} />
                </div>
                <div className={styles.emoji_icon} onClick={() => focusEmojiRow(Object.keys(emojiList)[2])}>
                    <LuDog size={iconSize} />
                </div>
                <div className={styles.emoji_icon} onClick={() => focusEmojiRow(Object.keys(emojiList)[3])}>
                    <IoFastFoodOutline size={iconSize} />
                </div>
                <div className={styles.emoji_icon} onClick={() => focusEmojiRow(Object.keys(emojiList)[4])}>
                    <IoAirplaneOutline size={iconSize} />
                </div>
                <div className={styles.emoji_icon} onClick={() => focusEmojiRow(Object.keys(emojiList)[5])}>
                    <CiBasketball size={iconSize} />
                </div>
                <div className={styles.emoji_icon} onClick={() => focusEmojiRow(Object.keys(emojiList)[6])}>
                    <AiOutlineBulb size={iconSize} />
                </div>
                <div className={styles.emoji_icon} onClick={() => focusEmojiRow(Object.keys(emojiList)[7])}>
                    <HiOutlineNoSymbol size={iconSize} />
                </div>
                <div className={styles.emoji_icon} onClick={() => focusEmojiRow(Object.keys(emojiList)[8])}>
                    <IoFlagOutline size={iconSize} />
                </div>
            </div>
        </div>
    );
};

export default Emoji;
