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
    if (await ctx.client.database.getCooldownCache(user.id)) return ctx.makeMessage({ content: `<:jolyne:924029173708779540> **${user.username}** is currently busy. Try again later.` })
    if (userData.level < 5) return ctx.makeMessage({ content: `<:jolyne:924029173708779540> You must be level **5** or higher to trade` });
    let user_data = await ctx.client.database.getUserData(user.id);
    if (!user_data) return ctx.sendT("base:USER_NO_ADVENTURE");
    // if (user.id === ctx.interaction.user.id) return ctx.makeMessage({ content: `<:jolyne:924029173708779540>` });
    if (user_data.level < 5) return ctx.makeMessage({ content: `<:jolyne:924029173708779540> **${user.username}** is not level **5**` });
    if (user_data.items.map(r => Util.getItem(r)).filter(i => i.tradable).length === 0) return ctx.makeMessage({ content: `<:jolyne:924029173708779540> **${user.username}** doesn't have anything to trade.` });
    if (userData.items.map(r => Util.getItem(r)).filter(i => i.tradable).length === 0) return ctx.makeMessage({ content: `<:jolyne:924029173708779540> You don't have anything to trade.` });

    const acceptID = Util.generateID();
    const declineID = Util.generateID();

    const acceptBTN = new MessageButton()
        .setCustomId(acceptID)
        .setLabel('Accept')
        .setStyle('SUCCESS');
    const declineBTN = new MessageButton()
        .setCustomId(declineID)
        .setLabel('Decline')
        .setStyle('DANGER');

    ctx.makeMessage({
        content: `${user.toString()} | **${ctx.author.tag}** wants to trade with you.`,
        components: [
            Util.actionRow([ acceptBTN, declineBTN ])
        ]
    });
    
    const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => { });
        return (i.user.id === ctx.author.id || i.user.id === user.id);
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
    ctx.timeoutCollector(collector);

    const callback = async (i: MessageComponentInteraction) => {
        if (i.user.id === user.id) {
            collector.removeListener('collect', callback);
            switch (i.customId) {
                case acceptID:
                    if ((await ctx['componentAntiCheat'](i, userData)) === true || (await ctx['componentAntiCheat'](i, user_data)) === true) {
                        ctx.makeMessage({
                            content: 'Too late.',
                        });
                        collector.stop();
                    }
                    ctx.client.database.setCooldownCache('trade', user.id);
                    ctx.client.database.setCooldownCache('trade', ctx.author.id);
                    startTrade()
                    break;
                case declineID:
                    collector.stop();
                    ctx.makeMessage({
                        content: `${Emojis.jolyne} **${user.tag}** cancelled the trade.`
                    });
                    break;
            }
        }

    }

    collector.on('collect', callback);

    function startTrade(): void {
        let authorOffers: Item[] = [];
        let userOffers: Item[] = [];
        
        userData.items = userData.items.map(i => Util.getItem(i).id);
        user_data.items = user_data.items.map(i => Util.getItem(i).id);
    
    
        const authorItemsID = Util.generateID();
        const userItemsID = Util.generateID();
        const goBackID = Util.generateID();
    
        const goBackBTN = new MessageButton()
            .setLabel('Go back')
            .setStyle('SECONDARY')
            .setCustomId(goBackID);
    
        const acceptID = Util.generateID();
        const declineID = Util.generateID();
    
        const acceptBTN = new MessageButton()
            .setCustomId(acceptID)
            .setLabel('Accept')
            .setStyle('SUCCESS');
        const declineBTN = new MessageButton()
            .setCustomId(declineID)
            .setLabel('Decline')
            .setStyle('DANGER');
    
        const authorItemsSelectMenu = () => {
            const authorItems: Item[] = userData.items.map(v => {
                if (!Util.getItem(v)) return
                return Util.getItem(v);
            }).filter(r => r && r.tradable);    
            const authorUniqueItems: Item[] = [...new Set(authorItems)];    
            return new MessageSelectMenu()
                .setCustomId(authorItemsID)
                .setPlaceholder(`${ctx.author.username}'s Items`)
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(authorUniqueItems.map(i => {
                    return {
                        label: i.name + ` (${authorItems.filter(r => r.id === i.id).length} left)`,
                        description: i.description,
                        value: i.id,
                        emoji: i.emoji
                    }
                }))
        }
        const userItemsSelectMenu = () => {
            const userItems: Item[] = user_data.items.map(v => {
                if (!Util.getItem(v)) return
                return Util.getItem(v);
            }).filter(r => r && r.tradable);    
            const userUniqueItems: Item[] = [...new Set(userItems)];    
            return new MessageSelectMenu()
                .setCustomId(userItemsID)
                .setPlaceholder(`${user.username}'s Items`)
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(userUniqueItems.map(i => {
                    return {
                        label: i.name + ` (${userItems.filter(r => r.id === i.id).length} left)`,
                        description: i.description,
                        value: i.id,
                        emoji: i.emoji
                    }
                }))
        }
        let accepted: string[] = [];

        collector.on('collect', (i: MessageComponentInteraction) => {
            if (i.customId !== acceptID) accepted = []
            switch (i.customId) {
                case authorItemsID:
                    if (!i.isSelectMenu() || i.user.id !== ctx.author.id) return;
                    if (!userData.items.find(r => r === i.values[0])) return;
                    authorOffers.push(Util.getItem(i.values[0]));
                    Util.removeItem(userData.items, i.values[0]);
                    loadEmbed();
                    break;
                case userItemsID:
                    if (!i.isSelectMenu() || i.user.id !== user.id) return;
                    if (!user_data.items.find(r => r === i.values[0])) return;
                    userOffers.push(Util.getItem(i.values[0]));
                    Util.removeItem(user_data.items, i.values[0]);
                    loadEmbed();
                    break;
                case goBackID:
                    if (i.user.id === user.id) {
                        console.log(userOffers);
                        const itemID = userOffers[userOffers.length - 1].id;
                        userOffers = userOffers.slice(0, userOffers.length - 1);
                        user_data.items.push(itemID);
                    } else {
                        const itemID = authorOffers[authorOffers.length - 1].id;
                        authorOffers = authorOffers.slice(0, authorOffers.length - 1);
                        userData.items.push(itemID);
                    }
                    loadEmbed();
                    break;
                case acceptID:
                    if (userOffers.length === 0 || authorOffers.length === 0) {
                        ctx.makeMessage({
                            content: "One of you didn't offer anything."
                        });
                        return;
                    }
                    if (accepted.find(r => r === i.user.id)) return;
                    accepted.push(i.user.id);
                    ctx.makeMessage({
                        content: `**${i.user.username}** accepted (${accepted.length}/2). ${accepted.length === 2 ? 'Trade completed.' : ''}`
                    });
                    if (accepted.length === 2) {
                        collector.stop();
                        for (const item of userOffers) {
                            userData.items.push(item.id);
                        }
                        for (const item of authorOffers) {
                            user_data.items.push(item.id);
                        }
                        ctx.client.database.saveUserData(userData);
                        ctx.client.database.saveUserData(user_data);
                    }
                    break;
                case declineID:
                    ctx.makeMessage({
                        content: `**${i.user.username}** declined.`
                    });
                    collector.stop();
                    break;
            }
        });
        collector.on('end', () => {
            ctx.client.database.delCooldownCache('trade', user.id);
            ctx.client.database.delCooldownCache('trade', userData.id);
        });
    
        loadEmbed();
    
        function loadEmbed(): void {
            ctx.makeMessage({
                content: "Trading request accepted. Select one or more items and click on 'CONFIRM' when you both agree",
                embeds: [{
                    fields: [{
                        name: `${ctx.author.username}'s Items`,
                        value: [...new Set(authorOffers)].map(i => `${i.emoji} ${i.name} (x${authorOffers.filter(r => r.id === i.id).length})`).join("\n").length !== 0  ? [...new Set(authorOffers)].map(i => `${i.emoji} ${i.name} (x${authorOffers.filter(r => r.id === i.id).length})`).join("\n") : 'None'
                    }, {
                        name: `${user.username}'s Items`,
                        value: [...new Set(userOffers)].map(i => `${i.emoji} ${i.name} (x${userOffers.filter(r => r.id === i.id).length})`).join("\n").length !== 0 ? [...new Set(userOffers)].map(i => `${i.emoji} ${i.name} (x${userOffers.filter(r => r.id === i.id).length})`).join("\n") : 'None'
                    }]
                }],
                components: [
                    Util.actionRow([ authorItemsSelectMenu() ]),
                    Util.actionRow([ userItemsSelectMenu() ]),
                    Util.actionRow([ acceptBTN, goBackBTN, declineBTN ])
                ]
            })
        }    
    }

};
