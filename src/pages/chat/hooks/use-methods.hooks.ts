import { MouseEvent, useCallback, useContext } from 'react';
import { useAppAction, useAppSelector } from '../../../root/store';
import { leaveChats } from '../../../root/api/chats';
import { EventsEnum } from '../../../root/types/events/events.enum.ts';
import { changeHead } from '../../../common/hooks/change-head-inf.hook.ts';
import { useCustomNavigate } from '../../../common/hooks/use-custom-navigate.hook.ts';
import styles from '../index.module.css';
import { ContextChat } from '../context/chat-context.tsx';

type R = [() => void, (e: MouseEvent<unknown>) => void, (e: MouseEvent<unknown>) => void];

export const useMethods = (): R => {
    const isPhone = useAppSelector((state) => state.app.isPhone);
    const chatOnPage = useAppSelector((state) => state.chats.chatOnPage);
    const { postMessageToBroadCastChannel, setChatOnPage } = useAppAction();
    const { isShowMessageMenu, setIsShowMessageMenu } = useContext(ContextChat)!;
    const navigate = useCustomNavigate();

    const addChat = useCallback(() => {
        if (!chatOnPage) return;
        const el = document.getElementById(styles.messages)!;
        const scrollTop = el.scrollTop;

        postMessageToBroadCastChannel({
            event: EventsEnum.ADD_CHAT,
            data: { ...chatOnPage!, messages: chatOnPage.messages, readMessage: chatOnPage.countMessages, scrollTop },
        });
    }, [chatOnPage]);

    const back = useCallback(
        (e: MouseEvent<unknown>) => {
            e.stopPropagation();
            document.documentElement.style.setProperty('--menu-margin', '0px');

            if (window.innerWidth <= 600)
                setTimeout(() => {
                    navigate('/');
                    setChatOnPage(null);
                }, 300);
            if (isShowMessageMenu) setIsShowMessageMenu(false);
        },
        [isShowMessageMenu, isPhone],
    );

    const leave = useCallback(
        (e: MouseEvent<unknown>) => {
            const id = chatOnPage!.id;
            leaveChats([id]);
            postMessageToBroadCastChannel({ event: EventsEnum.REMOVE_CHAT, data: id });

            setChatOnPage(null);
            changeHead();

            navigate('/');
            back(e);
        },
        [chatOnPage?.id],
    );

    return [addChat, leave, back];
};
