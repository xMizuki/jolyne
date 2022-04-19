import type { SlashCommand, UserData } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../structures/Interaction';
import * as Stands from '../database/rpg/Stands';
import * as Util from '../utils/functions';
import * as Emojis from '../emojis.json';

export const name: SlashCommand["name"] = "skill-points";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "skill-points",
    description: "📖 Display your skill points & your stats. Can also be used to increase your stats.",
    options: []
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    let pointsLeft = (Number(userData.level) * 4) - (userData.skill_points["stamina"] + userData.skill_points["defense"] + userData.skill_points["strength"] + userData.skill_points["perception"]);
    const staminaID = Util.generateID();
    const strengthID = Util.generateID();
    const defenseID = Util.generateID();
    const perceptionID = Util.generateID();


    async function updateMessage(userData: UserData) {
        const staminaButton = new MessageButton()
            .setCustomId(staminaID)
            .setLabel('Stamina')
            .setEmoji('➕')
            .setStyle(pointsLeft <= 0 ? "DANGER" : "SUCCESS")
            .setDisabled(pointsLeft <= 0 ? true : false);
        const strengthButton = new MessageButton()
            .setCustomId(strengthID)
            .setLabel('Strength')
            .setEmoji('➕')
            .setStyle(pointsLeft <= 0 ? "DANGER" : "SUCCESS")
            .setDisabled(pointsLeft <= 0 ? true : false);
        const defenseButton = new MessageButton()
            .setCustomId(defenseID)
            .setLabel('Defense')
            .setEmoji('➕')
            .setStyle(pointsLeft <= 0 ? "DANGER" : "SUCCESS")
            .setDisabled(pointsLeft <= 0 ? true : false);
        const perceptionButton = new MessageButton()
            .setCustomId(perceptionID)
            .setLabel('Perception')
            .setEmoji('➕')
            .setStyle(pointsLeft <= 0 ? "DANGER" : "SUCCESS")
            .setDisabled(pointsLeft <= 0 ? true : false);
        await ctx.sendT("skill-points:BASE_MESSAGE", {
            userData: userData,
            pointsLeft: pointsLeft,
            components: [Util.actionRow([staminaButton, strengthButton, defenseButton, perceptionButton])]
        });
    }
    await updateMessage(userData);
    const filter = async (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => {});
        return i.user.id === ctx.interaction.user.id && i.message.interaction.id === ctx.interaction.id;
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
    ctx.timeoutCollector(collector);

    collector.on('collect', async (i: MessageComponentInteraction) => {
        // Anti-cheat
        if (await ctx.client.database.getCooldownCache(userData.id)) return collector.stop("User probably tried to glitch the system.");
        userData = await ctx.client.database.getUserData(userData.id);
        pointsLeft = (Number(userData.level) * 4) - (userData.skill_points["stamina"] + userData.skill_points["defense"] + userData.skill_points["strength"] + userData.skill_points["perception"]);
        if (pointsLeft <= 0) return collector.stop("No more points left.");

        ctx.timeoutCollector(collector);
        switch (i.customId) {
            case staminaID:
                userData.skill_points.stamina++;
                break;
            case strengthID:
                userData.skill_points.strength++;
                break;
            case defenseID:
                userData.skill_points.defense++;
                break;
            case perceptionID:
                userData.skill_points.perception++;
                break;
        }
        pointsLeft--;
        await ctx.client.database.saveUserData(userData);
        await updateMessage(userData);
    });

};
