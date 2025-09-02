import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

export const Services: FC = () => {
    const { t } = useTranslation();

    return <div id={styles.background}>{t('services')}</div>;
};
