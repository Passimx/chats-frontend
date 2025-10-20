import { FC, memo, useEffect } from 'react';

export const Open: FC = memo(() => {
    useEffect(() => {
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true; // iOS Safari special case

        const appUrl = window.location.origin; // например: https://myapp.com
        const tip = document.getElementById('tip');
        const button = document.getElementById('openAppBtn');

        // обработчик кнопки
        const openApp = () => {
            // если приложение уже установлено как PWA, просто переходим в него
            window.location.href = appUrl;
        };

        if (button) button.addEventListener('click', openApp);

        if (isStandalone) {
            // если запущено как PWA
            window.location.href = appUrl;
        } else {
            if (tip) {
                tip.innerHTML = `
                    Если у вас установлено приложение на главном экране, нажмите кнопку выше.
                    <br><br>
                    Если нет — нажмите <b>Поделиться → Добавить на экран «Домой»</b>.
                `;
            }
        }

        // убираем слушатель при размонтировании
        return () => {
            if (button) button.removeEventListener('click', openApp);
        };
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: 24 }}>
            <h1>Открой приложение</h1>
            <p>
                Нажмите кнопку ниже, чтобы открыть приложение <b>MyApp</b>.
            </p>
            <button id="openAppBtn">Открыть приложение</button>

            <div id="tip" style={{ marginTop: 24, color: '#666' }}></div>
        </div>
    );
});
