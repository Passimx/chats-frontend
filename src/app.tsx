import { FC } from 'react';
import AppRouter from './root/routes/app-router.tsx';
import { store } from './root/store';
import { Provider } from 'react-redux';

const App: FC = () => {
    return (
        <Provider store={store}>
            <AppRouter />
        </Provider>
    );
};

export default App;
