import { FC, useState, useContext, useEffect } from 'react';
import styles from './index.module.css';
import { Avatar } from '../avatar';
import { ChatEnum } from '../../root/types/chat/chat.enum';
import { useAppAction, useAppSelector } from '../../root/store';
import { CallContext } from '../../root/contexts/call';
import { VideoPlayer } from './view/video-player/video-player.tsx';
import ViewMode from './view/view-mode/view-mode.tsx';
import CallControls from './view/call-controls/CallControls.tsx';

const CallModal: FC = () => {
    const [isFullScreenActive, setIsFullScreenActive] = useState<boolean>(false);
    const [isMinimize, setMinimize] = useState(false);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { setStateApp } = useAppAction();
    const context = useContext(CallContext);

    const { createConnection, localStream, isMicrophoneOn, setIsMicrophoneOn, hangUp } = context;

    useEffect(() => {
        createConnection();
    }, []);

    return (
        <div
            className={styles.background}
            data-fullscreen={(isFullScreenActive && 'active') || ''}
            data-minimize={(isMinimize && 'active') || ''}
        >
            <ViewMode
                isFullScreenActive={isFullScreenActive}
                setIsFullScreenActive={setIsFullScreenActive}
                isMinimize={isMinimize}
                setMinimize={setMinimize}
                isMicrophoneOn={isMicrophoneOn}
                setIsMicrophoneOn={setIsMicrophoneOn}
                setStateApp={setStateApp}
            />

            {(Boolean(localStream) && <VideoPlayer srcObject={localStream} autoPlay muted />) || (
                <div className={styles.avatar} data-minimize={(isMinimize && 'active') || ''}>
                    {chatOnPage && (
                        <Avatar
                            showIcon={[ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)}
                            isClickable={![ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)}
                        />
                    )}
                </div>
            )}

            <CallControls
                isMinimize={isMinimize}
                isFullScreenActive={isFullScreenActive}
                setStateApp={setStateApp}
                hangUp={hangUp}
            />
        </div>
    );
};

export default CallModal;
