export const setThemeColor = (color: string) => {
    let metaThemeColor = document.querySelector('meta[public-key-name=theme-color]');
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', color);
};
