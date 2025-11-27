import { FC, memo } from 'react';
import styles from './index.module.css';
import { MenuTitle } from '../menu-title';
import { TbBackground } from 'react-icons/tb';

export const Appearance: FC = memo(() => {
    return (
        <div className={styles.background}>
            <MenuTitle icon={<TbBackground />} title={'appearance'} />
        </div>
    );
});
