import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { FC } from 'react';
import AppWrapper from '../wrappers/app';
import { Redirect } from '../../pages/redirect';
import { ChatContext } from '../../pages/chat/context/chat-context.tsx';
import { CreateDialogue } from '../../pages/create-dialogue';

const router = createBrowserRouter([
    {
        element: (
            <AppWrapper>
                <Outlet />
            </AppWrapper>
        ),
        children: [
            {
                path: 'create-dialogue/:recipientPublicKeyHash',
                element: <CreateDialogue />,
            },
            {
                path: ':id',
                element: <ChatContext />,
            },
            {
                path: '*',
                element: <Redirect />,
            },
        ],
    },
]);

const AppRouter: FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
