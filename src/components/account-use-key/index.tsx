import { FC, memo, useEffect, useState } from 'react';
import styles from './index.module.css';
import { EditField } from '../edit-field';
import { useVerify } from './hooks/use-verify.hook.ts';

export const AccountUseKey: FC = memo(() => {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [keyFile, setKeyFile] = useState<File>();
    const [password, setPassword] = useState<string>('');
    useVerify(keyFile, password);

    useEffect(() => {
        const element = document.getElementById(styles.background);
        if (!element) return;
        element.addEventListener('dragover', (e) => {
            setIsDragOver(true);
            e.preventDefault();
        });
        element.addEventListener('dragleave', (e) => {
            setIsDragOver(false);
            e.preventDefault();
        });

        element.addEventListener('drop', (e) => {
            setIsDragOver(false);
            e.preventDefault();

            const files = e.dataTransfer?.files; // Список файлов с рабочего стола
            if (files?.length) setKeyFile(files[0]);
        });
    }, []);

    return (
        <div id={styles.background} className={styles.background}>
            <div className={styles.title}>Ввод ключа</div>
            <div className={styles.main} style={{ backgroundColor: isDragOver ? 'green' : undefined }}>
                <div className={styles.key_background}>
                    <div className={styles.key_main}></div>
                </div>
                <div className={styles.name_background}>
                    <div>Введите пароль</div>
                    <EditField blur={true} value={password} setValue={setPassword} />
                </div>
            </div>
        </div>
    );
});
