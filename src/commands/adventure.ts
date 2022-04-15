import type { SlashCommand, Interaction, command, UserData } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';

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


export const execute: SlashCommand["execute"] = async (interaction: Interaction, userData?: UserData) => {
    switch (interaction.options.getSubcommand()) {
        case "start":
            if (userData)
            break;
        case "reset":
            break;
    }

}

