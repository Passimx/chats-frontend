import { FC } from 'react';
import styles from './index.module.css';
import useSetPageHook from '../../root/store/app/hooks/use-set-page.hook.ts';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

const BackButton: FC = () => {
    const setPage = useSetPageHook();
    const { t } = useTranslation();

    return (
        <div id={styles.back} onClick={() => setPage(null)}>
            <IoArrowBackCircleOutline id={styles.back_icon} />
            <div className="text_translate">{t('back')}</div>
        </div>
    );
};
export default BackButton;
