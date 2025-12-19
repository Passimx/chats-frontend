import { MouseEvent, useCallback, useEffect, useRef } from 'react';

export const useSwipeBack = (back: (e: MouseEvent<unknown>) => void) => {
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const threshold = 50;

    const onTouchStart = useCallback((e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const onTouchEnd = useCallback(
        (e: TouchEvent) => {
            if (e.changedTouches && e.changedTouches.length > 0) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const deltaX = touchEndX - touchStartX.current;
                const deltaY = Math.abs(touchStartY.current - touchEndY);

                // Проверяем, что это горизонтальный свайп
                if (Math.abs(deltaX) > deltaY) {
                    if (deltaX > threshold) {
                        back({ stopPropagation: () => {} } as MouseEvent<unknown>);
                    }
                }
            }
        },
        [back],
    );

    useEffect(() => {
        const isMobile = window.innerWidth <= 600;

        if (isMobile) {
            window.addEventListener('touchstart', onTouchStart, { passive: true });
            window.addEventListener('touchend', onTouchEnd, { passive: true });

            return () => {
                window.removeEventListener('touchstart', onTouchStart);
                window.removeEventListener('touchend', onTouchEnd);
            };
        }
    }, [onTouchStart, onTouchEnd]);
};
