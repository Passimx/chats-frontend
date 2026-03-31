import { FC } from 'react';
import AppRouter from './root/routes/app-router.tsx';
import { store } from './root/store';
import { Provider } from 'react-redux';
import { CallProvider } from './root/contexts/call';
import { IncomingCallBanner } from './components/incoming-call-banner';

const App: FC = () => {
    return (
        <Provider store={store}>
            <CallProvider>
                <IncomingCallBanner />
                <AppRouter />
            </CallProvider>
        </Provider>
    );
};

export default App;
