import { UserIndexDbType } from '../../root/types/users/user-index-db.type.ts';
import { CryptoService } from '../services/crypto.service.ts';
import { Envs } from '../config/envs/envs.ts';
import { SessionFromServerType } from '../../root/types/sessions/session-from-server.type.ts';

export const prepareUser = async (payload: UserIndexDbType): Promise<Partial<UserIndexDbType>> => {
    if (payload.sessions?.length && Envs.RSAKeys?.privateKey) {
        const sessions = [];
        const response = payload.sessions as unknown as SessionFromServerType[];

        for (const session of response) {
            const { encryptionUserAgent, ...data } = session;
            const userAgent = await CryptoService.decryptByRSAKey(Envs.RSAKeys?.privateKey, encryptionUserAgent);

            if (userAgent) sessions.push({ ...data, userAgent });
        }

        payload.sessions = sessions;
    }

    return payload;
};
