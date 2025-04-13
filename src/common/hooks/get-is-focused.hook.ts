export const getIsFocused = (element: HTMLElement): boolean => {
    const elFocused = document.activeElement === element || element.contains(document.activeElement);

    try {
        const sel = window.getSelection();
        const caretInside = sel && sel.rangeCount > 0 ? element.contains(sel.getRangeAt(0).startContainer) : false;

        return elFocused || caretInside;
    } catch (e) {
        return elFocused;
    }
};
