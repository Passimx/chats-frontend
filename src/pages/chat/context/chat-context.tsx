import Chat from '../index.tsx';
import { MessageType } from '../../../root/types/chat/message.type.ts';
import { createContext, FC, useMemo, useState } from 'react';
import { ContextType } from '../types/context.type.ts';
import { useListenScroll } from '../hooks/use-listen-scroll.hook.ts';
import { useShowLastMessagesButton } from '../hooks/use-show-last-messages-button.hook.ts';

export const ContextChat = createContext<ContextType | null>(null);

export const ChatContext: FC = () => {
    useListenScroll();
    const [isShowLastMessagesButton] = useShowLastMessagesButton();
    const [clickMessage, setClickMessage] = useState<MessageType>();
    const [isShowMessageMenu, setIsShowMessageMenu] = useState<boolean>();

    const value = useMemo<ContextType>(
        () => ({ clickMessage, isShowMessageMenu, isShowLastMessagesButton, setClickMessage, setIsShowMessageMenu }),
        [clickMessage, isShowMessageMenu, setClickMessage, setIsShowMessageMenu, isShowLastMessagesButton],
    );

    return (
        <ContextChat.Provider value={value}>
            <Chat />
        </ContextChat.Provider>
    );
};
