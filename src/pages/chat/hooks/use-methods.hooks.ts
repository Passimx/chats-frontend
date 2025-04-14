import { MouseEvent, useCallback } from 'react';
import { useAppAction, useAppSelector } from '../../../root/store';
import { leaveChats } from '../../../root/api/chats';
import { EventsEnum } from '../../../root/types/events/events.enum.ts';
import { changeHead } from '../../../common/hooks/change-head-inf.hook.ts';
import { useCustomNavigate } from '../../../common/hooks/use-custom-navigate.hook.ts';
import { MessageType } from '../../../root/types/chat/message.type.ts';
import styles from '../index.module.css';

type R = [() => void, (e: MouseEvent<unknown>) => void, (e: MouseEvent<unknown>) => void];

export const useMethods = (messages: MessageType[]): R => {
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { postMessageToBroadCastChannel } = useAppAction();
    const navigate = useCustomNavigate();

    const addChat = useCallback(() => {
        const el = document.getElementById(styles.messages)!;
        const scrollTop = el.scrollTop;

        postMessageToBroadCastChannel({
            event: EventsEnum.ADD_CHAT,
            data: { ...chatOnPage!, messages: messages, readMessage: chatOnPage!.countMessages, scrollTop },
        });
    }, [chatOnPage, messages]);

    const back = useCallback((e: MouseEvent<unknown>) => {
        e.stopPropagation();
        document.documentElement.style.setProperty('--menu-margin', '0px');
    }, []);

    const leave = useCallback(
        (e: MouseEvent<unknown>) => {
            const id = chatOnPage!.id;
            leaveChats([id]);
            postMessageToBroadCastChannel({ event: EventsEnum.REMOVE_CHAT, data: id });

            changeHead();

            navigate('/');
            back(e);
        },
        [chatOnPage?.id],
    );

    return [addChat, leave, back];
};
