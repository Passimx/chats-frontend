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

export const Authorization: FC = memo(() => {
    const { setStateApp } = useAppAction();
    const lang = useAppSelector((state) => state.app.settings?.lang);
    const pages = useAppSelector((state) => state.app.pages)?.get(TabEnum.AUTHORIZATION);

    useEffect(() => {
        setStateApp({ pages: new Map<TabEnum, React.JSX.Element[]>([[TabEnum.AUTHORIZATION, [<AccountStart />]]]) });
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
                        Условия использования
                    </div>
                    <div className={styles.footer_item} onClick={() => window.open(`/info/${lang}/privacy.html`)}>
                        <MdOutlinePrivacyTip />
                        Политика конфиденциальности
                    </div>
                    <div className={styles.footer_item} onClick={() => setStateApp({ page: <ChangeLanguage /> })}>
                        <GrLanguage />
                        Язык
                    </div>
                </div>
            </div>
        </div>
    );
});
