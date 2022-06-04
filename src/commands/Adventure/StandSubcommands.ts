import type { SlashCommand, UserData, Stand } from '../../@types';
import { MessageAttachment, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable, Message } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import * as Items from '../../database/rpg/Items';
import * as NPCs from '../../database/rpg/NPCs';

export const name: SlashCommand["name"] = "stand";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "stand",
    description: "[SUB-COMMANDS]",
    options: [{
        type: 1,
        name: "display",
        description: "🔱 Display informations about your current stand",
        options: []
    }, {
        type: 1,
        name: "delete",
        description: "❌ Deletes your stand",
        options: []
    }, {
        type: 1,
        name: "store",
        description: "💿 Stores your stand's disk...",
        options: []
    }]
};



export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData: UserData) => {
    if (!userData.stand) return ctx.sendT('base:NO_STAND');
    const switchID = Util.generateID();
    const confirmID = Util.generateID();
    const cancelID = Util.generateID();

    const confirmBTN = new MessageButton()
        .setLabel('Confirm')
        .setStyle('SUCCESS')
        .setCustomId(confirmID);
    const cancelBTN = new MessageButton()
        .setLabel('Cancel')
        .setStyle('DANGER')
        .setCustomId(cancelID);
    const switchBTN = new MessageButton()
        .setEmoji('🎴')
        .setStyle('SECONDARY')
        .setCustomId(switchID);

    switch (ctx.interaction.options.getSubcommand()) {
        case "display": {
            const stand = Util.getStand(userData.stand);
            const standCartBuffer = await Util.generateStandCart(Util.getStand(userData.stand));
            const file = new MessageAttachment(standCartBuffer, "stand.png");

            let color: ColorResolvable;

            switch (stand.rarity) {
                case "SS":
                    color = 0xff0000;
                    break;
                case "S":
                    color = "#2b82ab";
                    break;
                case "A":
                    color = "#3b8c4b";
                    break;
                case "B":
                    color = "#786d23";
                    break;
                default:
                    color = stand.color;
            }
            
            const embed: MessageEmbed = new MessageEmbed()
            .setTitle(stand.name)
            .setImage('attachment://stand.png')
            .setColor(color)
            .setDescription(`**Rarity:** ${stand.rarity}
        **Abilities [${stand.abilities.length}]:** ${stand.abilities.map(v => v.name).join(", ")}
        **Skill-Points:** +${Util.calculateArrayValues(Object.keys(stand.skill_points).map(v => stand.skill_points[v as keyof typeof stand.skill_points]))}:
        ${Object.keys(stand.skill_points).map(v => "  • +" + stand.skill_points[v as keyof typeof stand.skill_points] + " " + v).join("\n")}
        `);
            sendStandPage(stand, userData);
            const filter = (i: MessageComponentInteraction) => {
                i.deferUpdate().catch(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
                return i.customId === switchID && i.user.id === ctx.author.id;
            }
            const collector = ctx.interaction.channel.createMessageComponentCollector({
                filter
            });
            ctx.timeoutCollector(collector);
            let status = 0;
            collector.on('collect', (i: MessageComponentInteraction) => {
                ctx.timeoutCollector(collector);
                if (status % 2 === 0) {
                    ctx.makeMessage({
                        files: [file],
                        embeds: [embed]
                    });
                } else {
                    sendStandPage(stand, userData);
                }
                status++;
            });
            break;
        }
        case "store": {
            if (!userData.stand) return ctx.sendT('base:NO_STAND');
            const stand = Util.getStand(userData.stand);

            await ctx.makeMessage({
                content: `<:Pucci:929295630885593148> **Pucci:** So you want to remove your stand's disc and store it into your inventory... Since your stand's rarity is **${stand.rarity}**, it'll cost you **${Util.localeNumber(Util.standPrices[stand.rarity])}** <:jocoins:927974784187392061>. Are you sure ? `,
                components: [
                    Util.actionRow([ confirmBTN, cancelBTN ])
                ]
            });
            const filter = (i: MessageComponentInteraction) => {
                i.deferUpdate().catch(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
                return (i.customId === confirmID || i.customId === cancelID) && i.user.id === ctx.author.id;
            }
            const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
            ctx.timeoutCollector(collector);
            collector.on('collect', async (i: MessageComponentInteraction) => {
                if ((await ctx['componentAntiCheat'](i, userData)) === true) return;
                if (i.customId === confirmID) {
                    collector.stop('DONT_DISABLE_COMPONENTS');
                    if (userData.money < Util.standPrices[stand.rarity]) {
                        ctx.sendT('base:NOT_ENOUGH_COINS', {
                            components: []
                        });
                        return;
                    }
                    userData.money -= Util.standPrices[stand.rarity];
                    userData.stand = null;
                    userData.items.push(`${stand.name}:disk`);
                    ctx.client.database.saveUserData(userData);
                    ctx.sendT('base:YOUR_STAND_DISC_HAS_BEEN_STORED', {
                        components: []
                    });
                } else collector.stop();
            });
            break;
        }        
        case "delete": {
            if (!userData.stand) return ctx.sendT('base:NO_STAND');
            const stand = Util.getStand(userData.stand);
            const price = 1000;

            await ctx.makeMessage({
                content: `${Util.makeNPCString(NPCs.Pucci)}: It'll cost you **${Util.localeNumber(price)}** ${Emojis.jocoins} to reset your stand (${stand.name}). Are you sure?`,
                components: [
                    Util.actionRow([ confirmBTN, cancelBTN ])
                ]
            });
            const filter = (i: MessageComponentInteraction) => {
                i.deferUpdate().catch(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
                return (i.customId === confirmID || i.customId === cancelID) && i.user.id === ctx.author.id;
            }
            const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
            ctx.timeoutCollector(collector);
            collector.on('collect', async (i: MessageComponentInteraction) => {
                if ((await ctx['componentAntiCheat'](i, userData)) === true) return;
                if (i.customId === confirmID) {
                    collector.stop('DONT_DISABLE_COMPONENTS');
                    if (userData.money < price) {
                        ctx.sendT('base:NOT_ENOUGH_COINS', {
                            components: []
                        });
                        return;
                    }
                    userData.money -= price;
                    userData.stand = null;
                    ctx.client.database.saveUserData(userData);
                    ctx.sendT('base:YOUR_STAND_HAS_BEEN_RESET', {
                        components: []
                    });
                } else collector.stop();
            });
            break;
        }
      
    }

    function sendStandPage(stand: Stand, userData: UserData): Promise<Message<boolean>> {
        const fields: Array<{
            name: string;
            value: string;
            inline?: boolean;
        }> = [];
    
        for (const ability of stand.abilities) {
            const damage: number = Util.calcAbilityDMG(ability, userData);
            fields.push({
                name: `${ability.ultimate ? "⭐" : ""}${ability.name}`,
                inline: ability.ultimate ? false : true,
                value: `**\`Damages:\`** ${damage}
**\`Stamina Cost:\`** ${ability.stamina}
**\`Cooldown:\`** ${ability.cooldown} turns
                        
*${ability.description}*
${ability.ultimate ? "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬" : "▬▬▬▬▬▬▬▬▬"}`
            });
        }
        const embed = new MessageEmbed()
        .setAuthor({ name: stand.name, iconURL: stand.image })
        .addFields(fields)
        .setDescription(stand.description + "\n" + `
**BONUSES:** +${Object.keys(stand.skill_points).map(v => stand.skill_points[v as keyof typeof stand.skill_points]).reduce((a, b) => a + b, 0)} Skill-Points:
${Object.keys(stand.skill_points).map(r =>  `  • +${stand.skill_points[r as keyof typeof stand.skill_points]} ${r}`).join("\n")}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    `)
        .setFooter({ text: `Rarity: ${stand.rarity}` })
        .setColor(stand.color)
        .setThumbnail(stand.image);
        return ctx.makeMessage({
            embeds: [embed],
            files: [],
            components: [
                Util.actionRow([ switchBTN ])
            ]
        });
    }



};

