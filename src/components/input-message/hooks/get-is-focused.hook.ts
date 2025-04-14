import styles from '../index.module.css';

export const getIsFocused = (): boolean => {
    const element = document.getElementById(styles.new_message)!;

    return document.activeElement === element;
};
