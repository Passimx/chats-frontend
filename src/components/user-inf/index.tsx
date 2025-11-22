import styles from './index.module.css';
import { EditField } from '../edit-field';
import { MdPhotoCamera, MdQrCode2 } from 'react-icons/md';
import { QrCode } from '../qr-code';
import { memo, useCallback } from 'react';
import { useAppAction, useAppSelector } from '../../root/store';
import { useShortText } from '../../common/hooks/use-short-text.hook.ts';
import { updatePublicKey } from '../../root/api/keys';

export const UserInf = memo(() => {
    const keyName = useAppSelector((state) => state.app.keyInf?.name);
    const publicKeyHash = useAppSelector((state) => state.app.keyInf?.publicKeyHash);
    const userName = useShortText(`@${publicKeyHash}`);

    // todo
    // const { openMedia } = useOpenMedia(() => {});
    const { setStateApp, changeKeyInf } = useAppAction();

    const openQrCode = useCallback(() => {
        if (!publicKeyHash) return;
        setStateApp({
            page: <QrCode url={`${window.location.origin}/${publicKeyHash}`} text={publicKeyHash} />,
        });
    }, [publicKeyHash]);

    const changeName = async (name: string) => {
        const response = await updatePublicKey({ name });
        if (!response.success) return;
        changeKeyInf({ name });
    };

    return (
        <div className={styles.background}>
            <div className={styles.main}>
                <div className={styles.avatar_background}>
                    <MdPhotoCamera className={styles.camera_icon} />
                </div>
                <div className={styles.inf_background}>
                    <EditField value={keyName} setValue={(value) => changeName(value)} />
                    <div className={styles.name_background}>
                        <div
                            className={styles.background_name}
                            onClick={() => navigator.clipboard.writeText(`@${publicKeyHash}`)}
                        >
                            {userName}
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
