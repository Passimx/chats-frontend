import useDebounced from '../../../common/hooks/use-debounced.ts';
import { useEffect, useState } from 'react';
import { getChats } from '../../../root/api/chats';
import { useAppAction, useAppSelector } from '../../../root/store';
import { ChatItemType } from '../../../root/types/chat/chat-item.type.ts';

let globalKey: string | undefined = undefined;

const useChats = (input?: string): [boolean, ChatItemType[]] => {
    const key = useDebounced(input, 300);
    const { chats } = useAppSelector((state) => state.chats);
    const { setChats } = useAppAction();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (input === key) return setIsLoading(false);

        globalKey = input;
        setIsLoading(true);
    }, [input]);

    useEffect(() => {
        getChats(key).then(({ success, data }) => {
            if (key !== globalKey) return;
            setIsLoading(false);

            if (success) setChats(data);
            else setChats([]);
        });
    }, [key]);

    return [isLoading, chats];
};

export default useChats;
