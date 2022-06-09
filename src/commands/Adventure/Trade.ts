import type { SlashCommand, UserData, Item } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable, MessageSelectOptionData } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import * as Items from '../../database/rpg/Items';

export const name: SlashCommand["name"] = "trade";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "trade",
    description: "Trade items with other players",
    options: [
        {
            name: "user",
            description: "The user whose profile you want to trade",
            required: true,
            type: 6
        }
    ]
};



export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData: UserData) => {
    let user = ctx.interaction.options.getUser('user');
    if (await ctx.client.database.getCooldownCache(user.id)) return ctx.interaction.reply({ content: `<:jolyne:924029173708779540> **${user.username}** is currently busy. Try again later.` })
    if (userData.level < 5) return ctx.interaction.reply({ content: `<:jolyne:924029173708779540> You must be level **5** or higher to trade` });
    let user_data = await ctx.client.database.getUserData(user.id);
    if (!user_data) return ctx.sendT("base:USER_NO_ADVENTURE");
    if (user.id === ctx.interaction.user.id) return ctx.interaction.reply({ content: `<:jolyne:924029173708779540>` });
    if (user_data.level < 5) return ctx.interaction.reply({ content: `<:jolyne:924029173708779540> **${user.username}** is not level **5**` });
    if (user_data.items.map(r => Util.getItem(r)).filter(i => i.tradable).length === 0) return ctx.interaction.reply({ content: `<:jolyne:924029173708779540> **${user.username}** doesn't have anything to trade.` });
    if (userData.items.map(r => Util.getItem(r)).filter(i => i.tradable).length === 0) return ctx.interaction.reply({ content: `<:jolyne:924029173708779540> You don't have anything to trade.` });

    let btns = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId(`${user.id}:yes`)
        .setLabel('Accept')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setCustomId(`${user.id}:no`)
        .setLabel('Decline')
        .setStyle('DANGER')
    );
    let btnss = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId(`${ctx.interaction.id}:confirm`)
        .setLabel('Confirm')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setCustomId(`${ctx.interaction.id}:decline`)
        .setLabel('Decline')
        .setStyle('DANGER')
    );


    const userOffers: string[] = [];
    const authorOffers: string[] = [];
    let authorRows: MessageSelectOptionData[] = [];
    let authorItemsRows = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId(`${ctx.interaction.id}:authorSL`)
        .setPlaceholder('Select an item.')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(authorRows),
    );
    let userRows: MessageSelectOptionData[] = [];
    let userItemsRows = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId(`${ctx.interaction.id}:userSL`)
        .setPlaceholder('Select an item.')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(userRows),
    );

    const authorItems: string[] = [];
    const userItems: string[] = [];
    let confirmed: any[] = [];
    let ended = false;
    loadAuthorItems()
    loadUserItems()



    await ctx.interaction.reply({ content: `<@${user.id}> | **${ctx.interaction.user.username}** would like to trade with you.`, components: [btns] });
    const filter = (i: MessageComponentInteraction) => i.user.id === user.id || i.user.id === ctx.interaction.user.id;
    const collector =  ctx.interaction.channel.createMessageComponentCollector({ filter, time: 60000 * 10 });
    collector.on("end", async () => {
        if (ended) return;
        ctx.client.database.delCooldownCache("trade", user.id);
        ctx.client.database.delCooldownCache("trade", ctx.interaction.user.id);
        ctx.interaction.editReply({ content: `Time's up.`, components: [], embeds: []})
        
    })
    collector.on('collect', async i => {
        //if (await ctx.client.database.redis.get(`jjba:trade:${user.id}`)) return;
        loadAuthorItems()
        loadUserItems()
            if (i.customId === `${user.id}:no` && i.user.id === user.id) {
            ctx.interaction.editReply({ content: `<:jolyne:924029173708779540> **${user.username}** declined.`, components: [] });
        }
        if (i.customId === `${ctx.interaction.id}:decline`) {
            ended = true;
            ctx.client.database.delCooldownCache("trade", user.id);
            ctx.client.database.delCooldownCache("trade", ctx.interaction.user.id);
            ctx.interaction.editReply({ content: `**${i.user.username}** cancelled.`, embeds: [], components: [] });
        }
        if (i.customId === `${user.id}:yes` && i.user.id === user.id) {
            if (await ctx.client.database.getCooldownCache(ctx.interaction.user.id) || await ctx.client.database.getCooldownCache(user.id)) {
                ctx.interaction.editReply({ content: `Too late.`, components: [] });
                return i.deferUpdate().catch(() => { });
            }
            ctx.client.database.setCooldownCache("trade", user.id);
            ctx.client.database.setCooldownCache("trade", ctx.interaction.user.id);
            ctx.interaction.editReply({ content: "Trading request accepted. Select one or more items and click on 'CONFIRM' when you both agree", embeds: [updateTradeEmbed()], components: [authorItemsRows, userItemsRows, btnss]})
        }
        if (i.customId === `${ctx.interaction.id}:confirm` && !confirmed.includes(i.user.id) && authorOffers.length !== 0 && userOffers.length !== 0) {
            confirmed.push(i.user.id);
            if (confirmed.length === 1) ctx.interaction.editReply({ content: `<@${confirmed[0]}> accepted. (1/2)` });
            else {
                ended = true;
                for (const i of authorOffers) {
                    user_data.items.push(i);
                };
                for (const i of userOffers) {
                    userData.items.push(i);
                };
                ctx.client.database.saveUserData(user_data);
                ctx.client.database.saveUserData(userData);
                ctx.client.database.delCooldownCache("trade", user.id);
                ctx.client.database.delCooldownCache("trade", ctx.interaction.user.id);
                ctx.interaction.editReply({ content: `Trade completed.`, components: [], embeds: [updateTradeEmbed()]})


            }
        }
        if (i.customId === `${ctx.interaction.id}:authorSL` && i.user.id === ctx.interaction.user.id && i.isSelectMenu()) {
            confirmed = [];
            if (i.values[0].includes("disk")) {
                if (user_data.items.filter(r => r.includes("disk")).length + authorOffers.filter(r => r.includes("disk")).length >= 3 && false) {
                    ctx.interaction.editReply({ content: `<:disk:929724918483013692> **${user.username}** has already 3 discs. They can't have more`});
                    return i.deferUpdate().catch(() => { });

                };
                if (user_data.items.filter(r => r.includes("disk")).length + authorOffers.filter(r => r.includes("disk")).length>= 6 && false) {
                    ctx.interaction.editReply({ content: `<:disk:929724918483013692> **${user.username}** has already 6 discs. They can't have more`})
                    return i.deferUpdate().catch(() => { });
                } 
            }
            userData.items = Util.removeItem(userData.items, i.values[0]);
            loadAuthorItems()
            authorOffers.push(i.values[0]);
            if (authorRows.length === 0 && userRows.length === 0) ctx.interaction.editReply({ content: "Trading request accepted. Select one or more items and click on 'CONFIRM' when you both agree", embeds: [updateTradeEmbed()], components: [btnss]})
            else if (authorRows.length === 0) ctx.interaction.editReply({ content: "Trading request accepted. Select one or more items and click on 'CONFIRM' when you both agree", embeds: [updateTradeEmbed()], components: [userItemsRows, btnss]})
            else if (userRows.length === 0) ctx.interaction.editReply({ content: "Trading request accepted. Select one or more items and click on 'CONFIRM' when you both agree", embeds: [updateTradeEmbed()], components: [authorItemsRows, btnss]})
            else ctx.interaction.editReply({ content: "Select one or more items and click on 'CONFIRM' when you both agree", embeds: [updateTradeEmbed()], components: [authorItemsRows, userItemsRows, btnss]})
        }
        if (i.customId === `${ctx.interaction.id}:userSL` && i.user.id === user.id && i.isSelectMenu()) {
            confirmed = [];
            if (i.values[0].includes("disk")) {
                if (userData.items.filter(r => r.includes("disk")).length + userOffers.filter(r => r.includes("disk")).length >= 3 && false) {
                    await ctx.interaction.editReply({ content: `<:disk:929724918483013692> **${ctx.interaction.user.username}** has already 3 discs. They can't have more`})
                    return i.deferUpdate().catch(() => { });
                };
                if (userData.items.filter(r => r.includes("disk")).length + userOffers.filter(r => r.includes("disk")).length>= 6 && false) {
                    await ctx.interaction.editReply({ content: `<:disk:929724918483013692> **${ctx.interaction.user.username}** has already 6 discs. They can't have more`})
                    return i.deferUpdate().catch(() => { });
                } 
            }

            user_data.items = Util.removeItem(user_data.items, i.values[0]);
            loadUserItems()
            userOffers.push(i.values[0]);
            if (authorRows.length === 0 && userRows.length === 0) ctx.interaction.editReply({ content: "Trading request accepted. Select one or more items and click on 'CONFIRM' when you both agree", embeds: [updateTradeEmbed()], components: [btnss]})
            else if (authorRows.length === 0) ctx.interaction.editReply({ content: "Trading request accepted. Select one or more items and click on 'CONFIRM' when you both agree", embeds: [updateTradeEmbed()], components: [userItemsRows, btnss]})
            else if (userRows.length === 0) ctx.interaction.editReply({ content: "Trading request accepted. Select one or more items and click on 'CONFIRM' when you both agree", embeds: [updateTradeEmbed()], components: [authorItemsRows, btnss]})
            else ctx.interaction.editReply({ content: "Select one or more items and click on 'CONFIRM' when you both agree", embeds: [updateTradeEmbed()], components: [authorItemsRows, userItemsRows, btnss]})
        }

        i.deferUpdate().catch(() => { })
    });


    function updateTradeEmbed() {
        const fixedAuthorItems: string[] = [];
        const fixedUserItems: string[] = [];

        const authorContent = authorOffers.map(v => {
            if (fixedAuthorItems.includes(v)) return;
            fixedAuthorItems.push(v)
            return `${Util.getItem(v).emoji} ${Util.getItem(v).name} (x${authorOffers.filter(r => r === v).length})`
        }).filter(r => r !== undefined);
        const userContent = userOffers.map(v => {
            if (fixedUserItems.includes(v)) return;
            fixedUserItems.push(v);
            return `${Util.getItem(v).emoji} ${Util.getItem(v).name} (x${userOffers.filter(r => r === v).length})`
        }).filter(r => r !== undefined);

        if (ended) {
            const embed = new MessageEmbed()
            .addField(`${user.username} received:`, authorContent.join("\n").length !== 0 ? authorContent.join("\n") : "None")
            .addField(`${ctx.interaction.user.username} received:`, userContent.join("\n").length !== 0 ? userContent.join("\n") : "None")
            .setColor(ended ? "GREEN" : "YELLOW")
            .setTimestamp()

            const ch = ctx.client.channels.cache.get("946353079928909824");
            /*
            if (!ch?.isText()) return;
            ch?.send({ embeds: [new MessageEmbed()
                .addField(`${user.tag} (${user.id}) received:`, authorContent.join("\n").length !== 0 ? authorContent.join("\n") : "None")
                .addField(`${ctx.interaction.user.tag} (${ctx.interaction.user.id}) received:`, userContent.join("\n").length !== 0 ? userContent.join("\n") : "None")
                .setColor(ended ? "GREEN" : "YELLOW")
                .setTimestamp()]})*/
            return embed
        }

        return new MessageEmbed()
        .addField(`${ctx.interaction.user.username}'s offers`, authorContent.join("\n").length !== 0 ? authorContent.join("\n") : "None")
        .addField(`${user.username}'s offers`, userContent.join("\n").length !== 0 ? userContent.join("\n") : "None")
        .setColor(ended ? "GREEN" : "YELLOW")

    }

    function loadAuthorItems() {
        authorRows = [];
        userData.items.forEach(async i => {
            if (authorItems.filter(r => r === i).length === 0) authorItems.push(i);
        });
        authorItems.forEach(async i => {
            if (userData.items.filter(r => r === i).length === 0) return
            if (!Util.getItem(i)) return;
            if (Util.getItem(i).tradable === false) return;
            authorRows.push({
                label: Util.getItem(i).name + ` (x${userData.items.filter(r => r === i).length})`,
                description: Util.getItem(i).description,
                value: i,
                emoji: Util.getItem(i).emoji
            })
        });
        authorItemsRows = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId(`${ctx.interaction.id}:authorSL`)
            .setPlaceholder(`${ctx.interaction.user.username}'s items`)
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(authorRows),
        );

    }
    function loadUserItems() {
        userRows = [];
        user_data.items.forEach(async i => {
            if (userItems.filter(r => r === i).length === 0) userItems.push(i);
        });
        userItems.forEach(async i => {
            if (user_data.items.filter(r => r === i).length === 0) return
            if (!Util.getItem(i)) return
            if (!Util.getItem(i)) return;
            if (Util.getItem(i)?.tradable === false) return;
            userRows.push({
                label: Util.getItem(i).name + ` (x${user_data.items.filter(r => r === i).length})`,
                description: Util.getItem(i).description,
                value: i,
                emoji: Util.getItem(i).emoji
            })
        });
        userItemsRows = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId(`${ctx.interaction.id}:userSL`)
            .setPlaceholder(`${user.username}'s items`)
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(userRows),
        );

    }

};
