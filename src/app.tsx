import { FC, useEffect } from 'react';
import AppRouter from './root/routes/app-router.tsx';
import { store } from './root/store';
import { Provider } from 'react-redux';

const App: FC = () => {
    useEffect(() => {
        window?.Telegram?.WebApp.expand();
    }, []);

    if (window.Telegram.WebApp?.initDataUnsafe?.user)
        return (
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );
};

export default App;
