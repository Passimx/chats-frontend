import { FC, FormEvent, useEffect, useState } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { BsEmojiSmile, BsFillArrowUpCircleFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { createMessage } from '../../root/api/chats';
import { useParams } from 'react-router-dom';

import styles2 from '../../pages/chat/index.module.css';

const InputMessage: FC<PropsType> = () => {
    const { t } = useTranslation();
    const [isShowPlaceholder, setIsShowPlaceholder] = useState<boolean>();
    const { id } = useParams();
    const chatId = Number(id);

    const onInput = (event: FormEvent<HTMLDivElement>) => {
        const isEmpty = ['', '\n'].includes(event.currentTarget.innerText);
        if (isEmpty) event.currentTarget.innerText = '';
        setIsShowPlaceholder(isEmpty);
    };

    const sendMessage = async (): Promise<void> => {
        const element = document.getElementById(styles.new_message)!;

        const message = element.innerText.replace(/^\n+|\n+$/g, '').trim();

        element.innerText = '';
        setIsShowPlaceholder(true);

        const divElement = document.getElementById(styles2.messages)!;
        divElement.scrollTop = 0;

        await createMessage({ message, chatId });
    };

    useEffect(() => {
        const element = document.getElementById(styles.new_message);

        element?.addEventListener('keypress', (event) => {
            if (event.code === 'Enter' && !event.shiftKey) event.preventDefault();
        });

        element?.addEventListener('keyup', async (event) => {
            const element = document.getElementById(styles.new_message)!;
            const isEmpty = element.innerText.replace(/^\n+|\n+$/g, '').trim() === '';

            if (event.code === 'Enter' && !event.shiftKey && !isEmpty) await sendMessage();
        });
    }, []);

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
                        <div
                            className={`${styles.placeholder_text} ${useVisibility(styles.show_slowly, styles.hide_slowly, isShowPlaceholder)}`}
                            dir="auto"
                        >
                            {t('chats_enter_message')}...
                        </div>
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
