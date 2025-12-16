import { FC, memo, ReactElement } from 'react';
import { useAppSelector } from '../../root/store';
import { Authorization } from '../../modules/authorization';

export const StartPage: FC<{ children: ReactElement[] }> = memo(({ children }) => {
    const isLoadedChatsFromIndexDb = useAppSelector((state) => state.app.isLoadedChatsFromIndexDb);
    const id = useAppSelector((state) => state.user.id);

    if (!isLoadedChatsFromIndexDb) return;
    if (id) return children;
    return <Authorization />;
});
