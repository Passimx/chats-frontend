import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { FC } from 'react';
import AppWrapper from '../wrappers/app';

const router = createBrowserRouter([
    {
        element: <Outlet />,
        children: [
            {
                path: '*',
                element: <></>,
            },
        ],
    },
]);

const AppRouter: FC = () => {
    return (
        <AppWrapper>
            <RouterProvider router={router} />
        </AppWrapper>
    );
};

export default AppRouter;
