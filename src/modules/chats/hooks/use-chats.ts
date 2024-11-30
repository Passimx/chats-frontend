import useDebounced from '../../../common/hooks/use-debounced.ts';
import { useEffect, useState } from 'react';
import { getChats } from '../../../root/api/chats';
import { useAppAction, useAppSelector } from '../../../root/store';
import { Envs } from '../../../common/config/envs/envs.ts';
import { ChatType } from '../../../root/types/chat/chat.type.ts';

let globalKey: string | undefined = undefined;

const useChats = (input?: string): [boolean, ChatType[], () => void] => {
    const limit = Envs.chats.limit;
    const key = useDebounced(input, 300);
    const { chats } = useAppSelector((state) => state.chats);
    const { setChats } = useAppAction();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);
    const isOnline = useAppSelector((state) => state.app.isOnline);

    const scrollBottom = () => {
        setOffset(offset + limit);
    };

    useEffect(() => {
        setIsLoading(true);
        if (input === key && isOnline && isLoading) return setIsLoading(false);
        globalKey = input;
    }, [input, isOnline]);

    useEffect(() => {
        if (!isOnline) return;

        getChats(key, limit, offset).then(({ success, data }) => {
            if (key !== globalKey) return;
            setIsLoading(false);

            if (success && data) setChats(data);
            else setChats([]);
        });
    }, [key, isOnline, offset]);

    return [isLoading, chats, scrollBottom];
};

export default useChats;
