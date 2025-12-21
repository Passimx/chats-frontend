import { FC, memo, useEffect } from 'react';
import styles from './index.module.css';
import { CryptoService } from '../../common/services/crypto.service.ts';

export const AccountUseKey: FC = memo(() => {
    // localStorage.setItem('keys', JSON.stringify({ publicKey: publicKeyString, privateKey: privateKeyString }));
    // const { setStateUser } = useAppAction();
    // Envs.RSAKeys = rsaKeysPair;
    // setStateUser({
    //     key: Date.now(),
    //     aesKey,
    //     id: data.id,
    //     name: data.name,
    //     seedPhraseHash,
    //     userName: data.userName,
    //     rsaPublicKey: rsaKeysPair.publicKey,
    //     rsaPrivateKey: rsaKeysPair.privateKey,
    //     encryptedRsaPrivateKey,
    // });

    useEffect(() => {
        const element = document.getElementById(styles.background);
        if (!element) return;
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();

            const files = e.dataTransfer?.files; // Список файлов с рабочего стола
            if (files?.length) {
                const file = files[0];

                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = (e) => {
                    try {
                        const content = e.target?.result;
                        if (typeof content !== 'string' || !content) return;

                        const allWords = content.split('\n');
                        const hash = allWords.pop();
                        const [userId, ...words] = allWords;

                        const str = `${userId}\n${words.join('\n')}`;
                        const strHash = CryptoService.getHash(str);
                        if (strHash !== hash) return;
                    } catch (err) {
                        console.error('Ошибка при чтении ключа:', err);
                    }
                };
            }
        });
    }, []);

    return (
        <div id={styles.background} className={styles.background}>
            <div className={styles.title}>Ввод ключа</div>
            <div className={styles.main}>
                <div>sdf</div>
            </div>
        </div>
    );
});
