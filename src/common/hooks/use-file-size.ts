import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useFileSize = (value?: number): string => {
    const { t } = useTranslation();

    const [size, setSize] = useState<string>('0 ');

    useEffect(() => {
        if (!value) return setSize(`0 ${t('kb')}`);
        if (value < 1024) return setSize(`${value.toFixed(0)}${t('b')}`);
        value /= 1024;
        if (value < 1024) return setSize(`${value.toFixed(0)}${t('kb')}`);
        value /= 1024;
        if (value < 1024) return setSize(`${value.toFixed(1)}${t('mb')}`);
        value /= 1024;
        if (value < 1024) return setSize(`${value.toFixed(2)}${t('gb')}`);
    }, [value, t]);

    return size;
};
