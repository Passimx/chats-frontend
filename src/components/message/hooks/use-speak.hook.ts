import { useCallback, useState } from 'react';
import { getLanguageByText } from '../../../root/wrappers/app/hooks/translations/get-language-by-text.ts';

export const useSpeak = (visibleMessage: string) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeaking = () => {
        isSpeaking ? pauseSpeak() : speakAloud();
    };

    const speakAloud = useCallback(() => {
        if (!visibleMessage) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(visibleMessage);
        utterance.lang = getLanguageByText(visibleMessage);
        utterance.pitch = 1;
        utterance.rate = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
        //setIsSpeaking(true);
    }, []);

    const pauseSpeak = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    return { handleSpeaking, isSpeaking };
};
