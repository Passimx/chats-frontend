import { FC } from 'react';
import styles from './index.module.css';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

const BackButton: FC = () => {
    const { t } = useTranslation();

    return (
        <div id={styles.back}>
            <IoArrowBackCircleOutline id={styles.back_icon} />
            <div className="text_translate">{t('back')}</div>
        </div>
    );
};
export default BackButton;
