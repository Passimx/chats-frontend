import { FC, memo, useEffect } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { MdOutlinePrivacyTip } from 'react-icons/md';
import { RiContractFill } from 'react-icons/ri';
import { FaGithub } from 'react-icons/fa';
import { TabEnum } from '../../root/store/app/types/state.type.ts';
import { GrLanguage } from 'react-icons/gr';
import { ChangeLanguage } from '../../components/change-language';
import { AccountStart } from '../../components/account-start';
import { NavigationItem } from './components/navigation-item';
import { useTranslation } from 'react-i18next';

export const Authorization: FC = memo(() => {
    const { t } = useTranslation();
    const { setStateApp } = useAppAction();
    const lang = useAppSelector((state) => state.app.settings?.lang);
    const pages = useAppSelector((state) => state.app.pages)?.get(TabEnum.AUTHORIZATION);

    useEffect(() => {
        setStateApp({ pages: new Map<TabEnum, JSX.Element[]>([[TabEnum.AUTHORIZATION, [<AccountStart />]]]) });
    }, []);

    return (
        <div className={styles.background}>
            <div className={styles.main}>
                <div className={styles.page}>
                    {pages?.map((page, index) => (
                        <NavigationItem key={index} index={index}>
                            {page}
                        </NavigationItem>
                    ))}
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.footer_block}>
                    <div className={styles.footer_item} onClick={() => window.open('https:github.com/Passimx')}>
                        <FaGithub />
                        Github
                    </div>
                    <div className={styles.footer_item} onClick={() => window.open(`/info/${lang}/terms.html`)}>
                        <RiContractFill />
                        {t('terms_of_use')}
                    </div>
                    <div className={styles.footer_item} onClick={() => window.open(`/info/${lang}/privacy.html`)}>
                        <MdOutlinePrivacyTip />
                        {t('privacy_policy_1')}
                    </div>
                    <div className={styles.footer_item} onClick={() => setStateApp({ page: <ChangeLanguage /> })}>
                        <GrLanguage />
                        {t('language')}
                    </div>
                </div>
            </div>
        </div>
    );
});
