import styles from '../index.module.css';

export const getIsFocused = (isPhone: boolean = false): boolean => {
    const element = document.getElementById(styles.new_message)!;

    if (isPhone) {
        if (window.visualViewport) {
            const threshold = 150; // px
            return window.innerHeight - window.visualViewport.height > threshold;
        }
        return false;
    }

    const elFocused = document.activeElement === element || element.contains(document.activeElement);

    try {
        const sel = window.getSelection();
        const caretInside = sel && sel.rangeCount > 0 ? element.contains(sel.getRangeAt(0).startContainer) : false;

        return elFocused || caretInside;
    } catch (e) {
        return elFocused;
    }
};
