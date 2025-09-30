export const getStringDuration = (duration?: number) => {
    if (!duration) return '0:00';

    const seconds = duration % 60;
    const minutes = (duration - seconds) / 60;
    const secondsString = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes ?? 0}:${secondsString}`;
};
