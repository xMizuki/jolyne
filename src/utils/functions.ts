import type { UserData, Quest, NPC, Stand, Item } from '../@types';
import { Collection, MessageEmbed, MessageActionRowComponentResolvable, MessageActionRow } from 'discord.js';
import * as Items from '../database/rpg/Items';
import * as Stands from '../database/rpg/Stands';
import Canvas from 'canvas';

const bufferCache: Array<Buffer> = [];

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

export const removeItem = function RemoveOneFromArray(array: Array<any>, toRemove: string): Array<any> {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i].toLowerCase() === toRemove.toLowerCase()) {
            array.splice(i, 1);
            break;
        }
    }
    return array;
}

export const generateStandCart = async function standCart(stand: Stand): Promise<Buffer> {
    // @ts-expect-error
    if (bufferCache[stand.name as keyof typeof String]) return bufferCache[stand.name as keyof typeof bufferCache];

    const canvas = Canvas.createCanvas(230, 345);
    const ctx = canvas.getContext("2d");
    const image = await Canvas.loadImage(stand.image);
    let card_link;
    let color;
    if (stand.rarity === "S") {
        color = "2b82ab";
        card_link = "https://cdn.discordapp.com/attachments/898236400195993622/959480216277905418/S_CARD.png";
    } else if (stand.rarity === "A") {
        color = "3b8c4b";
        card_link = "https://cdn.discordapp.com/attachments/898236400195993622/959459394205126726/A_CARD.png";
    } else if (stand.rarity === "B") {
        color = "786d23"
        card_link = "https://cdn.discordapp.com/attachments/898236400195993622/959480058651766874/B_CARD.png";
    } else if (stand.rarity === "C") {
        color = "#181818";
        card_link = "https://cdn.discordapp.com/attachments/898236400195993622/959480090331316334/C_CARD.png";
    } else {
        color = 0xff0000;
        card_link = "https://cdn.discordapp.com/attachments/898236400195993622/959480253175201862/SS_CARD.png"
    }
    
    let card_image = await Canvas.loadImage(card_link);
    const RM = 90;
    ctx.drawImage(image, 40, 50, 230-RM+15, 345-RM+20);
    ctx.drawImage(card_image, 0, 0, 230, 345);
    ctx.fillStyle = "white";
    if (stand.name === "Muhammad Avdol" || stand.name === "Giorno Giovanna") {
        ctx.font = "20px Impact";
        let content = stand.name.substring(0, 10) + "...";
        ctx.fillText(content, 40, 40);
    } else if (stand.name.length <= 7) {
        ctx.font = "30px Impact";
        ctx.fillText(stand.name, 74, 40);
    } else if (stand.name.length <= 11) {
        ctx.font = "25px Impact";
        ctx.fillText(`${stand.name}`, 55, 45 - (12 - stand.name.length));
    } else if (stand.name.length <= 14) {
        ctx.font = "22px Impact";
        ctx.fillText(`${stand.name}`, 40, 43 - (15 - stand.name.length));
    } else {
        ctx.font = "20px Impact";
        let content;
        if (stand.name.length >= 15) {
            content = stand.name.substring(0, 15 - (
                stand.name.split("").filter(v => v === ".").length
              + stand.name.split("").filter(v => v === " ").length)) + "...";
        } else {
            content = stand.name;
        }
        ctx.fillText(content, 40, 40 - (20 - stand.name.length));
    }
    // @ts-expect-error
    bufferCache[stand.name as keyof typeof bufferCache] = canvas.toBuffer();

    return canvas.toBuffer();
}

export const getItemNameById = function getItemById(id: string): string {
    return id.toLowerCase().replace(/disk/gi, "disc").replace(/:/gi, "_").replace(/_/g, " ").split(" ").map(v => capitalize(v)).join(" ")
}

export const getItemIdByName = function getItemById(name: string): string {
    return name.toLowerCase().replace(/disk/gi, "disc").replace(/:/gi, "_").replace(/'/gi, "").replace(/ /g, "_").split("_").map(v => capitalize(v)).join("_")
}

export const getItem = function getItemByString(name: string): Item {
    const item: Item = Items[getItemIdByName(name) as keyof typeof Items] || Items[getItemNameById(name) as keyof typeof Items] || Object.keys(Items).map(v => Items[v as keyof typeof Items]).find(v => v.id === name);
    if (!item) return null;
    return item;
}

export const getStand = function getStandByString(name: string): Stand {
    const stand: Stand = Stands[getItemIdByName(name) as keyof typeof Stands] || Stands[getItemNameById(name) as keyof typeof Stands] || Object.keys(Stands).map(v => Stands[v as keyof typeof Stands]).find(v => v.name === name);
    if (!stand) return null;
    return stand;
}
export const calculateArrayValues = (array: number[]): number => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    return sum;
}

export const actionRow = (components: MessageActionRowComponentResolvable[]): MessageActionRow =>
  new MessageActionRow({ components });

export const generateID = (): string => [...Array(12)].map(() => (~~(Math.random() * 36)).toString(36)).join(""); 

export const calcDodgeChances = (data: UserData | NPC): number => {
    const perception = isNPC(data) ? data.skill_points.perception : data.spb.perception;
    return Math.round(Math.round((data.level / 2) + (perception / 1.15)));
};

export const isNPC = function isNPC(crusader: NPC | UserData): crusader is NPC {
    return (crusader as NPC).email !== undefined;
}
//     return Math.round(5 + Math.round((userData.spb.strength * 0.675) + ((Number(userData.level) * 1.50) + ((5 / 100) * 15)) / 2));

export const calcATKDMG = (data: UserData | NPC): number => {
    const strength = isNPC(data) ? data.skill_points.perception : data.spb.perception;
    return Math.round(5 + Math.round((strength * 0.675) + ((Number(data.level) * 1.50) + ((5 / 100) * 15)) / 2));
};
