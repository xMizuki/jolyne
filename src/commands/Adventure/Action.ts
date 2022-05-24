import type { SlashCommand, UserData, Quest } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import * as Quests from '../../database/rpg/Quests';
import * as Actions from '../../database/rpg/Actions';

export const name: SlashCommand["name"] = "action";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "action",
    description: "📖 Show what you can do.",
    options: []
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    const selectID = Util.generateID();
    const options: Array<{
        label: string,
        description: string,
        value: Quest["id"],
        emoji?: Quest["emoji"]
    }> = [];

    for (const quest of userData.chapter_quests.filter(q => q.id.startsWith("action") && !q.completed)) {
        const questData = Object.keys(Quests).map(v => Quests[v as keyof typeof Quests]).find(v => (v as Quest).id === quest.id) as Quest;
        options.push({
            label: ctx.translate(`quest:${quest.i18n}.TITLE`),
            description: ctx.translate(`quest:${quest.i18n}.DESCRIPTION`),
            value: quest.id.split(":")[1],
            emoji: quest?.emoji
        });
    }
    if (options.length === 0) return ctx.sendT("action:NO_ACTIONS")
    const selectMENU = new MessageSelectMenu()
        .setCustomId(selectID)
        .setPlaceholder('Select an action')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(options);

    await ctx.makeMessage({
        content: Emojis.think,
        components: [Util.actionRow([selectMENU])]
    });
    const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => { });
        return i.user.id === userData.id;
    };
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

    collector.on("collect", async (i: MessageComponentInteraction) => {
        collector.stop("action");
        if (!i.isSelectMenu()) return;

        // Anti-cheat
        userData = await ctx.client.database.getUserData(userData.id, true);
        if (!userData.chapter_quests.find(q => q.id === `action:${i.values[0]}`) || userData.chapter_quests.find(q => q.id === `action:${i.values[0]}`).completed) return;
        try {
            await Actions[i.values[0] as keyof typeof Actions](ctx, userData);
        } catch(e) {
            ctx.makeMessage({
                components: [],
                content: `An error occured while executing the action: \`${(e as Error).message}\``
            })
        }
    });

    collector.on("end", (reason: string) => {
        if (reason !== "action") ctx.disableInteractionComponents();
    });
        


};
