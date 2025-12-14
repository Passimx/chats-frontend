import { Api, IData } from '../index.ts';
import { UserFromServerMe } from '../../types/users/user-from-server-me.type.ts';
import { UserGetMetType } from '../../types/users/user-get-met.type.ts';
import { GetUserType } from '../../types/users/get-user.type.ts';

export const generateUser = async (body: Partial<UserFromServerMe>): Promise<IData<UserFromServerMe>> => {
    return Api<UserFromServerMe>('/users/create', { method: 'POST', body });
};

export const getUserMe = (body: Partial<UserFromServerMe>): Promise<IData<UserGetMetType>> => {
    return Api<UserGetMetType>('/users/me', { method: 'POST', body });
};

export const updateUser = (body: Partial<UserFromServerMe>): Promise<IData<object>> => {
    return Api<object>('/users/update', { method: 'PATCH', body });
};

export const getUserByUserName = (userName: string): Promise<IData<GetUserType>> => {
    return Api<GetUserType>(`/users/${userName}`);
};
