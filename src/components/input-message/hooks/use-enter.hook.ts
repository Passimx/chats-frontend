import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '../index.module.css';
import { useAppAction, useAppSelector } from '../../../root/store';
import { ChatEnum } from '../../../root/types/chat/chat.enum.ts';
import { useTranslation } from 'react-i18next';
import { createMessage } from '../../../root/api/messages';
import { getRawChat } from '../../../root/store/chats/chats.raw.ts';
import { getIsFocused } from './get-is-focused.hook.ts';
import { UseEnterHookType } from '../types/use-enter-hook.type.ts';
import { focusToEnd } from '../common/focus-to-end.ts';
import moment from 'moment/min/moment-with-locales';
import { uploadFile } from '../../../root/api/files/file.ts';
import { FileExtensionEnum, MimetypeEnum } from '../../../root/types/files/types.ts';
import { getAudioDurationFromBlob } from '../../../common/hooks/get-audio-duration-from-blob.hook.ts';
import { getAudioWaveform } from '../../../common/hooks/get-sound-bar.hook.ts';
import { getBetterVoice } from '../../../common/hooks/get-better-voice.hook.ts';

let mediaRecorder: MediaRecorder | undefined;
let chunks: Blob[] = [];
let isDeleteVoiceMessage: boolean = false;

