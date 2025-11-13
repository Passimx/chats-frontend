import { CryptoService } from '../../../../common/services/crypto.service.ts';
import { useCallback, useEffect } from 'react';
import { RsaKeysStringType } from '../../../types/create-rsa-keys.type.ts';
import { useAppAction } from '../../../store';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { keepPublicKey } from '../../../api/keys';

export const useKeys = () => {
    const { setStateApp } = useAppAction();

    const generateKeys = useCallback(async () => {
        const keys = await CryptoService.generateExportRSAKeys();
        const request = await keepPublicKey(keys.publicKey);

        if (!request.success) return undefined;

        localStorage.setItem('keys', JSON.stringify(keys));
        return keys;
    }, []);

    const checkKeys = useCallback(async () => {
        let RASKeysString: RsaKeysStringType | undefined;
        const payloadKeys = localStorage.getItem('keys');
        if (payloadKeys) RASKeysString = JSON.parse(payloadKeys) as RsaKeysStringType;
        else RASKeysString = await generateKeys();
        if (!RASKeysString) return;

        setStateApp({ RASKeysString });

        const RASKeys = await CryptoService.importRSAKeys(RASKeysString);
        Envs.RASKeys = RASKeys;
        setStateApp({ RASKeys });
    }, []);

    useEffect(() => {
        checkKeys();
    }, []);
};
