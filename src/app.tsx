import { FC } from 'react';
import AppRouter from './root/routes/app-router.tsx';
import { store } from './root/store';
import { Provider } from 'react-redux';
import { CallProvider } from './root/contexts/call';

const App: FC = () => {
    return (
        <Provider store={store}>
            <CallProvider>
                <AppRouter />
            </CallProvider>
        </Provider>
    );
};

export default App;
