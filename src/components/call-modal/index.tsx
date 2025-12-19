import { FC, useState } from 'react';
import { FaMinus } from 'react-icons/fa6';
import { BiFullscreen, BiVideo, BiVideoOff, BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import { MdCallEnd } from 'react-icons/md';
import styles from './index.module.css';
import { Avatar } from '../avatar';
import { ChatEnum } from '../../root/types/chat/chat.enum';
import { useAppAction, useAppSelector } from '../../root/store';

const CallModal: FC = () => {
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState<boolean>(true);
    const [isFullScreenActive, setIsFullScreenActive] = useState<boolean>(false);
    const [isMinimize, setMinimize] = useState<boolean>(false);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { setStateApp } = useAppAction();

    return (
        <div
            className={styles.background}
            data-fullscreen={(isFullScreenActive && 'active') || ''}
            data-minimize={(isMinimize && 'active') || ''}
        >
            <div className={styles.control_icons}>
                {isFullScreenActive ? (
                    <button
                        className={styles.fullscreen}
                        data-fullscreen={(isFullScreenActive && 'active') || ''}
                        onClick={() => {
                            setIsFullScreenActive(!isFullScreenActive);
                        }}
                    >
                        <FaCompressAlt size={22} />
                    </button>
                ) : isMinimize ? (
                    <div className={styles.minimize_block}>
                        <button className={styles.minimize_btn} onClick={() => setMinimize(false)}>
                            <FaExpandAlt size={22} />
                        </button>
                        <button className={styles.minimize_btn} onClick={() => setIsMicrophoneOn(!isMicrophoneOn)}>
                            {(isMicrophoneOn && <BiMicrophone size={25} />) || <BiMicrophoneOff size={25} />}
                        </button>
                        <button className={styles.minimize_btn} onClick={() => setStateApp({ page: undefined })}>
                            <MdCallEnd size={25} color="#FF595A" />
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            className={styles.minimize}
                            data-minimize={(isMinimize && 'active') || ''}
                            onClick={() => setMinimize(!isMinimize)}
                        >
                            <FaMinus size={18} />
                        </button>
                        <button
                            className={styles.fullscreen}
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
            <div className={styles.avatar} data-minimize={(isMinimize && 'active') || ''}>
                {chatOnPage && (
                    <Avatar
                        showIcon={[ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)}
                        isClickable={![ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)}
                    />
                )}
            </div>

            <div
                className={styles.call_controll}
                data-fullscreen={(isFullScreenActive && 'active') || ''}
                data-minimize={(isMinimize && 'active') || ''}
            >
                <div className={styles.call_block}>
                    <button className={styles.camera_toggle} onClick={() => setIsCameraOn(!isCameraOn)}>
                        {(isCameraOn && <BiVideo size={25} />) || <BiVideoOff size={25} />}
                    </button>
                </div>

                <div className={styles.call_block}>
                    <button className={styles.microphone_toggle} onClick={() => setIsMicrophoneOn(!isMicrophoneOn)}>
                        {(isMicrophoneOn && <BiMicrophone size={25} />) || <BiMicrophoneOff size={25} />}
                    </button>
                </div>

                <div className={styles.call_block}>
                    <button className={styles.decline} onClick={() => setStateApp({ page: undefined })}>
                        <MdCallEnd size={25} color="#FF595A" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallModal;
