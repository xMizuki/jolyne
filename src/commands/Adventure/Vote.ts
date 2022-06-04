import type { SlashCommand, UserData, Item } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import * as Items from '../../database/rpg/Items';

export const name: SlashCommand["name"] = "vote";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "vote",
    description: "Show how many times you voted for Jolyne",
    options: []
};



export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData: UserData) => {
    const votedTotal = await ctx.client.database.redis.get(`jjba:voteCount:${ctx.interaction.user.id}`) || 0;
    const votedTotalMonth = await ctx.client.database.redis.get(`jjba:voteCount${new Date().getUTCMonth()}${new Date().getUTCFullYear()}:${ctx.interaction.user.id}`) || 0;
    // @ts-ignore
    const voteCooldown = await ctx.client.database.redis.get("jjba:vote:" + ctx.interaction.user.id) ? `<t:${((await ctx.client.database.redis.get("jjba:vote:" + ctx.interaction.user.id))/1000).toFixed(0)}:R>` : ": Never... [click here](https://top.gg/bot/923619190831730698/vote) to vote!";

    let rewards = Util.getRewards(userData);

    rewards.money = Math.round(rewards.money / 4.5);
    rewards.xp = Math.round(rewards.money / 4.5);

    let content = `By [voting](https://top.gg/bot/923619190831730698/vote), you get **${Util.localeNumber(rewards.xp)}** <:xp:925111121600454706> and **${Util.localeNumber(rewards.money)}** <:jocoins:927974784187392061> and perhaps a **Mysterious Arrow** <:mysterious_arrow:924013675126358077> (10%)`;

    return await ctx.interaction.reply({embeds: [{
        author: { name: ctx.interaction.user.tag, iconURL: ctx.interaction.user.displayAvatarURL({ dynamic: true}) },
        description: `You [voted](https://top.gg/bot/923619190831730698/vote) **${votedTotalMonth}** time(s) this month and **${votedTotal}** in total.\nThe last time you voted was ${voteCooldown}\n\nℹ️ | ${content}`,
        timestamp: new Date(),
        color: "#ff3366"
    }]});

};
