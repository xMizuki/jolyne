import type { SlashCommand, UserData, Item } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../structures/Interaction';
import * as Stands from '../database/rpg/Stands';
import * as Util from '../utils/functions';
import * as Emojis from '../emojis.json';
import * as Items from '../database/rpg/Items';

export const name: SlashCommand["name"] = "daily";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "daily",
    description: "[SUB-COMMANDS]",
    options: [{
        type: 1,
        name: "claim",
        description: "Claim your daily bonuses",
        options: []
    }, {
        type: 1,
        name: "quests",
        description: "Display your daily quests",
        options: []
    }]
};



export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    const dateAtMidnight = new Date(new Date().setHours(0, 0, 0, 0));
    const nextDate = new Date(dateAtMidnight.getTime() + 86400000);
    if (ctx.interaction.options.getSubcommand() === "claim") {
        if (userData.daily.claimedAt == dateAtMidnight.getTime()) {
            return ctx.sendT("daily:ALREADY_CLAIMED", {
                time: ctx.convertMs(nextDate.getTime() - Date.now())
            });
        }
        let rewards = {
            money: (userData.level * 1000) - ((userData.level * 1000) * 25 / 100),
            xp:  (userData.level * 400) - ((userData.level * 400) * 10 / 100),
            premium: {
                money: (userData.level * 400) - ((userData.level * 400) * 25 / 100),
                xp: (userData.level * 100) - ((userData.level * 100) * 10 / 100)
            }
        };
        if (rewards.money > 6000) rewards.money = 6000;
        // check if the user last daily was claimed after 2 days
        if (userData.daily.claimedAt >= (dateAtMidnight.getTime() - 86400000)) {
            userData.daily.streak = 0;
        }
        userData.daily.claimedAt = dateAtMidnight.getTime();
        userData.daily.streak++;
        let goal: number = userData.daily.streak;
        // Set the user's daily goal
        while (true) {
            goal++;
            if (goal % 7 === 0) break;
        };
        let embed_description = ctx.translate("daily:CLAIMED_EMBED_DESCRIPTION", {
            coins: Util.localeNumber(rewards.money),
            xp: Util.localeNumber(rewards.xp),
        });
        userData.money += rewards.money;
        userData.xp += rewards.xp;
        if (await ctx.client.database.redis.client.get(`jjba:premium:${userData.id}`)) {
            embed_description += "\n" + ctx.translate("daily:CLAIMED_EMBED_FOOTER", {
                coins: Util.localeNumber(rewards.premium.money),
                xp: Util.localeNumber(rewards.premium.xp)
            });
            userData.money += rewards.premium.money;
            userData.xp += rewards.premium.xp;
        }
        const embed = new MessageEmbed()
            .setAuthor({ name: ctx.interaction.user.tag, iconURL: ctx.interaction.user.displayAvatarURL({ dynamic: true }) })
            .setColor("#70926c")
            .setDescription(embed_description)
            .setFooter({ text: ctx.translate("daily:CLAIMED_EMBED_FOOTER") + ` ${userData.daily.streak}/${goal}`})
            .addField("Want more?", "Vote for me by using the \`/vote\` command.");
        if (userData.daily.streak % 7 === 0) {
            const arrow = Util.getItem("Mysterious_Arrow")
            let arrows: number = 0;
            for (let i = userData.daily.streak; i > 0; i -= 7) {
                arrows++;
            }
            arrows *= 2;
            for (let i = 0; i < arrows; i++) {
                userData.items.push(arrow.id);
            }
            embed.addField("Streak Bonus", `\`x${arrows} ${arrow.name}\` ${arrow.emoji}`);
        }
        Util.incrQuestTotal(userData, "cdaily", "chapter");
        Util.incrQuestTotal(userData, "cdaily", "daily");
        await ctx.client.database.saveUserData(userData);
        ctx.interaction.reply({ embeds: [embed] });
    


    }
};
