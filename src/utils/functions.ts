import type { UserData, Quest, NPC } from '../@types';

export const getRandomInt = function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const capitalize = function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const localeNumber = function localeNumber(num: number): string {
    return num.toLocaleString('en-US');
};

export const s =  function s(nbr: number | string): 's' | '' | '(s)' {
    nbr = Number(nbr);
    if (isNaN(nbr)) return "(s)";
    if (nbr <= 1) return "";
    else return 's';
};

export const romanize = function romanize(num: number) {
    if (!+num)
        return false;
    let digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
};

export const getMaxXp = function getMaxXP(level: number): number {
    return (level / 5 * 1000) * 13;
}

export const getATKDMG = function getATKDMG(userData: UserData): number {
    return Math.round(5 + Math.round((userData.spb.strength * 0.675) + ((Number(userData.level) * 1.50) + ((5 / 100) * 15)) / 2));
}
export const wait = function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const randomArray = function randomArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}