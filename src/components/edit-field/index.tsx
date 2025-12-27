import { FC, memo, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import { CiEdit } from 'react-icons/ci';
import { PropsType } from './types.ts';

export const EditField: FC<PropsType> = memo(({ value, setValue, blur }) => {
    const id = useMemo(() => window.crypto.randomUUID(), []);

    const prepareText = (text: string = '') => {
        let fileName = text
            .trim() // убираем пробелы в начале и в конце
            // eslint-disable-next-line no-control-regex
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
            .replace(/\s+/g, ' ');

        if (fileName?.length === 0) fileName = value || '';

        return fileName;
    };

    useEffect(() => {
        const element = document.getElementById(id);
        if (element && value && value !== element.innerText) element.innerText = value;
    }, [value]);

    const input = async () => {
        const element = document.getElementById(id);
        if (!element) return;
        const text = prepareText(element.innerText);
        setValue(text);
    };

    const focus = () => {
        const element = document.getElementById(id) as HTMLElement | null;
        if (!element) return;

        element.focus();

        // смещаем курсор в конец строки
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);

        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
        element.scrollLeft = element.scrollWidth;
    };

    const paste = (event: ClipboardEvent) => {
        event.preventDefault();

        // Получаем текст из буфера обмена
        const pastedText = event.clipboardData?.getData('text/plain');
        if (!pastedText?.length) return;

        // Получаем текущее выделение
        const selection = window.getSelection();
        if (!selection) return;
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        range.deleteContents(); // Удаляем выделенный текст (если есть)

        // Создаем текстовый узел и вставляем его
        const text = prepareText(pastedText);
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        setValue(text);
        range.collapse(true);

        // Перемещаем курсор после вставленного текста
        range.setStartAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    useEffect(() => {
        let handler: NodeJS.Timeout;
        const element = document.getElementById(id);

        element?.addEventListener('input', (event) => {
            event.preventDefault();

            clearTimeout(handler);
            handler = setTimeout(input, 300);
        });

        function stopPropagation(event: Event) {
            event.stopPropagation();
        }

        const eventsToBlock = [
            'keydown',
            'keyup',
            'keypress',
            'input',
            'change',
            'paste',
            'cut',
            'copy',
            'compositionstart',
            'compositionupdate',
            'compositionend',
            'drop',
        ];

        eventsToBlock.forEach((eventType) => {
            element?.addEventListener(eventType, stopPropagation);
        });

        element?.addEventListener('paste', paste);
        return () => {
            element?.removeEventListener('input', input);
            element?.removeEventListener('paste', paste);
            eventsToBlock.forEach((eventType) => {
                element?.removeEventListener(eventType, stopPropagation);
            });
        };
    }, [id, setValue]);

    return (
        <div className={`${styles.background} text_translate`}>
            <div className={styles.file_name_background}>
                <div className={styles.file_name_padding}>
                    <div
                        id={id}
                        className={`content_editable ${styles.file_name} ${blur && styles.blur}`}
                        contentEditable={true}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') e.preventDefault();
                        }}
                        spellCheck={false}
                    />
                </div>
                <div className={styles.edit_button_background} onClick={focus}>
                    <CiEdit className={styles.edit_button} />
                </div>
            </div>
        </div>
    );
});
