import type { UserData, Quest, NPC, Stand, Item, Ability, Mail } from '../@types';
import { Collection, MessageEmbed, MessageActionRowComponentResolvable, MessageActionRow, ColorResolvable } from 'discord.js';
import moment from 'moment-timezone';
import * as Items from '../database/rpg/Items';
import * as Stands from '../database/rpg/Stands';
import * as Quests from '../database/rpg/Quests';
import * as NPCs from '../database/rpg/NPCs';
import Canvas from 'canvas';
import JolyneClient from '../structures/Client';

const bufferCache: {
    [key: string]: Buffer
} = {};

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
    if (bufferCache[stand.name as keyof typeof String]) return bufferCache[stand.name as keyof typeof bufferCache];

    const canvas = Canvas.createCanvas(230, 345);
    const ctx = canvas.getContext("2d");
    const image = await Canvas.loadImage(stand.image);
    let card_link;
    let color: ColorResolvable;
    switch (stand.rarity) {
        case "S":
            color = "#2b82ab";
            card_link = "https://cdn.discordapp.com/attachments/898236400195993622/959480216277905418/S_CARD.png";
            break;
        case "A":
            color = "#3b8c4b";
            card_link = "https://cdn.discordapp.com/attachments/898236400195993622/959459394205126726/A_CARD.png";
            break;
        case "B":
            color = "#786d23"
            card_link = "https://cdn.discordapp.com/attachments/898236400195993622/959480058651766874/B_CARD.png";
            break;
        case "C":
            color = "#181818";
            card_link = "https://cdn.discordapp.com/attachments/898236400195993622/959480090331316334/C_CARD.png";
            break;
        default:
            color = 0xff0000;
            card_link = "https://cdn.discordapp.com/attachments/898236400195993622/959480253175201862/SS_CARD.png"
    }
    
    let card_image = await Canvas.loadImage(card_link);
    const RM = 90;
    ctx.drawImage(image, 40, 50, 230-RM+15, 345-RM+20);
    ctx.drawImage(card_image, 0, 0, 230, 345);
    ctx.fillStyle = "white";
    if (stand.name.length === 10) {
        ctx.font = "22px Impact";
        let content = stand.name.substring(0, 10);
        ctx.fillText(content, 50, 40);
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
    if (name.endsWith('disk')) {
        const st = name.split(':');
        const stand = getStand(st[0] + (st.length > 2 ? ':' + st[1] : ''));
        return Items[`${stand.name.replace(/ /gi, "_")}_Disc` as keyof typeof Items];
    }
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
    return (crusader as NPC).emoji !== undefined;
}

export const isItem = function isItem(item: any): item is Item {
    return (item as NPC).id !== undefined;
}

//     return Math.round(5 + Math.round((userData.spb.strength * 0.675) + ((Number(userData.level) * 1.50) + ((5 / 100) * 15)) / 2));

export const calcATKDMG = (data: UserData | NPC): number => {
    const strength = isNPC(data) ? data.skill_points.strength : data.spb.strength;
    return Math.round(5 + Math.round((strength * 0.252) + ((Number(data.level) * 1.50) + ((5 / 100) * 15)) / 2));
};

export const generateStandEmbed = function generateStandEmbed(stand: Stand, userData: UserData): MessageEmbed {
    const fields: Array<{
        name: string;
        value: string;
        inline?: boolean;
    }> = [];
    const userATKDMG = calcATKDMG(userData);

    for (const ability of stand.abilities) {
        const damage: number = (() => {
            if (ability.damages === 0) return 0;
            const diff = (ability.damages - userATKDMG) < 0 ? -(ability.damages - userATKDMG) : ability.damages - userATKDMG;
            return ability.damages + (userATKDMG - diff) * 1.25;
        })();
        fields.push({
            name: `${ability.ultimate ? "⭐" : ""}${ability.name}`,
            inline: ability.ultimate ?? false,
            value: `**\`Damages:\`** ${damage}
**\`Stamina Cost:\`** ${ability.stamina}
                    
*${ability.description}*
${ability.ultimate ? "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬" : "▬▬▬▬▬▬▬▬▬"}`
        });
    }
    return new MessageEmbed()
    .setAuthor({ name: stand.name, iconURL: stand.image })
    .addFields(fields)
    .setDescription(stand.description + "\n\n" + `
**Skill-Point Bonuses:** +${Object.keys(stand.skill_points).map(v => stand.skill_points[v as keyof typeof stand.skill_points]).reduce((a, b) => a + b, 0)})} Skill-Points:\n
${Object.keys(stand.skill_points).map(r =>  `  • +${stand.skill_points[r as keyof typeof stand.skill_points]} ${r}`).join("\n")}`)
    .setFooter({ text: `Rarity: ${stand.rarity}` })
    .setColor(stand.color)
    .setThumbnail(stand.image);
}

