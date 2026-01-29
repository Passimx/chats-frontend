import { Api, IData } from '../index.ts';
import { UserFromServerMe } from '../../types/users/user-from-server-me.type.ts';
import { GetUserType } from '../../types/users/get-user.type.ts';
import { UserGetMetType } from '../../types/users/user-get-met.type.ts';

export const updateUser = (body: Partial<UserFromServerMe>): Promise<IData<object>> => {
    return Api<object>('/users/update', { method: 'PATCH', body });
};

export const getUserByUserName = (userName: string): Promise<IData<GetUserType>> => {
    return Api<GetUserType>(`/users/${userName}`);
};

export const getUserMe = (body: Partial<UserFromServerMe>): Promise<IData<UserGetMetType>> => {
    return Api<UserGetMetType>('/users/me', { method: 'POST', body });
};
