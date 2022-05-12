import type { SlashCommand, UserData, Item } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';
import InteractionCommandContext from '../structures/Interaction';
import type { Quest, Chapter } from '../@types';
import * as Util from '../utils/functions';
import * as Items from '../database/rpg/Items';
import * as Emojis from '../emojis.json';
import * as Quests from '../database/rpg/Quests';

export const name: SlashCommand["name"] = "loot";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 3;
export const rpgCooldown: SlashCommand["rpgCooldown"] = {
    base: 1800000 / 2,
    premium: 1800000 / 4,
    i18n: "loot:COOLDOWN"
}
export const data: SlashCommand["data"] = {
    name: "loot",
    description: "lootlootlootloot",
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    const rng: Array<{
        pr: string,
        name: string,
        emoji: string,
        loots: Array<{
            percent: number,
            loot: Item | number
        }>
    }> = [{
            pr: "in a",
            name: "wallet",
            emoji: "👛",
            loots: [{
                percent: 50,
                loot: Util.getRandomInt(1, 1000)
            }, {
                percent: 51,
                loot: Items.Candy
            }]
        }, {
            pr: "in the",
            name: "train",
            emoji: "🚂",
            loots: [{
                percent: 7,
                loot: Items.Mysterious_Arrow
            }, {
                percent: 10,
                loot: Items.Money_Box
            }, {
                percent: 20,
                loot: Items.Box
            }, {
                percent: 70,
                loot: Util.randomFood()
            }]

        }]


};