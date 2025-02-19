import { FC, useState } from 'react';
import styles from './index.module.css';
import { BsEmojiSmile, BsFillArrowUpCircleFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { useEnterHook } from './hooks/use-enter.hook.ts';
import Emoji from '../emoji';

const InputMessage: FC = () => {
    const { t } = useTranslation();
    const [sendMessage, onInput, setEmoji, isShowPlaceholder] = useEnterHook();
    const [isVisibleEmoji, setIsVisibleEmoji] = useState<boolean>();

    return (
        <div id={styles.write_message}>
            <div id={styles.message_inputs}>
                <Emoji setEmoji={setEmoji} isVisibleOutside={isVisibleEmoji} setIsVisibleOutside={setIsVisibleEmoji} />
                <div id={styles.text_block}>
                    <div
                        className={`${styles.button_block} ${isVisibleEmoji && styles.button_block_active}`}
                        onClick={() => setIsVisibleEmoji(true)}
                    >
                        <div className={styles.button_emoji_background}>
                            <BsEmojiSmile className={styles.button_emoji} />
                        </div>
                    </div>
                    <div id={styles.new_message_block}>
                        <div
                            className={`${styles.placeholder_text} ${useVisibility(styles.show_slowly, styles.hide_slowly, isShowPlaceholder)}`}
                            dir="auto"
                        >
                            {t('chats_enter_message')}...
                        </div>
                        <div
                            id={styles.new_message}
                            contentEditable="true"
                            role="textbox"
                            dir="auto"
                            onInput={onInput}
                        ></div>
                    </div>
                </div>
                <div className={styles.button_block}>
                    <div className={styles.button_background} onClick={sendMessage}>
                        <BsFillArrowUpCircleFill className={`${styles.button}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputMessage;
