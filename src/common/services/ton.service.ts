import { mnemonicToPrivateKey } from 'ton-crypto';
import TonWeb from 'tonweb';
import { Envs } from '../config/envs/envs.ts';

const isTest = Envs.environment === 'staging';

export class TonService {
    public static async getWalletAddressFromWords(words: string[]) {
        const { publicKey } = await mnemonicToPrivateKey(words);

        const connection = new TonWeb(
            new TonWeb.HttpProvider(`https://${isTest ? 'testnet.' : ''}toncenter.com/api/v2/jsonRPC`),
        );

        const walletClass = TonWeb.Wallets.all[isTest ? 'v3R2' : 'v4R2'];
        const wallet = new walletClass(connection.provider, { publicKey });
        const addressObj = await wallet.getAddress();
        return addressObj.toString(true, true, false, isTest);
    }
}
