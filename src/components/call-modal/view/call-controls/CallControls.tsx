import { FC, useContext } from 'react';
import { BiVideo, BiVideoOff, BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import { MdCallEnd } from 'react-icons/md';
import { CallContext } from '../../../../root/contexts/call';
import styles from './index.module.css';

type PropsType = {
    isMinimize: boolean;
    isFullScreenActive: boolean;
    setStateApp: any;
};

const CallControls: FC<PropsType> = ({ isMinimize, setStateApp, isFullScreenActive }) => {
    const context = useContext(CallContext);
    const { isMicrophoneOn, setIsMicrophoneOn, isCameraOn, setIsCameraOn, isCallActive, setIsCallActive } = context;

    return (
        <div
            className={styles.bg}
            data-fullscreen={(isFullScreenActive && 'active') || ''}
            data-minimize={(isMinimize && 'active') || ''}
        >
            <div className={styles.action_btn} onClick={() => setIsCameraOn(!isCameraOn)}>
                <button className={styles.btn}>
                    {(isCameraOn && <BiVideo size={25} />) || <BiVideoOff size={25} />}
                </button>
            </div>

            <div className={styles.action_btn} onClick={() => setIsMicrophoneOn(!isMicrophoneOn)}>
                <button className={styles.btn}>
                    {(isMicrophoneOn && <BiMicrophone size={25} />) || <BiMicrophoneOff size={25} />}
                </button>
            </div>

            <div
                className={styles.action_btn}
                onClick={() => {
                    if (!isCallActive) return;
                    setIsCallActive(false);
                    setStateApp({ page: undefined });
                }}
            >
                <button className={styles.btn}>
                    <MdCallEnd size={25} color="#FF595A" />
                </button>
            </div>
        </div>
    );
};

export default CallControls;
