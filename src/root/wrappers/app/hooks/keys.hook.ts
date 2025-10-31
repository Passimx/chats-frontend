import { CryptoService } from '../../../../common/services/crypto.service.ts';
import { useCallback, useEffect } from 'react';
import { RsaKeysStringType } from '../../../types/create-rsa-keys.type.ts';
import { useAppAction } from '../../../store';

export const useKeys = () => {
    const { setStateApp } = useAppAction();

    const generateKeys = useCallback(async () => {
        const keys = await CryptoService.generateExportRSAKeys();
        localStorage.setItem('keys', JSON.stringify(keys));

        return keys;
    }, []);

    const checkKeys = useCallback(async () => {
        let RASKeysString: RsaKeysStringType;
        const payloadKeys = localStorage.getItem('keys');
        if (payloadKeys) RASKeysString = JSON.parse(payloadKeys) as RsaKeysStringType;
        else RASKeysString = await generateKeys();
        setStateApp({ RASKeysString });

        const RASKeys = await CryptoService.importRSAKeys(RASKeysString);
        setStateApp({ RASKeys });
    }, []);

    useEffect(() => {
        checkKeys();
    }, []);
};
