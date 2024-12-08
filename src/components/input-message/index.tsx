import { FC } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { BsEmojiSmile, BsFillArrowUpCircleFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { useEnterHook } from './hooks/use-enter.hook.ts';

const InputMessage: FC<PropsType> = () => {
    const { t } = useTranslation();
    const [sendMessage, onInput, isShowPlaceholder] = useEnterHook();

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
