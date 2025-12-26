import React, { useEffect, useRef } from 'react';

export const Animation1: React.FC = () => {
    const hintRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chars = '01';

        const spawnNumber = () => {
            const hint = hintRef.current;
            if (!hint) return;

            const span = document.createElement('span');
            span.textContent = chars[Math.floor(Math.random() * chars.length)];
            span.style.left = Math.random() * 100 + '%';
            span.style.fontSize = 14 + Math.random() * 12 + 'px';
            span.style.animationDuration = 1 + Math.random() * 2 + 's';
            hint.appendChild(span);

            const handleAnimationEnd = () => {
                span.remove();
            };
            span.addEventListener('animationend', handleAnimationEnd);
        };

        const interval: NodeJS.Timeout = setInterval(spawnNumber, 100);

        return () => {
            window.clearInterval(interval);
        };
    }, []);

    return <div ref={hintRef} style={{ ...styles.hint }} />;
};

const styles: { [key: string]: React.CSSProperties } = {
    hint: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
};

// Добавим глобальные стили для анимации
const styleSheet = `
@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.7;
  }
  80% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(500px) rotate(360deg);
    opacity: 0;
  }
}
div span {
  position: absolute;
  top: -20px;
  color: #439fef;
  opacity: 0.7;
  pointer-events: none;
  will-change: transform, opacity;
  animation-name: fall;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
`;

// Вставляем стиль в head
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = styleSheet;
    document.head.appendChild(styleEl);
}
