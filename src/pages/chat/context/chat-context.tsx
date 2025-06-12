import Chat from '../index.tsx';
import { MessageType } from '../../../root/types/chat/message.type.ts';
import { createContext, FC, useMemo, useState } from 'react';
import { ContextType } from '../types/context.type.ts';

export const ContextChat = createContext<ContextType | null>(null);

export const ChatContext: FC = () => {
    const [clickMessage, setClickMessage] = useState<MessageType>();
    const [isShowMessageMenu, setIsShowMessageMenu] = useState<boolean>();

    const value = useMemo<ContextType>(
        () => ({ clickMessage, isShowMessageMenu, setClickMessage, setIsShowMessageMenu }),
        [clickMessage, isShowMessageMenu, setClickMessage, setIsShowMessageMenu],
    );

    return (
        <ContextChat.Provider value={value}>
            <Chat />
        </ContextChat.Provider>
    );
};
