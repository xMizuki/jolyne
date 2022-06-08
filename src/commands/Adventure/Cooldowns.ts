import type { SlashCommand, UserData, Stand } from '../../@types';
import { MessageAttachment, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable, Message } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import * as Items from '../../database/rpg/Items';
import * as NPCs from '../../database/rpg/NPCs';

export const name: SlashCommand["name"] = "cooldowns";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "cooldowns",
    description: "Show your cooldowns",
};

export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData: UserData) => {
    const cooldowns: {
        name: string,
        cooldown: number,
        emoji: string
    }[] = [{
        name: 'Daily',
        cooldown: userData.daily.claimedAt + 86400000,
        emoji: '📅'
    }];
    const cmdsWithCds = ctx.client.commands.map(v => v).filter(v => v.rpgCooldown);
    for (const cmd of cmdsWithCds) {
        const cd = parseInt(await ctx.client.database.redis.client.get(`jjba:rpg_cooldown_${userData.id}:${cmd.name}`));
        if (cd) cooldowns.push({
            name: Util.capitalize(cmd.name),
            cooldown: cd,
            emoji: cmd.rpgCooldown.emoji
        });
    }

    let content = '';
    for (const cooldown of cooldowns) {
        const timeLeft = cooldown.cooldown - Date.now() < 0 ? 'ready.' : Util.generateDiscordTimestamp(cooldown.cooldown, 'FROM_NOW');
        content += `${cooldown.emoji} | ${cooldown.name}: ${timeLeft}\n`;
    }
    ctx.makeMessage({
        embeds: [{
            author: {
                name: ctx.author.tag,
                iconURL: ctx.author.displayAvatarURL({ dynamic: true })
            },
            color: '70926c',
            description: content,
            timestamp: new Date()
        }]
    });

};

