export const getFileSize = (value?: number): [string, string] => {
    if (!value) return ['0', 'kb'];
    if (value < 1024) return [value.toFixed(0), 'b'];
    value /= 1024;
    if (value < 1024) return [value.toFixed(0), 'kb'];
    value /= 1024;
    if (value < 1024) return [value.toFixed(0), 'mb'];
    value /= 1024;
    if (value < 1024) return [value.toFixed(0), 'gb'];
    else return ['0', 'kb'];
};
