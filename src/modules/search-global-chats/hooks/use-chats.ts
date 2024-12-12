import { useEffect, useState } from 'react';
import { getChats } from '../../../root/api/chats';
import { useAppSelector } from '../../../root/store';
import { Envs } from '../../../common/config/envs/envs.ts';
import useDebounced from '../../../common/hooks/use-debounced.ts';
import { ChatType } from '../../../root/types/chat/chat.type.ts';
import rawChats from '../../../root/store/chats/chats.raw.ts';

let localRawChats = new Map<number, ChatType>();
let globalKey: string | undefined = undefined;

const useChats = (
    input: string | undefined,
    changeIsLoading: (value: boolean) => void,
): [ChatType[], boolean, () => void] => {
    const limit = Envs.chats.limit;
    const notFavoriteChatIds = Array.from(rawChats.chats.keys());
    const key = useDebounced(input, 300);
    const [chats, setChats] = useState<ChatType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);
    const isOnline = useAppSelector((state) => state.app.isOnline);
    const { chats: sliceChats } = useAppSelector((state) => state.chats);

    useEffect(() => {
        Array.from(rawChats.chats.values()).forEach((chat) => localRawChats.delete(chat.id));
        const newArray = [...Array.from(localRawChats.values())].reverse();
        setChats(newArray);
    }, [sliceChats]);

    const setToEnd = (payload: ChatType[]) => {
        if (!payload.length) return;

        const newMap = new Map<number, ChatType>();

        [...payload].reverse().forEach((chat) => newMap.set(chat.id, chat));

        localRawChats = new Map<number, ChatType>([...newMap, ...localRawChats]);
        const newArray = [...Array.from(localRawChats.values())].reverse();
        setChats(newArray);
    };

    const removeAll = () => {
        localRawChats = new Map<number, ChatType>();
        setChats([]);
    };

    const scrollBottom = () => {
        setOffset(offset + limit);
    };

    useEffect(() => {
        setIsLoading(!!input?.length);
        if (input === key && isOnline) return setIsLoading(false);
        globalKey = input;
    }, [input, isOnline]);

    useEffect(() => {
        if (chats.length < offset) return;
        if (!isOnline) return;
        if (!offset) return;

        getChats(key, limit, offset, notFavoriteChatIds).then(({ success, data }) => {
            if (key !== globalKey) return;
            setIsLoading(false);

            if (success && data) setToEnd(data);
            else setToEnd([]);
        });
    }, [offset]);

    useEffect(() => {
        if (!key?.length) return removeAll();

        if (!isOnline) return;
        setOffset(0);
        removeAll();

        getChats(key, limit, 0, notFavoriteChatIds).then(({ success, data }) => {
            if (key !== globalKey) return;
            setIsLoading(false);

            if (success && data) setToEnd(data);
            else setToEnd([]);
        });
    }, [key, isOnline]);

    useEffect(() => {
        changeIsLoading(isLoading);
    }, [isLoading]);

    return [chats, isLoading, scrollBottom];
};

export default useChats;
