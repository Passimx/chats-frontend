export const focusToEnd = (el: HTMLElement): void => {
    const range = document.createRange();
    const sel = window.getSelection();

    // Установим курсор в конец
    range.selectNodeContents(el);
    range.collapse(false); // false => конец, true => начало

    sel?.removeAllRanges();
    sel?.addRange(range);
};
