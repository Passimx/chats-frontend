import { useCallback, useState } from 'react';
import { getLanguageByText } from '../../../root/wrappers/app/hooks/translations/get-language-by-text.ts';

export const useSpeak = (visibleMessage: string) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeaking = () => {
        isSpeaking ? stopSpeak() : speakAloud();
    };

    const speakAloud = useCallback(() => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(visibleMessage);
        utterance.lang = getLanguageByText(visibleMessage);
        utterance.pitch = 1;
        utterance.rate = 1;

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    }, []);

    const stopSpeak = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    return { handleSpeaking, isSpeaking };
};
