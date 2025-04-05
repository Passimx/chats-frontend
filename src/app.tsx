import { FC, useEffect } from 'react';
import AppRouter from './root/routes/app-router.tsx';
import { store } from './root/store';
import { Provider } from 'react-redux';

const App: FC = () => {
    // При монтировании
    useEffect(() => {
        const prevScroll = window.scrollY;

        const lockScroll = () => {
            document.body.style.position = 'fixed';
            document.body.style.top = `-${prevScroll}px`;
            document.body.style.width = '100%';
        };

        const unlockScroll = () => {
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, prevScroll);
        };

        window.addEventListener('focusin', lockScroll); // iOS Safari когда клавиатура появляется
        window.addEventListener('focusout', unlockScroll); // когда скрывается

        return () => {
            window.removeEventListener('focusin', lockScroll);
            window.removeEventListener('focusout', unlockScroll);
        };
    }, []);

    return (
        <Provider store={store}>
            <AppRouter />
        </Provider>
    );
};

export default App;
