import useDebounced from '../../../common/hooks/use-debounced.ts';
import { useEffect, useState } from 'react';
import { getChats } from '../../../root/api/chats';
import { useAppAction, useAppSelector } from '../../../root/store';
import { Envs } from '../../../common/config/envs/envs.ts';

let globalKey: string | undefined = undefined;

const useChats = (input?: string): [boolean, () => void] => {
    const limit = Envs.chats.limit;
    const key = useDebounced(input, 300);
    const { setToEnd, removeAll } = useAppAction();
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
        if (!offset) return;

        getChats(key, limit, offset).then(({ success, data }) => {
            if (key !== globalKey) return;
            setIsLoading(false);

            if (success && data) setToEnd(data);
            else setToEnd([]);
        });
    }, [offset]);

    useEffect(() => {
        if (!isOnline) return;
        setOffset(0);
        removeAll();

        getChats(key, limit, 0).then(({ success, data }) => {
            if (key !== globalKey) return;
            setIsLoading(false);

            if (success && data) setToEnd(data);
            else setToEnd([]);
        });
    }, [key, isOnline]);

    return [isLoading, scrollBottom];
};

export default useChats;
