import { useEffect, useState } from 'react';
import { getChats } from '../../../root/api/chats';
import { useAppSelector } from '../../../root/store';
import { Envs } from '../../../common/config/envs/envs.ts';
import useDebounced from '../../../common/hooks/use-debounced.ts';
import { ChatType } from '../../../root/types/chat/chat.type.ts';

let localRawChats = new Map<string, ChatType>();
let globalKey: string | undefined = undefined;

const useChats = (
    input: string | undefined,
    changeIsLoading: (value: boolean) => void,
): [ChatType[], boolean, () => void] => {
    const key = useDebounced(input, 300);
    const [offset, setOffset] = useState<number>(0);
    const [chats, setChats] = useState<ChatType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isOnline = useAppSelector((state) => state.app.isOnline);

    const setToEnd = (payload: ChatType[]) => {
        if (!payload.length) return;

        const newMap = new Map<string, ChatType>();

        [...payload].reverse().forEach((chat) => newMap.set(chat.id, chat));

        localRawChats = new Map<string, ChatType>([...newMap, ...localRawChats]);
        const newArray = [...Array.from(localRawChats.values())].reverse();
        setChats(newArray);
    };

    const removeAll = () => {
        localRawChats = new Map<string, ChatType>();
        setChats([]);
    };

    const scrollBottom = () => {
        setOffset(offset + Envs.chats.limit);
    };

    useEffect(() => {
        setIsLoading(!!input?.length);
        if (input === key && isOnline) return setIsLoading(false);
        if (!input?.length) removeAll();
        globalKey = input;
    }, [input, isOnline]);

    useEffect(() => {
        if (chats.length < offset) return;
        if (!isOnline) return;
        if (!offset) return;

        getChats(key, offset).then(({ success, data }) => {
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

        getChats(key, 0).then(({ success, data }) => {
            if (key !== globalKey) return;
            setIsLoading(false);
            removeAll();

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
