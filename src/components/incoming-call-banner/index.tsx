import { FC, useContext } from 'react';
import { useAppSelector, useAppAction } from '../../root/store';
import { CallContext } from '../../root/contexts/call';
import { createRoom } from '../../root/api/calls';
import CallModal from '../call-modal';
import styles from './index.module.css';

export const IncomingCallBanner: FC = () => {
    const incomingCall = useAppSelector((state) => state.app.incomingCall);
    const userId = useAppSelector((state) => state.user.id);
    const { setStateApp } = useAppAction();
    const { setRouterRtpCapabilities, setRoomId } = useContext(CallContext);

    if (!incomingCall?.roomId) return null;

    const handleJoin = async () => {
        if (!userId) return;
        try {
            const result = await createRoom(incomingCall.roomId, userId);
            if (!result.success) {
                console.error('Failed to join call:', result.data);
                setStateApp({ incomingCall: null });
                return;
            }
            setRoomId(incomingCall.roomId);
            setRouterRtpCapabilities(result.data.routerRtpCapabilities);
            setStateApp({ page: <CallModal />, incomingCall: null });
        } catch (e) {
            console.error('Error joining call:', e);
            setStateApp({ incomingCall: null });
        }
    };

    const handleDecline = () => {
        setStateApp({ incomingCall: null });
    };

    return (
        <div className={styles.banner}>
            <span className={styles.text}>Входящий видеозвонок</span>
            <div className={styles.actions}>
                <button type="button" className={`${styles.btn} ${styles.btnDecline}`} onClick={handleDecline}>
                    Отклонить
                </button>
                <button type="button" className={`${styles.btn} ${styles.btnJoin}`} onClick={handleJoin}>
                    Присоединиться
                </button>
            </div>
        </div>
    );
};
