import type { SlashCommand, UserData } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';
import InteractionCommandContext from '../structures/Interaction';

export const name: SlashCommand["name"] = "adventure";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "adventure",
    description: "[SUB-COMMANDS]",
    options: [{
        type: 1,
        name: "start",
        description: "⭐ Start your bizarre adventure",
        options: []
    }, {
        type: 1,
        name: "reset",
        description: "💣 BITES THE DUST...",
        options: []
    }]
}


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    return ctx.sendT("base:ADVENTURE_RESET_BITE")
    switch (ctx.interaction.options.getSubcommand()) {
        case "start":
            if (userData)
            break;
        case "reset":
            break;
    }

}

