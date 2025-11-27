import { FC, memo, useCallback } from 'react';
import styles from './index.module.css';
import { MenuTitle } from '../menu-title';
import { TbBackground } from 'react-icons/tb';
import { SegmentSwitcher } from '../segment-switcher';
import { OptionType } from '../segment-switcher/types.ts';
import { useAppAction, useAppSelector } from '../../root/store';

export const Appearance: FC = memo(() => {
    const zoom = useAppSelector((state) => state.app.settings?.zoom);
    const { changeSettings } = useAppAction();
    const options: OptionType[] = [
        ['1', 1],
        ['1.2', 1.2],
        ['1.4', 1.4],
        ['1.6', 1.6],
        ['1.8', 1.8],
        ['2', 2],
    ];

    const changeZoom = useCallback((zoom?: number) => {
        changeSettings({ zoom });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        document.body.style.zoom = zoom;
    }, []);

    return (
        <div className={styles.background}>
            <MenuTitle icon={<TbBackground />} title={'appearance'} />
            <div className={styles.cache_menu_item_select}>
                <SegmentSwitcher options={options} value={zoom} onChange={changeZoom} />
            </div>
        </div>
    );
});
