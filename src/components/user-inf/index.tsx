import styles from './index.module.css';
import { EditField } from '../edit-field';
import { MdQrCode2 } from 'react-icons/md';
import { QrCode } from '../qr-code';
import { memo, useCallback } from 'react';
import { useAppAction, useAppSelector } from '../../root/store';
import { useShortText } from '../../common/hooks/use-short-text.hook.ts';
import { updatePublicKey } from '../../root/api/keys';
import { Avatar } from '../avatar';

export const UserInf = memo(() => {
    const publicKeyHash = useAppSelector((state) => state.app.keyInf?.publicKeyHash);
    const { setStateApp, changeKeyInf } = useAppAction();
    const userName = useShortText(`@${publicKeyHash}`);
    const keyInfMetadata = useAppSelector((state) => state.app.keyInf?.metadata);

    const openQrCode = useCallback(() => {
        if (!publicKeyHash) return;
        setStateApp({
            page: <QrCode url={`${window.location.origin}/${publicKeyHash}`} text={publicKeyHash} />,
        });
    }, [publicKeyHash]);

    const changeName = async (name: string) => {
        const metadata = { ...(keyInfMetadata ?? {}), name };
        await updatePublicKey({ metadata });
        changeKeyInf({ metadata });
    };

    return (
        <div className={styles.background}>
            <div className={styles.main}>
                <div className={styles.avatar_background}>
                    <Avatar images={keyInfMetadata?.images} isClickable={true} />
                </div>
                <div className={styles.inf_background}>
                    <EditField value={keyInfMetadata?.name} setValue={(value) => changeName(value)} />
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
