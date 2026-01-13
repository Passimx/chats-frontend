import { FC } from 'react';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import { BiFullscreen, BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import { MdCallEnd } from 'react-icons/md';
import { FaMinus } from 'react-icons/fa6';
import styles from './index.module.css';

type PropsType = {
    isFullScreenActive: boolean;
    setIsFullScreenActive: (value: boolean) => void;
    isMinimize: boolean;
    setMinimize: (value: boolean) => void;
    isMicrophoneOn: boolean;
    setIsMicrophoneOn: (value: boolean) => void;
    setStateApp: any;
};

const ViewMode: FC<PropsType> = ({
    isFullScreenActive,
    setIsFullScreenActive,
    setMinimize,
    isMinimize,
    isMicrophoneOn,
    setIsMicrophoneOn,
    setStateApp,
}) => {
    return (
        <div className={styles.bg}>
            {isFullScreenActive ? (
                <button
                    className={styles.btn}
                    data-fullscreen={(isFullScreenActive && 'active') || ''}
                    onClick={() => {
                        setIsFullScreenActive(!isFullScreenActive);
                    }}
                >
                    <FaCompressAlt size={22} />
                </button>
            ) : isMinimize ? (
                <div>
                    <button className={styles.btn} onClick={() => setMinimize(false)}>
                        <FaExpandAlt size={22} />
                    </button>
                    <button className={styles.btn} onClick={() => setIsMicrophoneOn(!isMicrophoneOn)}>
                        {(isMicrophoneOn && <BiMicrophone size={25} />) || <BiMicrophoneOff size={25} />}
                    </button>
                    <button className={styles.btn} onClick={() => setStateApp({ page: undefined })}>
                        <MdCallEnd size={25} color="#FF595A" />
                    </button>
                </div>
            ) : (
                <>
                    <button
                        className={styles.btn}
                        data-minimize={(isMinimize && 'active') || ''}
                        onClick={() => setMinimize(!isMinimize)}
                    >
                        <FaMinus size={18} />
                    </button>
                    <button
                        className={styles.btn}
                        data-fullscreen={(isFullScreenActive && 'active') || ''}
                        onClick={() => {
                            setIsFullScreenActive(!isFullScreenActive);
                        }}
                    >
                        <BiFullscreen size={22} />
                    </button>
                </>
            )}
        </div>
    );
};

export default ViewMode;
