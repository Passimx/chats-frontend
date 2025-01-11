import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Redirect: FC = () => {
    const navigate = useNavigate();

    useEffect(() => navigate('/'), []);

    return <></>;
};
