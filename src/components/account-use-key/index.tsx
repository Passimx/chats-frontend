import { FC, memo, useEffect, useState } from 'react';
import styles from './index.module.css';
import { useVerify } from './hooks/use-verify.hook.ts';
import { getFilesWithMetadata } from '../../common/hooks/get-files-with-metadata.ts';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { EditField } from '../edit-field';

export const AccountUseKey: FC = memo(() => {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [keyFile, setKeyFile] = useState<File>();
    const [password, setPassword] = useState<string>('');
    const [isLoading, userData] = useVerify(keyFile, password);

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

    const getFiles = () => {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.value = '';
            input.type = 'file';
            input.multiple = true;

            document.body.appendChild(input);

            input.onchange = async (e: Event) => {
                const target = e.target as HTMLInputElement;
                const payload = target.files;
                if (!payload?.length) {
                    document.body.removeChild(input);
                    return resolve(false);
                }

                const files = await getFilesWithMetadata(Array.from(payload));
                document.body.removeChild(input);
                setKeyFile(files[0]);
                resolve(true);
            };

            setTimeout(() => {
                input.click();
            }, 0);
        });
    };

    return (
        <div id={styles.background} className={styles.background}>
            <div className={styles.title}>Ввод ключа</div>
            <div className={styles.main}>
                <div></div>
                {!userData && (
                    <div
                        className={styles.key_background}
                        style={{ backgroundColor: isDragOver ? '#006600' : undefined }}
                        onClick={getFiles}
                    >
                        <div className={styles.key_main}>
                            {isLoading && <AiOutlineLoading3Quarters id={styles.loading_logo} size={100} />}
                            {!userData && !isLoading && <div>Выбрать файл</div>}
                        </div>
                    </div>
                )}
                {userData && (
                    <div className={styles.name_background}>
                        <div>Введите пароль</div>
                        <EditField blur={true} value={password} setValue={setPassword} />
                    </div>
                )}
            </div>
        </div>
    );
});
