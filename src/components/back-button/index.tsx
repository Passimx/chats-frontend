import { FC } from 'react';
import styles from './index.module.css';
import useSetPage from '../../root/store/app/hooks/use-set-page.ts';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

const BackButton: FC = () => {
    const setPage = useSetPage();
    const { t } = useTranslation();

    return (
        <div id={styles.back} onClick={() => setPage(null)}>
            <IoArrowBackCircleOutline id={styles.back_icon} />
            <div>{t('back')}</div>
        </div>
    );
};
export default BackButton;
