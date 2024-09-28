import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { FC } from 'react';
import NotFound from '../../pages/404';
import AppWrapper from '../wrappers/app';

const router = createBrowserRouter([
    {
        element: <Outlet />,
        children: [
            // {
            //     path: '/',
            //     element: (
            //         <AuthWrapper url={'search'}>
            //             <Chats />
            //         </AuthWrapper>
            //     ),
            // },
            // {
            //     path: '/chats',
            //     element: (
            //         <AuthWrapper url={'auth'}>
            //             <Chats />
            //         </AuthWrapper>
            //     ),
            // },
            // {
            //     path: 'search',
            //     element: <Search />,
            // },
            {
                path: '*',
                element: <NotFound />,
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
