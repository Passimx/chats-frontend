import styles from './index.module.css';
import { EditField } from '../edit-field';
import { MdQrCode2 } from 'react-icons/md';
import { QrCode } from '../qr-code';
import { memo, useCallback } from 'react';
import { useAppAction, useAppSelector } from '../../root/store';
import { useShortText } from '../../common/hooks/use-short-text.hook.ts';
import { Avatar } from '../avatar';
import { EventsEnum } from '../../root/types/events/events.enum.ts';
import { updateUser } from '../../root/api/users';

export const UserInf = memo(() => {
    const name = useAppSelector((state) => state.user.name);
    const userName = useAppSelector((state) => state.user.userName);
    const shortUserName = useShortText(userName);
    const { setStateApp, postMessageToBroadCastChannel } = useAppAction();

    const openQrCode = useCallback(() => {
        if (!userName) return;
        setStateApp({
            page: <QrCode url={`${window.location.origin}/${userName}`} text={shortUserName} />,
        });
    }, [userName]);

    const changeName = async (newName: string) => {
        if (name === newName) return;
        await updateUser({ name: newName });
    };

    return (
        <div className={styles.background}>
            <div className={styles.main}>
                <div className={styles.avatar_background}>
                    <Avatar images={[]} isClickable={true} />
                </div>
                <div className={styles.inf_background}>
                    <EditField value={name} setValue={(value) => changeName(value)} />
                    <div className={styles.name_background}>
                        <div
                            className={styles.background_name}
                            onClick={() => {
                                userName && navigator.clipboard.writeText(`@${userName}`);
                                postMessageToBroadCastChannel({ event: EventsEnum.COPY_TEXT });
                            }}
                        >
                            @{shortUserName}
                        </div>
                        <div className={styles.copy_logo_background}>
                            <MdQrCode2 className={styles.copy_logo} onClick={openQrCode} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.buttons}></div>
        </div>
    );
});
