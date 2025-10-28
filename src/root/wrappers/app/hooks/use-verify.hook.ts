import { useEffect, useState } from 'react';
import { useAppAction, useAppSelector } from '../../../store';
import config from '../../../../../package.json';

function base64UrlToBuffer(base64url: string) {
    // заменяем символы и добавляем padding
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const str = atob(base64);
    const buffer = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) buffer[i] = str.charCodeAt(i);
    return buffer;
}

export const useVerify = () => {
    const { changeSettings } = useAppAction();
    const isCheckVerified = useAppSelector((state) => state.app.settings?.isCheckVerified);
    const verificationKey = useAppSelector((state) => state.app.settings?.verificationKey);
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);

    const [isVerified, setIsVerified] = useState<boolean>(false);

    const test = async () => {
        if (!('credentials' in navigator && 'get' in navigator.credentials)) return;

        if (!verificationKey) {
            // Регистрация
            const regOptions: CredentialCreationOptions = {
                publicKey: {
                    challenge: new Uint8Array(32),
                    rp: { name: config.name },
                    user: {
                        id: new Uint8Array(16),
                        name: 'noname',
                        displayName: 'noname',
                    },
                    pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
                    authenticatorSelection: { userVerification: 'required', authenticatorAttachment: 'platform' },
                },
            };
            const verificationKey = await navigator.credentials.create(regOptions);
            if (verificationKey) {
                changeSettings({ verificationKey: verificationKey.id });
                setIsVerified(true);
            }
        } else {
            const result = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32),
                    allowCredentials: [{ id: base64UrlToBuffer(verificationKey), type: 'public-key' }],
                    userVerification: 'required',
                },
            });

            if (result) setIsVerified(true);
        }
    };

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;
        if (isCheckVerified && !verificationKey) test();
    }, [verificationKey, isCheckVerified, isLoadedChatsFromIndexDb]);

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;
        if (!isCheckVerified) return setIsVerified(true);
        if (isVerified) return;
        test();
    }, [isVerified, isCheckVerified, isLoadedChatsFromIndexDb]);

    return [isVerified];
};
