import styles from './index.module.css';
import { FC, memo, useCallback, cloneElement } from 'react';
import { PropsType } from './props.type.ts';
import { useTranslation } from 'react-i18next';
import { useAppAction, useAppSelector } from '../../root/store';

export const MenuTitle: FC<PropsType> = memo(({ icon, title }) => {
    const { t } = useTranslation();
    const { pages, activeTab } = useAppSelector((state) => state.app);
    const { setStateApp } = useAppAction();

    const back = useCallback(() => {
        const oldArray = pages.get(activeTab) || [];
        oldArray.pop();
        const newPages = new Map(pages);
        newPages.set(activeTab, oldArray);
        setStateApp({ pages: newPages });
    }, [pages, activeTab]);

    return (
        <div className={`${styles.background} text_translate`}>
            {!!pages.get(activeTab)?.length && (
                <div className={styles.back} onClick={back}>
                    ◀ {t('back')}
                </div>
            )}
            <div className={`${styles.title}`}>
                {cloneElement(icon, { size: 28 })} {t(title)}
            </div>
        </div>
    );
});
