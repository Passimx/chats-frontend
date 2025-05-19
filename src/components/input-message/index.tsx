import { FC, useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { BsEmojiSmile, BsFillArrowUpCircleFill } from 'react-icons/bs';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { useEnterHook } from './hooks/use-enter.hook.ts';
import Emoji from '../emoji';
import { useAppAction, useAppSelector } from '../../root/store';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { PropsType } from './types/props.type.ts';
import { ParentMessage } from '../parent-message';
import { GiCancel } from 'react-icons/gi';
import { getRawChat } from '../../root/store/chats/chats.raw.ts';

const InputMessage: FC<PropsType> = ({ isVisibleBottomButton, showLastMessages }) => {
    const [sendMessage, onInput, setEmoji, placeholder, isShowPlaceholder] = useEnterHook();
    const { update, setChatOnPage } = useAppAction();
    const [isVisibleEmoji, setIsVisibleEmoji] = useState<boolean>();
    const { chatOnPage } = useAppSelector((state) => state.chats);

    const cancelAnswerMessage = useCallback(() => {
        if (getRawChat(chatOnPage!.id)) update({ id: chatOnPage!.id, answerMessage: undefined });
        else setChatOnPage({ ...chatOnPage!, answerMessage: undefined });
    }, [chatOnPage?.id]);

    useEffect(() => {
        if (isVisibleEmoji) setIsVisibleEmoji(false);
    }, [chatOnPage?.id]);

    const visibility = useVisibility;

    useEffect(() => {
        const element = document.getElementById(styles.new_message)!;
        element.focus();
    }, []);

    return (
        <div id={styles.write_message}>
            <div id={styles.message_inputs}>
                <Emoji setEmoji={setEmoji} isVisibleOutside={isVisibleEmoji} setIsVisibleOutside={setIsVisibleEmoji} />
                <div id={styles.input_block}>
                    {chatOnPage?.answerMessage && (
                        <div id={styles.answer_block}>
                            <ParentMessage {...chatOnPage?.answerMessage} />
                            <div id={styles.answer_block_cancel} onClick={cancelAnswerMessage}>
                                <GiCancel id={styles.answer_block_cancel_icon} />
                            </div>
                        </div>
                    )}
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
