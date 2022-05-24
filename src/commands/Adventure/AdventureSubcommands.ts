import type { SlashCommand, UserData } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';

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
        if (userData) return ctx.sendT("base:ALREADY_ADVENTURE");
        const firstComponent: object = {
            components: [{
                custom_id: ctx.interaction.id + ":agree",
                disabled: false,
                label: ctx.translate("adventure:AGREE"),
                style: 3,
                type: 2,
            }, {
                custom_id: ctx.interaction.id + ":disagree",
                disabled: false,
                label: ctx.translate("adventure:DISAGREE"),
                style: 4,
                type: 2,
            }],
            type: 1
        };
        await ctx.sendT("adventure:CONFIRM", {
            components: [firstComponent]
        });

        const filter = (i: MessageComponentInteraction) => i.user.id === ctx.interaction.user.id;
        const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 120000 });
        ctx.timeoutCollector(collector);
        ctx.client.database.setCooldownCache("adventure", ctx.interaction.user.id);

        collector.on("collect", async (i: MessageComponentInteraction) => {
            ctx.timeoutCollector(collector);
            i.deferUpdate().catch(() => {});
            ctx.client.database.delCooldownCache("adventure", ctx.interaction.user.id);

            if (i.customId === ctx.interaction.id + ":agree") {
                await ctx.client.database.getUserData(ctx.interaction.user.id, true);
                ctx.sendT("adventure:ADVENTURE_COMPLETE", {
                    components: []
                });
            } else {
                ctx.deleteReply();
                collector.stop();
            }
        });
    } else {
        if (!userData) return ctx.sendT("base:NO_ADVENTURE");
        const firstComponent: object = {
            components: [{
                custom_id: ctx.interaction.id + ":confirm",
                disabled: false,
                label: ctx.translate("base:CONFIRM"),
                style: 3,
                type: 2,
            }, {
                custom_id: ctx.interaction.id + ":cancel",
                disabled: false,
                label: ctx.translate("base:CANCEL"),
                style: 4,
                type: 2,
            }],
            type: 1
        };
        await ctx.sendT("adventure:ADVENTURE_RESET_BITE", {
            components: [firstComponent]
        });
        const filter = (i: MessageComponentInteraction) => i.user.id === ctx.interaction.user.id;
        const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 120000 });
        ctx.timeoutCollector(collector);

        collector.on("collect", async (i: MessageComponentInteraction) => {
            ctx.timeoutCollector(collector);
            i.deferUpdate().catch(() => {});
            if (i.customId === ctx.interaction.id + ":final_confirm") {
                await ctx.client.database.delUserData(ctx.interaction.user.id);
                ctx.sendT("adventure:ADVENTURE_RESET_MESSAGE", {
                    components: []
                });
            } else if (i.customId === ctx.interaction.id + ":confirm") {
                await ctx.sendT("adventure:ADVENTURE_RESET_CONFIRME_1", {
                    components: [{
                        components: [{
                            custom_id: ctx.interaction.id + ":final_confirm",
                            disabled: false,
                            label: ctx.translate("base:CONFIRM"),
                            style: 3,
                            type: 2,
                        }, {
                            custom_id: ctx.interaction.id + ":cancel",
                            disabled: false,
                            label: ctx.translate("base:CANCEL"),
                            style: 4,
                            type: 2,
                        }],
                        type: 1
                    }]
                });
            } else {
                ctx.deleteReply();
                collector.stop();
            }
        });

    }

};

