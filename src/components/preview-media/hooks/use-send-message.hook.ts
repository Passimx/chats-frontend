import styles from '../index.module.css';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useAppAction, useAppSelector } from '../../../root/store';
import { ContextMedia } from '../../preview-media-context';
import { uploadFile } from '../../../root/api/files';
import { getRawChat } from '../../../root/store/raw/chats.raw.ts';
import { createMessage } from '../../../root/api/messages';
import { FileExtensionEnum, MimetypeEnum, Types } from '../../../root/types/files/types.ts';

export const useSendMessage = () => {
    const { files, setFiles, lossless } = useContext(ContextMedia)!;
    const { update, setChatOnPage } = useAppAction();
    const [isShowPlaceholder, setIsShowPlaceholder] = useState<boolean>(true);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { isPhone, isStandalone } = useAppSelector((state) => state.app);
    const sendMessage = useCallback(async () => {
        if (!files?.length) return;

        const fileArray: Partial<Types>[] = Array.from({ length: files.length });

        await Promise.all(
            files.map(async (file, index) => {
                const myFile = new File([await file.arrayBuffer()], file.name, { type: file.type });
                const data: Partial<Types> = {
                    originalName: file.name,
                    size: file.size,
                    mimeType: file.type as MimetypeEnum,
                    fileType: FileExtensionEnum.IS_MEDIA,
                    metadata: {
                        lossless: lossless,
                        ...file.metaData,
                    },
                };

                const formData = new FormData();
                formData.append('file', myFile, file.name);
                formData.append('chatId', chatOnPage!.id);

                if (file.metaData?.previewId) {
                    const response = await fetch(file.metaData?.previewId);
                    const blob = await response.blob();

                    const myFile = new File([blob], file.name, { type: file.metaData.previewMimeType });

                    const formData = new FormData();
                    formData.append('file', myFile, file.name);
                    formData.append('chatId', chatOnPage!.id);

                    const request = await uploadFile(formData);
                    if (request.success) data.metadata!.previewId = request.data.fileId;
                }

                const response = await uploadFile(formData);
                if (!response.success) return;

                data.key = response.data.fileId;
                fileArray[index] = data;
            }),
        );

        const text = chatOnPage?.inputMessage?.replace(/^\n+|\n+$/g, '').trim();

        await createMessage({
            chatId: chatOnPage!.id,
            parentMessageId: chatOnPage?.answerMessage?.id,
            message: text,
            files: fileArray,
        });

        setFiles(undefined);

        if (getRawChat(chatOnPage?.id))
            update({ id: chatOnPage!.id, inputMessage: undefined, answerMessage: undefined });
        else setChatOnPage({ answerMessage: undefined });
    }, [chatOnPage, isPhone, files, files?.length, lossless]);

    useEffect(() => {
        if (!files?.length) return;
        const elementInput = document.getElementById(styles.new_message)!;

        if (elementInput.innerText !== chatOnPage?.inputMessage) {
            elementInput.innerText = chatOnPage?.inputMessage ?? '';
            setIsShowPlaceholder(!chatOnPage?.inputMessage?.length);
        }
    }, [chatOnPage?.inputMessage, files?.length]);

    useEffect(() => {
        const element = document.getElementById(styles.new_message);
        if (!chatOnPage?.id) return;
        if (!element) return;

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
                update({ id: chatOnPage.id, inputMessage: isText ? element.innerText : undefined });
            }
        };

        const onInput = () => {
            const isEmpty = ['', '\n'].includes(element.innerText);
            if (isEmpty) element.innerText = '';
            setIsShowPlaceholder(isEmpty);
            const isText = !!element.innerText.replace(/^\n+|\n+$/g, '').trim()?.length;
            update({ id: chatOnPage.id, inputMessage: isText ? element.innerText : undefined });
        };

        const preventDefault = (event: KeyboardEvent) => {
            if (event.code === 'Enter' && !isPhone && !event.shiftKey) event.preventDefault();
        };

        const send = (event: KeyboardEvent) => {
            if (event.code === 'Enter' && !isPhone && !event.shiftKey) sendMessage();
        };

        element.addEventListener('input', onInput);
        element.addEventListener('paste', paste);
        document.addEventListener('keypress', preventDefault);
        document.addEventListener('keyup', send);

        return () => {
            element.removeEventListener('input', onInput);
            element.removeEventListener('paste', paste);
            document.removeEventListener('keypress', preventDefault);
            document.removeEventListener('keyup', send);
        };
    }, [sendMessage]);

    useEffect(() => {
        if (!files?.length) return;
        const sendMessageButton = document.getElementById(styles.button_background)!;

        if (isStandalone && isPhone) sendMessageButton.addEventListener('touchend', sendMessage);
        else sendMessageButton.addEventListener('click', sendMessage);

        return () => {
            if (isStandalone && isPhone) sendMessageButton.removeEventListener('touchend', sendMessage);
            else sendMessageButton.removeEventListener('click', sendMessage);
        };
    }, [sendMessage, files?.length]);

    return [isShowPlaceholder];
};