export const calcAbilityDMG = function calcAbilityDMG(ability: Ability, userData: UserData | NPC): number {
    if (ability.damages === 0) return 0;
    const userATKDMG = calcATKDMG(userData);
    /*
    if (ability.damages === 0) return 0;
    const diff = (ability.damages - userATKDMG) < 0 ? -(ability.damages - userATKDMG) : ability.damages - userATKDMG;
    const fixedDiff = (userATKDMG - diff) < 0 ? -(userATKDMG - diff) : userATKDMG - diff;
    return ability.damages + (fixedDiff * (userData.level + (userData.skill_points.strength / 2)));*/
    return Math.round(ability.damages * (userATKDMG / 15) + ability.damages + ((userATKDMG / ability.damages) * (ability.damages * 2 + (userATKDMG / 4))) + (ability.damages / userATKDMG ) * (userData.level + (userData.skill_points.strength / 2)));
}

export const randomFood = function getRandomFood(): Item {
    return randomArray(Object.keys(Items).map(i => Items[i as keyof typeof Items]).filter(i => i.type === "consumable" && i.usable && i.tradable));
}

export const incrQuestTotal = function incrQuestTotal(userData: UserData, questId: string, locale: "chapter" | "daily"): void {
    const quests = {
        chapter: userData.chapter_quests,
        daily: userData.daily.quests
    }[locale];
    if (!quests.find(q => q.id === questId)) return;
    quests.find(q => q.id === questId).total++;
}

export const formatDate = (date: number): string => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    const time = moment.tz(d.getTime(), "Europe/Paris").format("HH:mm:ss")
    return `${day}/${month}/${year} ${time} (UTC${getUTCOffsetInHours()})`;
}

function getUTCOffsetInHours(): string {
    const total = moment().utcOffset() / 60;
    return total > 0 ? `+${total}` : `${total}`;
}

export const makeNPCString = function makeNPCString(npc: NPC, emoji?: string): string {
    return `${emoji ?? npc.emoji} **${npc.name}**:`;
  }
  
  export const shuffle = function shuffle(array: any[]) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export const isQuest = function isQuest(item: any): item is Quest {
    return (item as Quest).id !== undefined && ((item as Quest).completed !== undefined || (item as Quest).i18n !== undefined || (item as Quest).total !== undefined || (item as Quest).npc !== undefined);
}

export const isQuestArray = function isQuestArray(item: any): item is Quest[] {
    return item instanceof Array && (item as Quest[]).every(i => isQuest(i));
}

export const isMail = function isMail(item: any): item is Mail {
    return (item as Mail).id !== undefined && (item as Mail).author !== undefined;
}

export const isMailArray = function isMailArray(item: any): item is Mail[] {
    return item instanceof Array && (item as Mail[]).every(i => isMail(i));
}

export const generateDiscordTimestamp = function generateDiscordTimestamp(date: Date | number, type: 'FROM_NOW' | 'DATE' | 'FULL_DATE'): string {
    const fixedDate = typeof date === "number" ? new Date(date) : date;
    return `<t:${(fixedDate.getTime() / 1000).toFixed(0)}:${type
        .replace('FROM_NOW', 'R')
        .replace('DATE', 'D')
        .replace('FULL_D', 'F')}>`;
}

export const standPrices = {
    "SS": 200000,
    "S": 50000,
    "A": 25000,
    "B": 10000,
    "C": 5000
}

