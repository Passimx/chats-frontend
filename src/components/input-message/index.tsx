import { FC, useEffect, useState } from 'react';
import styles from './index.module.css';
import { BsEmojiSmile, BsFillArrowUpCircleFill } from 'react-icons/bs';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { useEnterHook } from './hooks/use-enter.hook.ts';
import Emoji from '../emoji';
import { useAppSelector } from '../../root/store';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { PropsType } from './types/props.type.ts';

const InputMessage: FC<PropsType> = ({ isVisibleBottomButton, showLastMessages }) => {
    const [sendMessage, onInput, setEmoji, placeholder, isShowPlaceholder] = useEnterHook();
    const [isVisibleEmoji, setIsVisibleEmoji] = useState<boolean>();
    const { chatOnPage } = useAppSelector((state) => state.chats);

    useEffect(() => {
        if (isVisibleEmoji) setIsVisibleEmoji(false);
    }, [chatOnPage?.id]);

    const visibility = useVisibility;

    return (
        <div id={styles.write_message}>
            <div id={styles.message_inputs}>
                <Emoji setEmoji={setEmoji} isVisibleOutside={isVisibleEmoji} setIsVisibleOutside={setIsVisibleEmoji} />
                <div id={styles.text_block}>
                    <div
                        className={`${styles.button_block} ${isVisibleEmoji && styles.button_block_active}`}
                        onClick={(event) => {
                            event.preventDefault();
                            if (chatOnPage?.type !== ChatEnum.IS_SYSTEM) setIsVisibleEmoji(true);
                        }}
                        onMouseDown={(event) => {
                            event.preventDefault();
                        }}
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
                            {placeholder}
                        </div>
                        <div
                            id={styles.new_message}
                            contentEditable={chatOnPage?.type !== ChatEnum.IS_SYSTEM}
                            dir="auto"
                            onInput={onInput}
                        ></div>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <div
                        className={`${styles.bottom_button_background} ${visibility(styles.show_bottom_button, styles.hide_bottom_button, isVisibleBottomButton)}`}
                        onClick={showLastMessages}
                    >
                        <BsFillArrowUpCircleFill className={`${styles.bottom_button}`} />
                    </div>
                    <div className={styles.button_background} onClick={sendMessage}>
                        <BsFillArrowUpCircleFill className={`${styles.button}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputMessage;
