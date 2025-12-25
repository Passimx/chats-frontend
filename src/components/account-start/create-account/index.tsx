import { FC, memo, useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { useCreateUser } from '../hooks/create-user.hook.ts';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { mnemonicNew } from 'ton-crypto';
import { useAppAction } from '../../../root/store/index.ts';
import { EventsEnum } from '../../../root/types/events/events.enum.ts';

export const CreateAccount: FC = memo(() => {
    const [isLoading] = useCreateUser();
    const [words, setWords] = useState<string[]>([]);
    const { postMessageToBroadCastChannel } = useAppAction();

    const generateWords = useCallback(async () => {
        const result = await mnemonicNew(24);
        setWords(result);
    }, []);

    useEffect(() => {
        generateWords();
    }, []);

    const create = useCallback(async () => {
        if (!isLoading) {
            postMessageToBroadCastChannel({
                event: EventsEnum.CREATE_USER,
                data: { words: words, password: 'pass', name: 'Рамиль' },
            });
            return;
        }
    }, [words, isLoading]);

    return (
        <div className={styles.background}>
            <div className={styles.title}>Создание аккаунта</div>
            <div className={styles.main}>
                <div className={styles.center}>
                    <div>
                        <input className={styles.input} placeholder={'Ваше имя'} />
                    </div>
                    {isLoading ? (
                        <AiOutlineLoading3Quarters id={styles.loading_logo} className={styles.logo} size={100} />
                    ) : (
                        <div className={styles.words_background}>
                            {words.map((word, index) => (
                                <div key={index} className={styles.word_item}>
                                    <div>{index + 1}</div>
                                    <div>{word}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.button_background}>
                    <div className={styles.button} onClick={generateWords}>
                        Создать новую фразу
                    </div>
                    <div className={styles.button} onClick={create}>
                        {isLoading ? 'Отменить' : 'Создать аккаунт'}
                    </div>
                </div>
            </div>
        </div>
    );
});
