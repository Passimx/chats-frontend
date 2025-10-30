import { CryptoService } from '../../../services/crypto.service.ts';
import { useCallback, useEffect } from 'react';
import { WordsService } from '../../../services/words-service/words.service.ts';
import { RsaKeysStringType } from '../../../types/create-rsa-keys.type.ts';
import { useAppAction } from '../../../store';

export const useKeys = () => {
    const { setStateApp } = useAppAction();

    const generateKeys = useCallback(async () => {
        const words = WordsService.generate({ exactly: 24, maxLength: 10, minLength: 3 });
        const passphraseHash = WordsService.hashPassphrase(words);
        const passphrase = words.join('_');
        const keys = await CryptoService.generateExportRSAKeys();

        localStorage.setItem('passphrase', passphrase);
        localStorage.setItem('passphraseHash', passphraseHash);
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
