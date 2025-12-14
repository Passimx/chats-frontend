import TonWeb from 'tonweb';
import { Envs } from '../../../common/config/envs/envs.ts';

export const getBalance = async (addressStr: string): Promise<number> => {
    const isTest = Envs.environment === 'staging';
    const connection = new TonWeb(
        new TonWeb.HttpProvider(`https://${isTest ? 'testnet.' : ''}toncenter.com/api/v2/jsonRPC`),
    );
    const balanceNano = await connection.getBalance(addressStr);
    return Number(balanceNano) / 1e9;
};
