import { UserActions, UserReducers } from './user/user.slice.ts';
import { bindActionCreators, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ChatReducers, ChatsActions } from './chats/chats.slice.ts';

export const store = configureStore({
    reducer: {
        user: UserReducers,
        chats: ChatReducers,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).prepend(),
});

type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const actions = {
    ...UserActions,
    ...ChatsActions,
};

export const useAppAction = () => {
    const dispatch = useDispatch<AppDispatch>();
    return bindActionCreators(actions, dispatch);
};
