import type { SlashCommand, UserData, Item } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../structures/Interaction';
import * as Stands from '../database/rpg/Stands';
import * as Util from '../utils/functions';
import * as Emojis from '../emojis.json';
import * as Items from '../database/rpg/Items';

export const name: SlashCommand["name"] = "items";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "items",
    description: "[SUB-COMMANDS]",
    options: [{
        type: 1,
        name: "use",
        description: "Use an item from your inventory",
        options: [{
            type: 3,
            name: "item",
            description: "Select an item",
            required: true,
            autocomplete: true
        }, {
            type: 4,
            name: 'uses',
            description: 'How much times would you like to use the item?',
            required: false
        }]
    }, {
        type: 1,
        name: "list",
        description: "Show your inventory",
        options: []
    }, {
        type: 1,
        name: "info",
        description: "Shows information about an item",
        options: [{
            type: 3,
            name: "item",
            description: "Select an item",
            required: true,
            autocomplete: true
        }]
    }]
};



export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    const itemOption = ctx.interaction.options.getString("item");
    if (itemOption && ctx.interaction.options.getSubcommand() === "info") {
        const item:Item = Items[Object.keys(Items).filter(r => Items[r as keyof typeof Items].description === itemOption)[0] as keyof typeof Items];
        const betterTrueFalse = (v: boolean) => v ? ":white_check_mark:" : ":x:";
        let color: ColorResolvable;
        if (item.usable && item.tradable && item.storable) {
            color = "GREEN";
        } else if (item.usable && item.tradable) {
            color = "YELLOW";
        } else if (item.usable && item.storable) {
            color = "BLUE";
        } else if (item.tradable && item.storable) {
            color = "PURPLE";
        } else if (item.usable) {
            color = "RED";
        } else if (item.tradable) {
            color = "ORANGE";
        } else if (item.storable) {
            color = "LUMINOUS_VIVID_PINK";
        } else {
            color = "GREY";
        }
        console.log(color);
        return await ctx.makeMessage({
            embeds: [{
                title: item.emoji + " " + item.name,
                description: item.description,
                color: color,
                fields: [{
                    name: "Usable?",
                    value: betterTrueFalse(item.usable),
                    inline: true
                }, {
                    name: "Storable?",
                    value: betterTrueFalse(item.storable),
                    inline: true
                }, {
                    name: "Tradable?",
                    value: betterTrueFalse(item.tradable),
                    inline: true
                }, {
                    name: "Buyable in shop?",
                    value: item.shop ? `Yes: ${item.shop}` : ":x:",
                    inline: true
                }, {
                    name: "Value",
                    value: item.cost ? Util.localeNumber(item.cost) + " " + Emojis.jocoins : "None"
                }
            ]
            }]
        })
    }
    const userItems: Item[] = userData.items.map(v => {
        if (!Util.getItem(v)) return
        return Util.getItem(v);
    }).filter(r => r && r.usable);
    if (ctx.interaction.options.getSubcommand() === "use") {
        if (userItems.length === 0) return ctx.sendT("base:NO_ITEMS");
        const item = Util.getItem(ctx.interaction.options.getString("item").split("(")[0].trim());
        if (!item) return ctx.makeMessage({ content: "NO WAT!!!"})
        const uses = ctx.interaction.options.getInteger("uses") ?? 1;
        if (uses > userData.items.filter((r: string) => Util.getItem(r)?.name === item.name).length) return ctx.makeMessage({ content: `You don't have ${uses} ${item.emoji} ${item.name}, but ${userData.items.filter((r: string) => Util.getItem(r)?.name === item.name).length}` });
        if (item.type === "consumable") {
            const changed: any = {};
            for (let i = 0; i < uses; i ++) {
                Util.removeItem(userData.items, item.id as string);
                Object.keys(item.benefits).forEach((v) => {
                    const oldValue = userData[v as keyof typeof userData];
                    // We add the value to the user data
                    // @ts-expect-error Cannot assign to 'id' because it is a read-only property.ts(2540), WHILE v CAN'T BE ID SMH
                    userData[v as keyof typeof userData] += item.benefits[v as keyof typeof item.benefits];
                    // We check if the value is over the max value
                    // @ts-expect-error Cannot assign to 'id' because it is a read-only property.ts(2540), WHILE v CAN'T BE ID SMH
                    if (userData[`max_${v}` as keyof typeof userData] && userData[`max_${v}` as keyof typeof userData] < userData[v as keyof typeof userData]) userData[v as keyof typeof userData] = userData[`max_${v}` as keyof typeof userData];
                    if (!changed[v]) changed[v] = 0;
                    changed[v] += (userData[v as keyof typeof userData] - oldValue);
                });
            }
            ctx.makeMessage({
                content: `You used x${uses} **${item.name}**  ${item.emoji} and got: ${Object.keys(changed).map(v => `+${changed[v]} ${v}`).join(", ")}`,
            })

        } else if (item.type === "arrow") {
            const response = await item.use(ctx, userData);
            if (response) Util.removeItem(userData.items, item.id as string);    
        } else {
            for (let i = 0; i < uses; i ++) {
                console.log(uses > 2 ? true : false, uses-i);
                const response = await item.use(ctx, userData, (uses > 2 ? true : false), uses-i);
                if (response) Util.removeItem(userData.items, item.id as string);    
                else break; // an error occured, so we stop
                await Util.wait(2000);
            }
        }
        ctx.client.database.saveUserData(userData);
                
    } else { // If command === list
        const userUniqueItems: Item[] = [...new Set(userItems)];    
        let content: Array<any> = [[""]];
        for (let i = 0; i < userUniqueItems.length; i++) {
            let v = userUniqueItems[i];
            if (!v) continue;
            let emoji = i !== userUniqueItems.length -1 ? "<:reply:936903236395360256>" : "<:replyEnd:936903465941217301>";
            if ((content[content.length-1] + `${emoji} \`${v.name} (x${userData.items.filter((r: string) => Util.getItem(r)?.name).length})\` ${v.emoji}\n`).length > 1024) {
                content[content.length-1] = content[content.length-1].split("\n");
                let ab = content[content.length-1]
                content[content.length-1][ab.length-1] = content[content.length-1][ab.length-1].replace("<:reply:936903236395360256>", "<:replyEnd:936903465941217301>");
                content[content.length-1] = content[content.length-1].join("\n");
                content.push([""]);
            }
            content[content.length-1] += `${emoji} \`${v.name} (x${userData.items.filter((r: string) => Util.getItem(r)?.name === v.name).length})\` ${v.emoji}\n`;
        };
        if (content.length === 1) {
            ctx.makeMessage({
                embeds: [{
                    fields: [{
                        name: `<:inventory:936907921164472360> **Inventory:**`,
                        value: content[0]
                    }],
                    timestamp: new Date(),
                    color: "#2f3136"
                }]
            })
        } else {
            let currentPage = 1;
            let btns = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId(`${ctx.interaction.id}:back`)
                .setEmoji('943188053390929940')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId(`${ctx.interaction.id}:next`)
                .setEmoji(`943187898495303720`)
                .setStyle('PRIMARY')
            ); 
            function goToPage(which: number) {
                ctx.makeMessage({ components: [btns], embeds: [{
                    fields: [{
                        name: `<:inventory:936907921164472360> **Inventory:**`,
                        value: content[which-1]
                    }],
                    footer: { text:  `Page ${which}/${content.length}`},
                    color: "#2f3136"
                    //description: content
                }]});
            }
            goToPage(currentPage);
            const filter = (i: MessageComponentInteraction) => i.user.id === ctx.interaction.user.id && i.customId.startsWith(ctx.interaction.id);
            const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
            ctx.timeoutCollector(collector);   

            return collector.on("collect", async (i: MessageComponentInteraction) => {
                ctx.timeoutCollector(collector);   
                await i.deferUpdate();
                if (i.customId === ctx.interaction.id+":back" && currentPage !== 1) {
                    goToPage(currentPage-1);
                    currentPage--;
                }
                if (i.customId === ctx.interaction.id+":next" && currentPage !== content.length) {
                    goToPage(currentPage+1);
                    currentPage++;
                }
            });

        }
    }
};