export const getImageColor = async function getImageColor(client: JolyneClient, url: string): Promise<ColorResolvable> {
    try {
        const alr = await client.database.redis.get(`jjba:color:${url}`) as ColorResolvable;
        if (alr) return alr;
        let ext = "png";
        if (url.endsWith("jpg")) ext = "jpg";
        const axios = require("axios");
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        })
        const buffer = Buffer.from(response.data, "utf-8");

        function blendColors(colorA: string, colorB: string, amount: number) {
            const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
            const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
            const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
            const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
            const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
            return '#' + r + g + b;
        } 

        const getColors = require('get-image-colors');
        let color;
        await getColors(buffer, 'image/' + ext).then(async (colors: any[]) => {
            await client.database.redis.set(`jjba:color:${url}`, blendColors(colors.map(color => color.hex())[0], colors.map(color => color.hex())[colors.length - 1], 0.5));
            color = blendColors(colors.map(color => color.hex())[0], colors.map(color => color.hex())[colors.length - 1], 0.5);
        });
        return color;

    } catch (e) {
        const color = [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        client.database.redis.set(`jjba:color:${url}`, color);
        return color as ColorResolvable;
    }
}

export const getRewards = (userData: UserData) => {
    let rewards = {
        money: (userData.level * 1000) - ((userData.level * 1000) * 25 / 100),
        xp:  (userData.level * 400) - ((userData.level * 400) * 10 / 100),
        premium: {
            money: (userData.level * 400) - ((userData.level * 400) * 25 / 100),
            xp: (userData.level * 100) - ((userData.level * 100) * 10 / 100)
        }
    };
    if (rewards.money > 6000) rewards.money = 6000;
    if (rewards.premium.money > 15000) rewards.money = 15000;

    return rewards;
}

export const RandomNPC = (level: number, onlyPublic?: boolean): NPC => {
    const NPCSArray = Object.values(NPCs).filter(r => r.level <= level && (onlyPublic ? !r.private : true));
    const StandsArray = Object.values(Stands);
    const NPC = NPCSArray[Math.floor(Math.random() * NPCSArray.length)];
    return {
        ...NPC,
        stand: NPC.stand?.replace('RANDOM', StandsArray[Math.floor(Math.random() * StandsArray.length)].name) ?? null
    }
}

export const generateDailyQuests = (level: number): Quest[] => {
    const quests: Quest[] = [Quests.ClaimDaily(1)];

    for (let i = 0; i < level; i++) {
        if (RNG(80)) {
            quests.push(Quests.Defeat(RandomNPC(level, true)));
        }
    }
    quests.push(Quests.ClaimCoins(getRandomInt(1, level * 1000)));

    let max = level;
    if (max > 10) max = 10;

    if (RNG(50)) {
        quests.push(Quests.UseLoot(getRandomInt(1, max)));
    }
    if (RNG(50)) {
        quests.push(Quests.Assault(getRandomInt(1, max)));
    }
    if (RNG(50)) {
        quests.push(Quests.LootCoins(getRandomInt(1, max * 250)));
    }

    return quests;
}

export const RNG = (percent: number): boolean => {
    return getRandomInt(0, 100) < percent;
}

export const forEveryQuests = (userData: UserData, filter: (q: Quest) => boolean, callback: (quest: Quest) => void) => {
    for (const key in userData) {
        if (userData.hasOwnProperty(key)) {
            const element = userData[key as keyof typeof userData];
            if (isQuestArray(element)) {
                for (const quest of element.filter(q => filter(q))) {
                    callback(quest)
                }
                // @ts-ignore
                userData[key as keyof typeof userData] = element;
            } else if (typeof element === 'object' && element !== null) {
                for (const key2 of Object.keys(element)) {
                    const element2 = element[key2 as keyof typeof element] as any;
                    if (isQuestArray(element2)) {
                        for (const quest of element2.filter(q => filter(q))) {
                            callback(quest)
                        }
                        // @ts-ignore
                        userData[key as keyof typeof userData][key2 as keyof typeof userData] = element[key2 as keyof typeof element];
                    }
                }
            }
        }

    }
    
}