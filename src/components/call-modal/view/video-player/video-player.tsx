import React, { useEffect, useRef } from 'react';
import styles from './index.module.css';

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    srcObject?: MediaStream | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ srcObject, ...rest }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && srcObject) {
            // Присваиваем MediaStream свойству srcObject нативного DOM-элемента
            videoRef.current.srcObject = srcObject;
        }
    }, [srcObject]);

    return <video className={styles.bg} ref={videoRef} {...rest} />;
};
