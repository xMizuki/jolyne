import type { SlashCommand, UserData, Item, Shop } from '../../@types';
import { Message, MessageSelectMenu, MessageButton, MessageComponentInteraction, MessageActionRowComponentResolvable, SelectMenuInteraction, ButtonInteraction, MessageEditOptions, MessagePayload } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import type { Quest, Chapter } from '../../@types';
import * as Util from '../../utils/functions';
import * as Chapters from '../../database/rpg/Chapters';
import * as Emojis from '../../emojis.json';
import * as Items from '../../database/rpg/Items';
import * as Shops from '../../database/rpg/Shops';

export const name: SlashCommand["name"] = "shop";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 3;
export const data: SlashCommand["data"] = {
    name: "shop",
    description: "Display the shop",
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    const shopsArray = Object.values(Shops);
    const itemsArray = Object.values(Items);
    const fields: { value: string, name: string, inline?: boolean }[] = [];
    const goBackID = Util.generateID();
    const goBackBTN = new MessageButton()
        .setCustomId(goBackID)
        .setEmoji("◀️")
        .setStyle("SECONDARY");
    menuMessage();
    let currentShop: Shop;
    let followUpMessage: Message;

    async function followUp(content: MessageEditOptions | MessagePayload): Promise<void> {
        if (followUpMessage) {
            followUpMessage.edit(content);
        } else {
            followUpMessage = await ctx.followUp({
                ...content,
                fetchReply: true
            });
        }

    }
    
    function menuMessage(): void {
        const fields: { value: string, name: string, inline?: boolean }[] = [];
        const components: MessageActionRowComponentResolvable[] = [];
        for (const shop of shopsArray) {
            if (shop.open_date) {
                if ((shop.open_date as number) !== new Date().getDay() || (shop.open_date as `${number}-${number}`) !== `${new Date().getMonth() + 1}-${new Date().getDate()}`) {
                    continue;
                }
            }
            components.push(new MessageButton()
            .setLabel(shop.name)
            .setCustomId(Util.generateID())
            .setEmoji(shop.emoji)
            .setStyle("SECONDARY"))
            let content = '';
            for (const item of shop.items) {
                content += `${item.emoji} **${item.name}**: ${item.benefits ? Object.keys(item.benefits).map((v) => `\`${item.benefits[v as keyof typeof item.benefits]}\` ${v}`).join(', ') : item.description} | **${Util.localeNumber(item.price)}** ${Emojis.jocoins} ${item.storable ? '' : '- \`[NOT STORABLE]\`'}\n`;
            }
            fields.push({
                name: `${shop.emoji} ${shop.name}`,
                value: content
            });
        }
        ctx.makeMessage({
            embeds: [{
                title: ':shopping_cart: Global Shop',
                fields: fields,
                color: 'ORANGE'
            }],
            components: [
                Util.actionRow(components),
            ]
        });
    }
    function updShopMsg(shop: Shop): void {
        const ItemsSelectMenu = new MessageSelectMenu()
        .setMaxValues(1)
        .setMinValues(1)
        .setCustomId(shop.name)
        .setOptions(...shop.items.map((i) => {
            return {
                label: i.name,
                value: i.id,
                emoji: i.emoji
            }
        }));

        let content = '';
        for (const item of shop.items) {
            content += `${item.emoji} **${item.name}**: ${item.benefits ? Object.keys(item.benefits).map((v) => `\`${item.benefits[v as keyof typeof item.benefits]}\` ${v}`).join(', ') : item.description} | **${Util.localeNumber(item.price)}** ${Emojis.jocoins} ${item.storable ? '' : '- \`[NOT STORABLE]\`'}\n`;
        }
        ctx.makeMessage({
            embeds: [{
                title: `${shop.emoji} ${shop.name}`,
                description: content,
                color: 'ORANGE',
                footer: {
                    text: `You have ${Util.localeNumber(userData.money)} coins left`
                }
            }],
            components: [
                Util.actionRow([ ItemsSelectMenu ]),
                Util.actionRow([ goBackBTN])
            ]
        });


    }
    const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
        return i.user.id === userData.id
    };
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
    ctx.timeoutCollector(collector);

    collector.on('collect', async (i: MessageComponentInteraction) => {
        // Anti-cheat
        const AntiCheatResult = await ctx.componentAntiCheat(i, userData);
        if (AntiCheatResult === true) return collector.stop();

        ctx.timeoutCollector(collector);
        if (i.customId === goBackID) return menuMessage();
        const shop = shopsArray.find((s) => s.name === (i as ButtonInteraction).component.label);
        const item = (i as SelectMenuInteraction).values ? itemsArray.find((it) => it.id === (i as SelectMenuInteraction).values[0]) : null;

        if (shop) {
            currentShop = shop;
            updShopMsg(shop);
        }
        if (item && i.isSelectMenu()) {
            if (item.price > userData.money) {
                followUp({
                    content: `${Emojis.jocoins} | You need **${Util.localeNumber(item.price - userData.money)}** more coins to buy this item.`,
                });
                    
                return;
            }
            userData.money -= item.price;
            /*
            const components = ctx.fetchReply().then(m => m.components); // Update select menu's place holder
            ctx.makeMessage({
                components: components
            });*/
            if (item.storable) {
                userData.items.push(item.id);
                followUp({
                    content: `You bought ${item.emoji} **${item.name}** for **${Util.localeNumber(item.price)}** ${Emojis.jocoins}`,
                });    
            } else {
                if (item.use) {
                    item.use(ctx, userData);
                } else if (item.type === 'consumable') {
                    const changed: {
                        [key: string]: number
                    } = {};
                    Object.keys(item.benefits).forEach((v) => {
                        const oldValue = userData[v as keyof typeof userData];
                        // We add the value to the user data
                        // @ts-expect-error Cannot assign to 'id' because it is a read-only property.ts(2540), WHILE v CAN'T BE ID SMH
                        userData[v as keyof typeof userData] += item.benefits[v as keyof typeof item.benefits];
                        // We check if the value is over the max value
                        // @ts-expect-error Cannot assign to 'id' because it is a read-only property.ts(2540), WHILE v CAN'T BE ID SMH
                        if (userData[`max_${v}` as keyof typeof userData] && userData[`max_${v}` as keyof typeof userData] < userData[v as keyof typeof userData]) userData[v as keyof typeof userData] = userData[`max_${v}` as keyof typeof userData];
                        // We check if the value is < 0
                        // @ts-expect-error Cannot assign to 'id' because it is a read-only property.ts(2540), WHILE v CAN'T BE ID SMH
                        if (userData[`max_${v}` as keyof typeof userData] && userData[`max_${v}` as keyof typeof userData] < 0) userData[v as keyof typeof userData] = 0;
    
                        if (!changed[v]) changed[v] = 0;
                        // @ts-expect-error
                        changed[v] += (userData[v as keyof typeof userData] - oldValue);
                    });
                    followUp({
                        content: `You used **${item.name}**  ${item.emoji} and got: ${Object.keys(changed).map(v => `${changed[v] < 0 ? '-' : '+'}${changed[v]} ${v}`).join(", ")} (:heart: ${userData.health}/${userData.max_health}, :zap: ${userData.stamina}/${userData.max_stamina})`,
                    })
    
                } else { // not supported
                    followUp({
                        content: 'THIS ITEM IS NOT SUPPORTED OR AN ERROR OCCURED. PLEASE REPORT THIS IMMEDIATELY TO OUR DEVS.'
                    })
                    userData.money += item.price;
                }
            }

            updShopMsg(currentShop);
        }
        ctx.client.database.saveUserData(userData);
    });

};