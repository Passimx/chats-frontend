import { JSX } from 'react';

export type StateType = {
    isOnline: boolean;
    isOpenPage: boolean;
    page?: JSX.Element;
    socketId?: string;
    isListening?: boolean;
    isLoadedChatsFromIndexDb?: boolean;
    isPhone?: boolean;
    isSystemChat?: boolean;
    lang?: string;
    isOpenMobileKeyboard?: boolean;
};
