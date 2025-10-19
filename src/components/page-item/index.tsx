import { FC, memo, useEffect, useState } from 'react';
import { PropsType } from './props/types.ts';
import { useAppSelector } from '../../root/store';
import styles from './index.module.css';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';

export const PageItem: FC<PropsType> = memo(({ children, name }) => {
    const { activeTab } = useAppSelector((state) => state.app);
    const [visible, setVisible] = useState<boolean>();
    const pages = useAppSelector((state) => state.app.pages?.get(name));

    useEffect(() => {
        if (name === activeTab || visible === true) setVisible(name === activeTab);
    }, [activeTab, visible]);

    return (
        <div className={`${setVisibilityCss(styles.show_slowly, styles.hide_slowly, visible)} ${styles.item}`}>
            {pages?.map((page, index) => ({ ...page, key: `${index}` }))}
            {children}
        </div>
    );
});
