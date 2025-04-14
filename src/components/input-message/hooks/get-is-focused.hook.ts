import styles from '../index.module.css';

export const getIsFocused = (): boolean => {
    const element = document.getElementById(styles.new_message)!;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    return element.contains(range.startContainer);
};
