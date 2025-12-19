import { useCallback, useEffect, useState } from 'react';
//import { getLanguageByText } from '../../../root/wrappers/app/hooks/translations/get-language-by-text.ts';
import { useTranslation } from 'react-i18next';

export const useSpeak = (message: string) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { i18n } = useTranslation();

    const handleSpeaking = () => {
        isSpeaking ? pauseSpeak() : speakAloud();
    };

    const speakAloud = useCallback(() => {
        if (!message) return;

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = i18n.language;
        utterance.pitch = 1;
        utterance.rate = 0.9;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [message, i18n.language]);

    const pauseSpeak = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    return { handleSpeaking, isSpeaking };
};
