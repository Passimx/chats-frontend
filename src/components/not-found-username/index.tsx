import { FC } from 'react';
import styles from './index.module.css';
import { useTranslation } from 'react-i18next';

export const NotFoundUsername: FC = () => {
    const { t } = useTranslation();

    return <div className={`${styles.background} text_translate`}>{t('no_chats')} </div>;
};
