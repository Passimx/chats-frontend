import { FC, useCallback, useState } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { ParentMessage } from '../parent-message';
import { GiCancel } from 'react-icons/gi';
import { getRawChat } from '../../root/store/chats/chats.raw.ts';
import { BsEmojiSmile, BsFillArrowUpCircleFill } from 'react-icons/bs';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import Emoji from '../emoji';
import { useEnterHook } from './hooks/use-enter.hook.ts';
import { PropsType } from './types/props.type.ts';
import useVisibility from '../../common/hooks/use-visibility.ts';

export const InputMessage: FC<PropsType> = ({ showLastMessages, isVisibleBottomButton }) => {
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { update, setChatOnPage } = useAppAction();
    const [isVisibleEmoji, setIsVisibleEmoji] = useState<boolean>();
    const [sendMessage, setEmoji, placeholder, isShowPlaceholder] = useEnterHook();

    const visibility = useVisibility;

    const cancelAnswerMessage = useCallback(() => {
        if (!chatOnPage?.id) return;
        if (getRawChat(chatOnPage.id)) update({ id: chatOnPage.id, answerMessage: undefined });
        else setChatOnPage({ answerMessage: undefined });
    }, [chatOnPage]);

    return (
        <div id={styles.background}>
            <div id={styles.main_block}>
                {chatOnPage?.answerMessage && (
                    <div id={styles.answer_block}>
                        <ParentMessage {...chatOnPage?.answerMessage} />
                        <div id={styles.answer_block_cancel} onClick={cancelAnswerMessage}>
                            <GiCancel id={styles.answer_block_cancel_icon} />
                        </div>
                    </div>
                )}
                <div id={styles.inputs}>
                    <Emoji
                        setEmoji={setEmoji}
                        isVisibleOutside={isVisibleEmoji}
                        setIsVisibleOutside={setIsVisibleEmoji}
                    />
                    <div className={styles.button_inputs_background}>
                        <div
                            id={styles.button_emoji_block}
                            className={`${isVisibleEmoji && styles.button_block_active}`}
                            onClick={(event) => {
                                event.preventDefault();
                                if (chatOnPage?.type !== ChatEnum.IS_SYSTEM) setIsVisibleEmoji(true);
                            }}
                            onMouseDown={(event) => {
                                event.preventDefault();
                            }}
                        >
                            <BsEmojiSmile className={styles.button_emoji} />
                        </div>
                    </div>
                    <div id={styles.new_message_block}>
                        <div
                            className={`${styles.placeholder_text} ${useVisibility(styles.show_slowly, styles.hide_slowly, isShowPlaceholder)} text_translate`}
                            dir="auto"
                        >
                            {placeholder}
                        </div>
                        <div
                            id={styles.new_message}
                            contentEditable={chatOnPage?.type !== ChatEnum.IS_SYSTEM}
                            dir="auto"
                        ></div>
                    </div>
                    <div id={styles.button_input_background}>
                        <div
                            id={styles.bottom_button_background}
                            className={`${visibility(styles.show_bottom_button, styles.hide_bottom_button, isVisibleBottomButton)}`}
                            onClick={showLastMessages}
                        >
                            <BsFillArrowUpCircleFill id={`${styles.bottom_button}`} />
                        </div>
                        <div id={styles.button_input_block} onClick={sendMessage}>
                            <BsFillArrowUpCircleFill id={styles.button} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
