import type { SlashCommand, UserData } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';
import InteractionCommandContext from '../structures/Interaction';
import * as Stands from '../database/rpg/Stands';
import * as Util from '../utils/functions';
import * as Emojis from '../emojis.json';

export const name: SlashCommand["name"] = "profile";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "profile",
    description: "🔱 Display your bizarre profile (or someone's else).",
    options: [
        {
            name:"user",
            description:"The user whose profile you want to see",
            required: false,
            type:6
        }
    ]
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    if (ctx.interaction.options.getUser("user")) {
        userData = await ctx.client.database.getUserData(ctx.interaction.options.getUser("user").id);
        if (!userData) return ctx.sendT("base:USER_NO_ADVENTURE");
    }
    const rows: UserData[] = await ctx.client.database.postgres.client.query(`SELECT * FROM users WHERE adventureat IS NOT NULL AND level IS NOT NULL AND xp IS NOT NULL ORDER BY level DESC, xp DESC`).then(r => r.rows);
    const userPosition = rows.findIndex(p => p.id === ctx.interaction.user.id) + 1;
    const userStand = Stands[(userData.stand.replace(/ /gi, "_").replace(/:/gi, "_")) as keyof typeof Stands];

    const embed = new MessageEmbed()
        .setAuthor({ name: userData.tag, iconURL: ctx.interaction.options.getUser("user")?.displayAvatarURL({ dynamic: true }) ?? ctx.interaction.user.displayAvatarURL({ dynamic: true }) });

    ctx.makeMessage({
        embeds: [embed]
    });
};
