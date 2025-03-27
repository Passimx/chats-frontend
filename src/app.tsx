import { FC, useEffect } from 'react';
import AppRouter from './root/routes/app-router.tsx';
import { store } from './root/store';
import { Provider } from 'react-redux';

const App: FC = () => {
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        console.log(window?.Telegram?.WebApp);
    }, []);

    return (
        <Provider store={store}>
            <AppRouter />
        </Provider>
    );
};

export default App;
