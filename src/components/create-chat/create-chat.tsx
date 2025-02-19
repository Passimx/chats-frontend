import { FC, useMemo, useState } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { useTranslation } from 'react-i18next';
import Input from '../input';
import { FormProvider, useForm } from 'react-hook-form';
import { FormType } from './types/form.type.ts';
import Button from '../button';
import { ButtonEnum } from '../button/types/button.enum.ts';
import { createChat } from '../../root/api/chats';
import useSetPageHook from '../../root/store/app/hooks/use-set-page.hook.ts';

const CreateChat: FC<PropsType> = ({ title: titleChatType, icon }) => {
    const { t } = useTranslation();
    const methods = useForm<FormType>();
    const { handleSubmit, register } = methods;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const regex = useMemo(
        () => /^(?![-. ])(?!.*[.-]{2})[A-Za-zА-Яа-яЁё\d]*(?:[ .-][A-Za-zА-Яа-яЁё\d]+)*[A-Za-zА-Яа-яЁё\d]$/,
        [],
    );
    const setPage = useSetPageHook();

    const onSubmit = async (data: FormType) => {
        if (isLoading) return;
        setIsLoading(true);
        await createChat(data).finally(() => setPage(null));
    };

    return (
        <div id={styles.background}>
            <div className={styles.title_block}>
                {icon}
                <div className={styles.title}>{t(titleChatType)}</div>
            </div>
            <div id={styles.form}>
                <FormProvider {...methods}>
                    <form id={styles.form} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.input}>
                            <Input
                                placeholder={t('placeholder_chat_title')}
                                register={register('title', {
                                    required: t('required_field'),
                                    minLength: { value: 3, message: `${t('min_length')}: 3` },
                                    maxLength: { value: 256, message: `${t('max_length')}: 256` },
                                    pattern: {
                                        value: regex,
                                        message: t('invalid_title_chat'),
                                    },
                                })}
                            />
                        </div>
                        <div className={styles.input}>
                            <Button value={t('button_create_chat')} styleType={ButtonEnum.BLUE} />
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default CreateChat;
