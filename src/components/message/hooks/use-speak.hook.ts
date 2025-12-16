import { useCallback, useState } from 'react';
import { getLanguageByText } from '../../../root/wrappers/app/hooks/translations/get-language-by-text.ts';

export const useSpeak = (message: string) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeaking = () => {
        isSpeaking ? pauseSpeak() : speakAloud();
    };

    const speakAloud = useCallback(() => {
        if (!message) return;

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = getLanguageByText(message);
        utterance.pitch = 1;
        utterance.rate = 0.9;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, []);

    const pauseSpeak = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    return { handleSpeaking, isSpeaking };
};
