import { useEffect, useState } from 'react';
import { MessageType } from '../../root/types/chat/message.type.ts';

export const usePinned = (messageId?: string, pinnedMessages?: MessageType[]) => {
    const [isPin, setIsPin] = useState<boolean>(false);

    useEffect(() => {
        if (!pinnedMessages?.length) return setIsPin(false);

        setIsPin(!!pinnedMessages?.find((message) => message.id === messageId));
    }, [pinnedMessages?.length, messageId]);

    return isPin;
};