export const useEnterHook = (): UseEnterHookType => {
    const { t } = useTranslation();
    const [textExist, setTextExist] = useState<boolean>(true);
    const [recoveringTime, setRecoveringTime] = useState<string>();
    const { update, setChatOnPage } = useAppAction();
    const [isRecovering, setIsRecovering] = useState<boolean>(false);
    const [isShowPlaceholder, setIsShowPlaceholder] = useState<boolean>(true);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { isPhone, isOpenMobileKeyboard, isStandalone } = useAppSelector((state) => state.app);

    const placeholder = useMemo((): string => {
        const text = chatOnPage?.type === ChatEnum.IS_SYSTEM ? 'chats_message_unavailable' : 'chats_enter_message';
        if (isRecovering) return `${t('recording')}: ${recoveringTime}`;
        return t(text);
    }, [chatOnPage?.type, t, isRecovering, recoveringTime]);

    useEffect(() => {
        const el = document.getElementById(styles.new_message);
        if (!el || !chatOnPage?.id) return;

        if (el.innerText !== chatOnPage?.inputMessage) {
            el.innerText = chatOnPage?.inputMessage ?? '';
            const isText = !!el.innerText.replace(/^\n+|\n+$/g, '').trim()?.length;
            setTextExist(isText);
            setIsShowPlaceholder(!chatOnPage?.inputMessage?.length);
        }
    }, [chatOnPage?.inputMessage]);

    useEffect(() => {
        const deleteButton = document.getElementById(styles.button_microphone_delete)!;
        if (!isRecovering) return;

        deleteButton.classList.remove(styles.hide_recover_button);
        deleteButton.classList.add(styles.show_recover_button);

        let handler: NodeJS.Timeout;
        const startTime = Date.now();

        const updateTime = () => {
            const duration = moment.duration(Date.now() - startTime);

            const minutes = Math.floor(duration.asMinutes()); // минуты
            const seconds = duration.seconds(); // секунды (0-59)
            const milliseconds = Math.floor(duration.milliseconds() / 10); // сотые доли (0-99)

            setRecoveringTime(
                `${minutes}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(2, '0')}`,
            );
            handler = setTimeout(updateTime, 20);
        };

        updateTime();

        return () => {
            deleteButton.classList.remove(styles.show_recover_button);
            deleteButton.classList.add(styles.hide_recover_button);
            setRecoveringTime(undefined);
            clearTimeout(handler);
        };
    }, [isRecovering]);

    const save = async (chunks: Blob[]) => {
        const audioBlob = await getBetterVoice(new Blob(chunks, { type: MimetypeEnum.WAV }));

        const formData = new FormData();
        const originalName = 'recording.wav';
        formData.append('file', audioBlob, originalName);
        formData.append('chatId', chatOnPage!.id);

        const [response, duration, loudnessData] = await Promise.all([
            uploadFile(formData),
            getAudioDurationFromBlob(audioBlob),
            getAudioWaveform(audioBlob),
        ]);

        if (!response.success) return;

        if (getRawChat(chatOnPage?.id))
            update({ id: chatOnPage!.id, inputMessage: undefined, answerMessage: undefined });
        else setChatOnPage({ answerMessage: undefined });

        await createMessage({
            chatId: chatOnPage!.id,
            parentMessageId: chatOnPage?.answerMessage?.id,
            files: [
                {
                    originalName,
                    key: response.data.fileId,
                    size: audioBlob.size,
                    mimeType: MimetypeEnum.WAV,
                    fileType: FileExtensionEnum.IS_VOICE,
                    metadata: {
                        duration,
                        loudnessData,
                        previewId: response.data.previewId,
                    },
                },
            ],
        });
    };

    const onInput = useCallback(() => {
        const el = document.getElementById(styles.new_message)!;

        const isEmpty = ['', '\n'].includes(el.innerText);
        if (isEmpty) el.innerText = '';
        setIsShowPlaceholder(isEmpty);
        if (chatOnPage?.id) {
            const isText = !!el.innerText.replace(/^\n+|\n+$/g, '').trim()?.length;
            setTextExist(isText);

            update({ id: chatOnPage.id, inputMessage: isText ? el.innerText : undefined });
        }
    }, [chatOnPage?.id, textExist]);

    const sendMessage = useCallback(async () => {
        if (!chatOnPage?.id) return;
        const element = document.getElementById(styles.new_message)!;
        const isFocused = isPhone ? isOpenMobileKeyboard : getIsFocused();

        const text = element.innerText.replace(/^\n+|\n+$/g, '').trim();
        if (!text.length) return;

        await createMessage({ message: text, chatId: chatOnPage.id, parentMessageId: chatOnPage?.answerMessage?.id });

        element.innerText = '';
        if (isFocused) element.focus();
        setIsShowPlaceholder(true);
        setTextExist(false);

        if (getRawChat(chatOnPage.id)) update({ id: chatOnPage.id, inputMessage: undefined, answerMessage: undefined });
        else setChatOnPage({ answerMessage: undefined });
    }, [chatOnPage, isPhone, isOpenMobileKeyboard, chatOnPage?.answerMessage]);

    useEffect(() => {
        if (!chatOnPage?.id) return;

        const element = document.getElementById(styles.new_message)!;
        const text = getRawChat(chatOnPage.id)?.inputMessage;

        element.innerText = text ?? '';
        setIsShowPlaceholder(!text);
        setTextExist(!!text);

        if (isRecovering && mediaRecorder) {
            isDeleteVoiceMessage = true;
            mediaRecorder.stop();
        }

        // 300 - время анимации, иначе быстро отрабатывает анимация
        if (!isPhone) setTimeout(() => focusToEnd(element), 300);
    }, [chatOnPage?.id, isPhone]);

    useEffect(() => {
        if (!chatOnPage) return;
        const element = document.getElementById(styles.new_message)!;
        if (isRecovering) {
            element.removeAttribute('contentEditable');
        } else element.setAttribute('contentEditable', `${chatOnPage.type !== ChatEnum.IS_SYSTEM}`);
    }, [isRecovering, chatOnPage]);

    useEffect(() => {
        if (chatOnPage?.type === ChatEnum.IS_SYSTEM) return;
        const element = document.getElementById(styles.new_message)!;
        const background = document.getElementById(styles.background)!;
        const buttonStartRecover = document.getElementById(styles.microphone)!;
        // const sendMessageButton = document.getElementById(styles.button_input_block)!;
        const microphoneButton = document.getElementById(styles.button_microphone_block);
        const buttonMicrophoneDelete = document.getElementById(styles.button_microphone_delete);

        const preventDefault = (event: KeyboardEvent) => {
            if (event.code === 'Enter' && !isPhone && !event.shiftKey) event.preventDefault();
        };

        const send = (event: KeyboardEvent) => {
            if (event.code === 'Enter' && !isPhone && !event.shiftKey) sendMessage();
        };

        const paste = (event: ClipboardEvent) => {
            event.preventDefault(); // Отменяем стандартное поведение

            // Получаем текст из буфера обмена
            const pastedText = event.clipboardData?.getData('text');
            if (!pastedText?.length) return;

            setIsShowPlaceholder(false);

            // Получаем текущее выделение
            const selection = window.getSelection();
            if (!selection) return;
            if (selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            range.deleteContents(); // Удаляем выделенный текст (если есть)

            // Создаем текстовый узел и вставляем его
            const textNode = document.createTextNode(pastedText);
            range.insertNode(textNode);
            range.collapse(true);

            // Перемещаем курсор после вставленного текста
            range.setStartAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);

            if (chatOnPage?.id) {
                const isText = !!element.innerText.replace(/^\n+|\n+$/g, '').trim()?.length;
                setTextExist(isText);

                update({ id: chatOnPage.id, inputMessage: isText ? element.innerText : undefined });
            }
        };

        const mobileFocus = () => {
            background;
            // background.style.paddingBottom = '0px';
        };

        const mobileFocusOut = () => {
            // background.style.paddingBottom = 'env(safe-area-inset-bottom, 32px)';
        };

        const stopRecover = async () => {
            isDeleteVoiceMessage = true;
            if (mediaRecorder) mediaRecorder.stop();
        };

        const startRecover = async () => {
            if (isRecovering && mediaRecorder) {
                mediaRecorder.stop();
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            buttonStartRecover.classList.add(styles.recover_color);
            setIsRecovering(true);
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                if (stream) stream.getTracks().forEach((track) => track.stop());
                buttonStartRecover.classList.remove(styles.recover_color);
                setIsRecovering(false);
                if (!isDeleteVoiceMessage) save(chunks);
                isDeleteVoiceMessage = false;

                chunks = [];
            };

            // Запускаем запись
            mediaRecorder.start();
        };

        element.addEventListener('keypress', preventDefault);
        element.addEventListener('keyup', send);
        element.addEventListener('paste', paste);
        element.addEventListener('input', onInput);
        microphoneButton?.addEventListener('mousedown', startRecover);
        buttonMicrophoneDelete?.addEventListener('mousedown', stopRecover);
        if (isStandalone && isPhone) {
            element.addEventListener('focus', mobileFocus);
            element.addEventListener('focusout', mobileFocusOut);
            // sendMessageButton.addEventListener('touchend', sendMessage);
            // } else sendMessageButton.addEventListener('click', sendMessage);
        }
        return () => {
            element.removeEventListener('keypress', preventDefault);
            element.removeEventListener('keyup', send);
            element.removeEventListener('paste', paste);
            element.removeEventListener('input', onInput);
            microphoneButton?.removeEventListener('mousedown', startRecover);
            buttonMicrophoneDelete?.removeEventListener('mousedown', stopRecover);

            if (isStandalone && isPhone) {
                element.removeEventListener('focus', mobileFocus);
                element.removeEventListener('focusout', mobileFocusOut);
                // sendMessageButton.removeEventListener('touchend', sendMessage);
                // } else sendMessageButton.removeEventListener('click', sendMessage);
            }
        };
    }, [chatOnPage?.id, isPhone, sendMessage, isRecovering]);

    const setEmoji = useCallback(
        (emoji: string) => {
            if (isRecovering) return;
            const chatInput = document.getElementById(styles.new_message)!;
            const isFocused = isPhone ? isOpenMobileKeyboard : getIsFocused();

            setIsShowPlaceholder(false);
            const selection = window.getSelection()!;
            let range;

            // Проверяем, есть ли уже выделение (фокус внутри div)
            if (selection.rangeCount > 0 && chatInput.contains(selection.anchorNode)) {
                range = selection.getRangeAt(0);
            } else {
                // Если курсор не внутри div, создаём новый range в КОНЦЕ div
                if (isFocused) chatInput.focus();
                range = document.createRange();
                range.selectNodeContents(chatInput);
                range.collapse(false); // false делает курсор в конец
                selection.removeAllRanges();
                selection.addRange(range);
            }

            // Вставляем эмодзи в то место, где курсор
            const textNode = document.createTextNode(emoji);
            range.deleteContents();
            range.insertNode(textNode);

            // Перемещаем курсор за эмодзи, чтобы печатать дальше
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);

            if (isFocused)
                chatInput.focus(); // Поддерживаем фокус на div
            else chatInput.blur();
            onInput();
        },
        [chatOnPage?.id, isPhone, isOpenMobileKeyboard, isRecovering],
    );

    return [textExist, setEmoji, placeholder, isShowPlaceholder];
};
