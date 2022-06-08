import type { SlashCommand, UserData, Item } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import * as Items from '../../database/rpg/Items';

export const name: SlashCommand["name"] = "use-item";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "use-item",
    description: "[DEPRECATED COMMAND]",
    options: []
};



export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData: UserData) => {
    return ctx.makeMessage({
        content: 'This command is deprecated. Use `/items use` instead.'
    })
};
