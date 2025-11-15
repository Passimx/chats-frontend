import { FC, useCallback, useContext, useMemo, useState } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { ParentMessage } from '../parent-message';
import { getRawChat } from '../../root/store/raw/chats.raw.ts';
import { BsEmojiSmile, BsFillArrowUpCircleFill } from 'react-icons/bs';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import Emoji from '../emoji';
import { useEnterHook } from './hooks/use-enter.hook.ts';
import { PropsType } from './types/props.type.ts';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';
import { FaMicrophone } from 'react-icons/fa';
import { MdDelete, MdOutlineClose } from 'react-icons/md';
import { CgMenuGridO } from 'react-icons/cg';
import { MediaMenu } from '../media-menu';
import { ContextChat } from '../../pages/chat/context/chat-context.tsx';

export const InputMessage: FC<PropsType> = ({ showLastMessages }) => {
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { update, setChatOnPage } = useAppAction();
    const { isShowLastMessagesButton } = useContext(ContextChat)!;
    const [isVisibleEmoji, setIsVisibleEmoji] = useState<boolean>();
    const [isVisibleMediaMenu, setIsVisibleMediaMenu] = useState<boolean>();
    const [textExist, setEmoji, placeholder, isShowPlaceholder] = useEnterHook();

    const cancelAnswerMessage = useCallback(() => {
        if (!chatOnPage?.id) return;
        if (getRawChat(chatOnPage.id)) update({ id: chatOnPage.id, answerMessage: undefined });
        else setChatOnPage({ answerMessage: undefined });
    }, [chatOnPage]);

    const readMessages = useMemo(() => {
        if (!chatOnPage?.readMessage) return undefined;
        const diff = chatOnPage.countMessages - chatOnPage.readMessage;
        if (diff === 0) return undefined;
        return diff;
    }, [chatOnPage]);

    return (
        <div id={styles.background}>
            <div id={styles.main_block}>
                {chatOnPage?.answerMessage && (
                    <div id={styles.answer_block}>
                        <ParentMessage {...chatOnPage?.answerMessage} />
                        <div id={styles.answer_block_cancel} onClick={cancelAnswerMessage}>
                            <MdOutlineClose id={styles.answer_block_cancel_icon} />
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
                            className={`${styles.placeholder_text} ${setVisibilityCss(styles.show_slowly, styles.hide_slowly, isShowPlaceholder)}`}
                            dir="auto"
                        >
                            <div className={'text_translate'}>{placeholder}</div>
                        </div>
                        <div
                            id={styles.new_message}
                            contentEditable={chatOnPage?.type !== ChatEnum.IS_SYSTEM}
                            dir="auto"
                        ></div>
                    </div>
                    <div className={styles.button_inputs_background}>
                        <MediaMenu
                            isVisibleMediaMenuOutside={isVisibleMediaMenu}
                            setIsVisibleMediaMenuOutside={setIsVisibleMediaMenu}
                        />
                        <div
                            id={styles.button_menu}
                            onClick={(event) => {
                                event.preventDefault();
                                if (chatOnPage?.type !== ChatEnum.IS_SYSTEM) setIsVisibleMediaMenu(true);
                            }}
                        >
                            <CgMenuGridO className={styles.button_emoji} />
                        </div>
                    </div>
                    <div id={styles.button_input_background}>
                        <div
                            id={styles.bottom_button_background}
                            className={`${setVisibilityCss(styles.show_bottom_button, styles.hide_bottom_button, isShowLastMessagesButton)}`}
                            onClick={showLastMessages}
                        >
                            <BsFillArrowUpCircleFill id={`${styles.bottom_button}`} />
                            {readMessages && <div id={styles.button_count}>{readMessages}</div>}
                        </div>
                        <div id={styles.button_input_block}>
                            <BsFillArrowUpCircleFill id={styles.button} />
                        </div>
                        {navigator.mediaDevices && (
                            <>
                                <div id={styles.button_microphone_delete}>
                                    <MdDelete id={styles.microphone_stop} />
                                </div>
                                <div
                                    id={styles.button_microphone_block}
                                    className={setVisibilityCss(
                                        styles.hide_recover_button,
                                        styles.show_recover_button,
                                        textExist,
                                    )}
                                >
                                    <FaMicrophone id={styles.microphone} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
