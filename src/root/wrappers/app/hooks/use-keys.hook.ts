import { CryptoService } from '../../../../common/services/crypto.service.ts';
import { useCallback, useEffect } from 'react';
import { useAppAction } from '../../../store';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { KeyInfType } from '../../../store/app/types/state.type.ts';
import { keepPublicKey } from '../../../api/keys';

export const useKeys = () => {
    const { setStateApp } = useAppAction();

    const generateKeys = useCallback(async () => {
        const keys = await CryptoService.generateExportRSAKeys();
        const publicKeyHash = CryptoService.getHash(keys.publicKey);
        const request = await keepPublicKey({ publicKey: keys.publicKey });
        if (!request.success) return undefined;

        const response = { ...keys, publicKeyHash, name: publicKeyHash };
        localStorage.setItem('keys', JSON.stringify(response));

        return response;
    }, []);

    const checkKeys = useCallback(async () => {
        let keyInf: KeyInfType | undefined;
        const payloadKeys = localStorage.getItem('keys');
        if (payloadKeys) keyInf = JSON.parse(payloadKeys) as KeyInfType;
        else keyInf = await generateKeys();
        if (!keyInf) return;

        const RASKeys = await CryptoService.importRSAKeys(keyInf);
        Envs.RASKeys = RASKeys;

        setStateApp({ keyInf: { ...keyInf, RASKeys } });
    }, []);

    useEffect(() => {
        checkKeys();
    }, []);
};
