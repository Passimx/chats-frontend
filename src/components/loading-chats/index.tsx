import styles from './index.module.css';
import { useTranslation } from 'react-i18next';

const LoadingChats = () => {
    const { t } = useTranslation();
    return <div id={styles.background}>{t('search_chats')}</div>;
};

export default LoadingChats;
