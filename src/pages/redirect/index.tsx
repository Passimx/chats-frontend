import { FC, useEffect } from 'react';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';

export const Redirect: FC = () => {
    const navigate = useCustomNavigate();

    useEffect(() => navigate('/'), []);

    return <></>;
};
