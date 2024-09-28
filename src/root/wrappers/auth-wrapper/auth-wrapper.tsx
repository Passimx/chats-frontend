import { FC, useEffect } from 'react';
import { useAppSelector } from '../../store';
import { useNavigate } from 'react-router-dom';

const AuthWrapper: FC<{ children: any; url: string }> = ({ children, url }) => {
    const { authToken } = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) navigate(`/${url}`);
    }, []);

    if (authToken) return children;
};

export default AuthWrapper;
