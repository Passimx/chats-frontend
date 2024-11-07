import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { FC } from 'react';
import AppWrapper from '../wrappers/app';
import Chat from '../../pages/chat';

const router = createBrowserRouter([
    {
        element: (
            <AppWrapper>
                <Outlet />
            </AppWrapper>
        ),
        children: [
            {
                path: ':id',
                element: <Chat />,
            },
            {
                path: '*',
                element: <></>,
            },
        ],
    },
]);

const AppRouter: FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
