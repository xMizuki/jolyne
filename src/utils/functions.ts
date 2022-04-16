export const getRandomInt = function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const capitalize = function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const localeNumber = function localeNumber(num: number) {
    return num.toLocaleString('en-US');
};

export const s =  function s(nbr: number | string) {
    nbr = Number(nbr);
    if (isNaN(nbr)) return "(s)";
    if (nbr <= 1) return "";
    else return 's';
};