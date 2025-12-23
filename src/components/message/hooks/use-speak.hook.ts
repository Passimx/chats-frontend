import { useCallback, useEffect, useState } from 'react';
import { getLanguageByText } from '../../../root/wrappers/app/hooks/translations/get-language-by-text.ts';
import { useTranslation } from 'react-i18next';
import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';
import { useAppSelector } from '../../../root/store';

export const useSpeak = (message: string, type: string) => {
    const { i18n } = useTranslation();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const lang = useAppSelector((state) => state.app.settings?.lang);

    const handleSpeaking = () => {
        isSpeaking ? pauseSpeak() : speakAloud();
    };

    const speakAloud = useCallback(() => {
        if (!message) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(message);

        if (type == MessageTypeEnum.IS_CREATED_CHAT) {
            utterance.lang = i18n.language;
        } else {
            utterance.lang = getLanguageByText(message, lang);
        }
        utterance.pitch = 1;
        utterance.rate = 0.9;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [message, lang]);

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
