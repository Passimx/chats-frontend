import { FC, useEffect } from 'react';
import { useAppSelector } from '../../store';
import { useNavigate } from 'react-router-dom';
import { PropsType } from './types/props.type.ts';

const AuthWrapper: FC<PropsType> = ({ children, url }) => {
    const { authToken } = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) navigate(`/${url}`, { replace: true });
    }, []);

    if (authToken) return children;
};

export default AuthWrapper;
