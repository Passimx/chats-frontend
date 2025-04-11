import { FC, useEffect } from 'react';
import { useAppSelector } from '../../store';
import { PropsType } from './types/props.type.ts';
import { useCustomNavigate } from '../../../common/hooks/use-custom-navigate.hook.ts';

const AuthWrapper: FC<PropsType> = ({ children, url }) => {
    const { authToken } = useAppSelector((state) => state.user);
    const navigate = useCustomNavigate();

    useEffect(() => {
        if (!authToken) navigate(`/${url}`);
    }, []);

    if (authToken) return children;
};

export default AuthWrapper;
