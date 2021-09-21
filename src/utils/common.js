export const getLeadingZero = (number) => (number < 10) ? `0${number}` : `${number}`;

export const isOnline = () => window.navigator.onLine;
