import { FC, useEffect } from 'react';
import AppRouter from './root/routes/app-router.tsx';
import { store } from './root/store';
import { Provider } from 'react-redux';

const App: FC = () => {
    useEffect(() => {
        // Установка бейджа (например, после получения пуша или проверки непрочитанных)
        if ('setAppBadge' in navigator && window.matchMedia('(display-mode: standalone)').matches) {
            navigator.setAppBadge(7);
        }
    }, []);

    return (
        <Provider store={store}>
            <AppRouter />
        </Provider>
    );
};

export default App;
