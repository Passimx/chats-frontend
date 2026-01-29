import { UserFromServerMe } from '../../types/users/user-from-server-me.type.ts';
import { Api, IData } from '../index.ts';
import { LoginType } from '../../types/users/login.type.ts';
import { LoginResponseType } from '../../types/users/login-response.type.ts';

export const generateUser = (body: Partial<UserFromServerMe>): Promise<IData<UserFromServerMe>> => {
    return Api<UserFromServerMe>('/auth/create', { method: 'POST', body });
};

export const login = (body: LoginType): Promise<IData<LoginResponseType>> => {
    return Api('/auth/login', { method: 'POST', body });
};

export const logout = () => {
    return Api('/auth/logout', { method: 'POST', body: {} });
};
