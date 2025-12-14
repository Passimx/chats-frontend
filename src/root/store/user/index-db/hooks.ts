import rawChats from '../../raw/chats.raw.ts';
import { rawApp } from '../../app/app.raw.ts';
import { UserIndexDbType } from '../../../types/user/user-index-db.type.ts';

export const upsertAccountIndexDb = (payload: Partial<UserIndexDbType>, oldKey?: number) => {
    const IndexDb = rawChats.indexDb;
    if (!IndexDb) return; // только главная вкладка может делать операции с IndexDb
    if (!IndexDb || !rawApp.isMainTab) return; // только главная вкладка может делать операции с IndexDb

    const user = { ...payload };
    delete user.rsaPrivateKey;

    const tx = IndexDb.transaction(['accounts'], 'readwrite');
    const accountsStore = tx.objectStore('accounts');

    if (oldKey) accountsStore.delete(oldKey);
    accountsStore.put(user, user.key);
};
