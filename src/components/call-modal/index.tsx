import { FC, useState, useContext, useEffect, useRef } from 'react';
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
    const [producer, setProducer] = useState<any>(null);
    const { transport, isMicrophoneOn, setIsMicrophoneOn } = useContext(CallContext);
    const videoRef = useRef<any>(null);

    const publishVideo = async () => {
        if (!transport) return;
        console.log('transport', transport);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            const track = stream.getVideoTracks()[0];
            const producer = await transport.produce({
                track,
                encoding: [{ maxBitrate: 100000 }, { maxBitrate: 300000 }],
                codecOptions: { videoGoogleStartBitrate: 100 },
            });
            setProducer(producer);
            videoRef.current.srcObject = stream;
        } catch (err: unknown) {
            const error = err as Error;
            console.log(`Ошибка создания консюмера в call-modal ${error.message}`);
        }
    };

    useEffect(() => {
        publishVideo();

        return () => {
            if (producer) producer.close();
            if (transport) transport.close();
        };
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

            {(Boolean(videoRef.current.srcObject) && (
                <VideoPlayer srcObject={videoRef.current.srcObject} autoPlay muted />
            )) || (
                <div className={styles.avatar} data-minimize={(isMinimize && 'active') || ''}>
                    {chatOnPage && (
                        <Avatar
                            showIcon={[ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)}
                            isClickable={![ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)}
                        />
                    )}
                </div>
            )}

            <CallControls isMinimize={isMinimize} isFullScreenActive={isFullScreenActive} setStateApp={setStateApp} />
        </div>
    );
};

export default CallModal;
