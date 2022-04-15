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
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    if (ctx.interaction.options.getSubcommand() === "start") {
        //if (userData) return ctx.sendT("base:ALREADY_ADVENTURE");
        const firstComponent: any = {
            components: [{
                custom_id: ctx.interaction.id + ":agree",
                disabled: false,
                emoji: null,
                label: ctx.translate("adventure:AGREE"),
                style: 3,
                type: 2,
                url: null
            }, {
                custom_id: ctx.interaction.id + ":disagree",
                disabled: false,
                emoji: null,
                label: ctx.translate("adventure:DISAGREE"),
                style: 4,
                type: 2,
                url: null
            }],
            type: 1
        };
        ctx.sendT("adventure:CONFIRM", {
            components: [firstComponent]
        });
    }

};

