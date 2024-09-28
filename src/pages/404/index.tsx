import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation();

    return <>{t('page_not_found')}</>;
};

export default NotFound;
