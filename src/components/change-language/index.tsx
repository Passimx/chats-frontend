import { FC } from 'react';
import styles from './index.module.css';
import { useAppAction } from '../../root/store';

export const ChangeLanguage: FC = () => {
    const { setLang } = useAppAction();

    return (
        <div id={styles.background}>
            <div>
                <div onClick={() => setLang('ch')}>中文</div>
                <div onClick={() => setLang('en')}>English</div>
                <div onClick={() => setLang('ar')}>العربية</div>
                <div onClick={() => setLang('es')}>Español</div>
                <div onClick={() => setLang('ru')}>Русский</div>
            </div>
        </div>
    );
};
