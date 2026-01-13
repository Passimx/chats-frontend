import { FC, memo, useCallback, useState } from 'react';
import styles from './index.module.css';
import { useTranslation } from 'react-i18next';
import { useAppAction, useAppSelector } from '../../root/store';
import { TabEnum } from '../../root/store/app/types/state.type.ts';
import { AccountUseKey } from '../account-use-key';
import { PropsType } from './types.ts';
import { CryptoService } from '../../common/services/crypto.service.ts';

export const AccountKey: FC<PropsType> = memo(({ data }) => {
    const { t } = useTranslation();
    const { setStateApp } = useAppAction();
    const pages = useAppSelector((state) => state.app.pages)?.get(TabEnum.AUTHORIZATION);
    const [isActiveButton, setIsActiveButton] = useState<boolean>(false);

    const downloadAccountKey = useCallback(async () => {
        const { userId, words } = data;
        const keyPair = await CryptoService.generateEd25519Key();

        const publicKeyEd25519 = await CryptoService.exportKey(keyPair.publicKey);
        const payload = [userId, ...words].join(' ');
        const signature = await crypto.subtle.sign('Ed25519', keyPair.privateKey, new TextEncoder().encode(payload));

        const encodedKey = btoa(publicKeyEd25519);
        const encodedPayload = btoa(payload);
        const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
        const fileData = `${encodedKey}.${encodedPayload}.${encodedSignature}`;

        const blob = new Blob([fileData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.href = url;
        link.download = `${userId}.key`;
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsActiveButton(true);
    }, [data]);

    const accountUseKey = useCallback(() => {
        pages?.push(<AccountUseKey />);
        if (pages) setStateApp({ pages: new Map<TabEnum, JSX.Element[]>([[TabEnum.AUTHORIZATION, pages]]) });
    }, [pages]);

    return (
        <div className={styles.background}>
            <div className={styles.title}>Ключ входа</div>
            <div className={styles.main}>
                <div className={styles.inf}>
                    <div></div>
                </div>
                <div className={styles.button_background}>
                    <div className={`${styles.button}`} onClick={downloadAccountKey}>
                        Скачать ключ входа
                    </div>
                    <div
                        className={`${styles.button} ${!isActiveButton && styles.non_active}`}
                        onClick={() => isActiveButton && accountUseKey()}
                    >
                        {t('log_in_with_a_key')}
                    </div>
                </div>
            </div>
        </div>
    );
});
