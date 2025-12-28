import React, { useEffect } from 'react';
import styles from './index.module.css';

export const Animation1: React.FC = () => {
    useEffect(() => {
        const chars = '01';

        const spawnNumber = () => {
            const background = document.getElementById(styles.background);
            if (!background) return;

            const span = document.createElement('span');
            span.className = styles.fall_span;
            span.textContent = chars[Math.floor(Math.random() * chars.length)];
            span.style.left = Math.random() * 100 + '%';
            span.style.fontSize = 14 + Math.random() * 12 + 'px';
            span.style.animationDuration = 1 + Math.random() * 2 + 's';
            background.appendChild(span);

            const handleAnimationEnd = () => {
                span.remove();
            };
            span.addEventListener('animationend', handleAnimationEnd);
        };

        const interval: NodeJS.Timeout = setInterval(spawnNumber, 10);

        return () => {
            window.clearInterval(interval);
        };
    }, []);

    return <div id={styles.background} />;
};
