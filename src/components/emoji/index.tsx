import styles from './index.module.css';
import { FC, useCallback, useEffect, useMemo } from 'react';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';
import useClickOutside from '../../common/hooks/use-click-outside.ts';
import { PropsType } from './props.type.ts';
import { emojiList } from './common/array.ts';
import { useTranslation } from 'react-i18next';
import { HiOutlineFaceSmile, HiOutlineNoSymbol } from 'react-icons/hi2';
import { GoPeople } from 'react-icons/go';
import { LuDog } from 'react-icons/lu';
import { IoAirplaneOutline, IoFastFoodOutline, IoFlagOutline } from 'react-icons/io5';
import { AiOutlineBulb } from 'react-icons/ai';

const Emoji: FC<PropsType> = ({ isVisibleOutside, setIsVisibleOutside, setEmoji }) => {
    const iconSize = 24;
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

                if (rect.top < 544) {
                    if (activeTab === index) return;
                    activeTab = index;
                    const activeLink = sections[index];
                    sections.forEach((section) => section.classList.remove(styles.active));
                    if (section) activeLink.classList.add(styles.active);
                }
            });
        });
    }, []);

    const icons = useMemo(
        () => [
            <HiOutlineFaceSmile size={iconSize} />,
            <GoPeople size={iconSize} />,
            <LuDog size={iconSize} />,
            <IoFastFoodOutline size={iconSize} />,
            <IoAirplaneOutline size={iconSize} />,
            <AiOutlineBulb size={iconSize} />,
            <HiOutlineNoSymbol size={iconSize} />,
            <IoFlagOutline size={iconSize} />,
        ],
        [],
    );
    const focusEmojiRow = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (!element) return;
        element.scrollIntoView({ behavior: 'instant' });
    }, []);

    return (
        <div
            ref={wrapperRef}
            id={styles.background}
            className={setVisibilityCss(styles.show_slowly, styles.hide_slowly, isVisible)}
        >
            <div id={styles.emoji_rows}>
                {Object.entries(emojiList).map(([key, array], index) => (
                    <section id={key} key={key} className={styles.emoji_row}>
                        <div id={`section${index}`} className={styles.emoji_name}>
                            {icons[index]}
                            {t(key)}
                        </div>
                        <div className={styles.emoji_list}>
                            {array.map((emoji, index) => (
                                <div
                                    key={index}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setEmoji(emoji);
                                    }}
                                    className={styles.emoji_list_item}
                                >
                                    {emoji}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
            <div className={styles.emoji_icons_background}>
                <div className={styles.emoji_icons}>
                    {icons.map((icons, index) => (
                        <div
                            key={index}
                            className={styles.emoji_icon}
                            onClick={() => focusEmojiRow(Object.keys(emojiList)[index])}
                        >
                            {icons}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Emoji;
