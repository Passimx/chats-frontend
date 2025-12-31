import { FC, memo, useCallback, useEffect } from 'react';
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
import { IoArrowBack } from 'react-icons/io5';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';

export const Authorization: FC = memo(() => {
    const { t } = useTranslation();
    const { setStateApp } = useAppAction();
    const lang = useAppSelector((state) => state.app.settings?.lang);
    const pages = useAppSelector((state) => state.app.pages)?.get(TabEnum.AUTHORIZATION);

    const closePage = useCallback(() => {
        const element = document.getElementById(styles.page)!;
        element.scrollTo({ left: element.scrollLeft - element.clientWidth, behavior: 'smooth' });
    }, [pages]);

    const setPage = useCallback(
        (page: JSX.Element) => {
            pages?.push(page);
            if (pages) {
                console.log(pages.length);
                setStateApp({ pages: new Map<TabEnum, JSX.Element[]>([[TabEnum.AUTHORIZATION, pages]]) });
            }
        },
        [pages],
    );

    useEffect(() => {
        setStateApp({ pages: new Map<TabEnum, JSX.Element[]>([[TabEnum.AUTHORIZATION, [<AccountStart />]]]) });
    }, []);

    return (
        <div className={styles.background}>
            <div className={styles.main}>
                <div id={styles.page}>
                    <div
                        id={styles.arrow}
                        className={setVisibilityCss(styles.show, styles.hide, !!(pages?.length && pages?.length > 1))}
                        onClick={closePage}
                    >
                        <IoArrowBack size={20} />
                    </div>
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
                    <div className={styles.footer_item} onClick={() => setPage(<ChangeLanguage />)}>
                        <GrLanguage />
                        {t('language')}
                    </div>
                </div>
            </div>
        </div>
    );
});
