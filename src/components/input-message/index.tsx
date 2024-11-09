import { FC, FormEvent, useState } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { BsEmojiSmile, BsFillArrowUpCircleFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

const InputMessage: FC<PropsType> = () => {
    const { t } = useTranslation();
    const [isShowPlaceholder, setIsShowPlaceholder] = useState<boolean>(true);

    const onInput = (event: FormEvent<HTMLDivElement>) => {
        if (['', '\n'].includes(event.currentTarget.innerText)) {
            event.currentTarget.innerText = '';
            setIsShowPlaceholder(true);
        } else setIsShowPlaceholder(false);
    };

    return (
        <div id={styles.write_message}>
            <div id={styles.message_inputs}>
                <div id={styles.text_block}>
                    <div className={styles.button_block}>
                        <div className={styles.button_emoji_background}>
                            <BsEmojiSmile className={styles.button_emoji} />
                        </div>
                    </div>
                    <div id={styles.new_message_block}>
                        <div
                            id={styles.new_message}
                            contentEditable="true"
                            role="textbox"
                            dir="auto"
                            onInput={onInput}
                        ></div>
                        {isShowPlaceholder && (
                            <span className={styles.placeholder_text} dir="auto">
                                {t('chats_enter_message')}...
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.button_block}>
                    <div className={styles.button_background}>
                        <BsFillArrowUpCircleFill className={styles.button} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputMessage;
