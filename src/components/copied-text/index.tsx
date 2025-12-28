import { FC, memo, useEffect, useState } from 'react';
import styles from './index.module.css';
import { IoCopyOutline } from 'react-icons/io5';
import { EventsEnum } from '../../root/types/events/events.enum.ts';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';
import { useTranslation } from 'react-i18next';
import { DataType } from '../../root/types/events/event-data.type.ts';

export const CopiedText: FC = memo(() => {
    const [data, setData] = useState<string>('');
    const [visible, setVisible] = useState<boolean>();
    const { t } = useTranslation();

    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout;
        const channel = new BroadcastChannel('ws-channel');

        channel.onmessage = ({ data }: MessageEvent<DataType>) => {
            if (data.event === EventsEnum.SHOW_TEXT) {
                clearTimeout(scrollTimeout);
                setVisible(true);
                setData(data.data);
                scrollTimeout = setTimeout(() => setVisible(false), 2000);
            }
        };

        return () => channel.close();
    }, []);

    return (
        <div className={`${styles.background} ${setVisibilityCss(styles.show, styles.hide, visible)}`}>
            <IoCopyOutline />
            <div>{t(data)}</div>
        </div>
    );
});
