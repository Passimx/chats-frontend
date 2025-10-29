import { FC, memo, useContext, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types.ts';
import { getFileSize } from '../../common/hooks/get-file-size.ts';
import { useTranslation } from 'react-i18next';
import { ContextMedia } from '../preview-media-context';
import { CiEdit } from 'react-icons/ci';

export const EditFileName: FC<PropsType> = memo(({ file, number }) => {
    const { t } = useTranslation();
    const { files, setFiles } = useContext(ContextMedia)!;

    const [id, size] = useMemo(() => {
        const [memory, unit] = getFileSize(file.size);
        return [`file_${number}`, `${memory} ${t(unit)}`];
    }, [file, number]);

    // // первоначальная установка имени файла
    useEffect(() => {
        const element = document.getElementById(id);
        if (element) element.innerText = file.name;
    }, [id]);

    const prepareText = (text: string = '') => {
        let fileName = text
            .trim() // убираем пробелы в начале и в конце
            // eslint-disable-next-line no-control-regex
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
            .replace(/\s+/g, ' ');

        if (fileName?.length === 0) fileName = t('without_name');

        return fileName;
    };

    const input = async () => {
        const element = document.getElementById(id);
        if (!element) return;
        if (!files?.length) return;

        const fileName = prepareText(element.innerText);

        files[number] = new File([await file.arrayBuffer()], fileName, { type: file.type });
        files[number].metaData = file.metaData;
        files[number].randomId = file.randomId;
        setFiles(files);
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

    const focusOut = () => {
        const element = document.getElementById(id);
        if (!element) return;
        element.scrollLeft = 0;
        element.innerText = prepareText(element.innerText);
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
        const textNode = document.createTextNode(prepareText(pastedText));
        range.insertNode(textNode);
        range.collapse(true);

        // Перемещаем курсор после вставленного текста
        range.setStartAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    useEffect(() => {
        const element = document.getElementById(id);

        element?.addEventListener('input', input);
        element?.addEventListener('paste', paste);
        element?.addEventListener('focusout', focusOut);
        return () => {
            element?.removeEventListener('input', input);
            element?.removeEventListener('paste', paste);
            element?.removeEventListener('focusout', focusOut);
        };
    }, [id, files]);

    return (
        <div className={`${styles.background} text_translate`}>
            <div className={styles.file_name_background}>
                <div className={styles.edit_button_background} onClick={focus}>
                    <CiEdit className={styles.edit_button} />
                </div>
                <div
                    id={id}
                    className={`content_editable ${styles.file_name}`}
                    contentEditable={true}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault();
                    }}
                    spellCheck={false}
                />
            </div>
            <div className={styles.file_size}>{size}</div>
        </div>
    );
});
