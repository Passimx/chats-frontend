import { FC, useEffect, useState } from 'react';
import Input from '../input';
import useDebounced from '../../common/hooks/use-debounced.ts';
import { useTranslation } from 'react-i18next';
import ChatItem from '../chat-item';
import styles from './index.module.css';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { getChats } from '../../root/api/chats';
import { useAppAction, useAppSelector } from '../../root/store';

let globalKey: string | undefined = undefined;
const Chats: FC = () => {
    const { t } = useTranslation();
    const [input, setInput] = useState<string>();
    const key = useDebounced(input, 300);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { chats } = useAppSelector((state) => state.chats);
    const { setChats } = useAppAction();

    useEffect(() => {
        if (input === key) return setIsLoading(false);

        globalKey = input;
        setIsLoading(true);
    }, [input]);

    useEffect(() => {
        getChats(key).then(({ success, data }) => {
            if (key !== globalKey || !success) return;

            setIsLoading(false);
            setChats(data);
        });
    }, [key]);

    if (chats)
        return (
            <div id={styles.background}>
                <div id={styles.search}>
                    <Input onChange={setInput} value={input} isLoading={isLoading} placeholder={t('search')} />
                    <IoIosAddCircleOutline id={styles.new_chat_icon} />
                </div>
                <div id={styles.chats}>
                    {chats.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>
        );
};
export default Chats;
