import type { SlashCommand, UserData, Item } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import type { Quest, Chapter } from '../../@types';
import * as Util from '../../utils/functions';
import * as Items from '../../database/rpg/Items';
import * as Emojis from '../../emojis.json';
import * as Quests from '../../database/rpg/Quests';

export const name: SlashCommand["name"] = "loot";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 3;
export const rpgCooldown: SlashCommand["rpgCooldown"] = {
    base: 1800000 / 2,
    premium: 1800000 / 4
}
export const data: SlashCommand["data"] = {
    name: "loot",
    description: "lootlootlootloot",
};

interface Loot {
    pr: string,
    name: string,
    emoji: string,
    loots: {
        percent: number,
        loot: Item | number
    }[]
}

export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {

    const rng: Loot[] = [{
        pr: "in a",
        name: "wallet",
        emoji: "👛",
        loots: [{
            percent: 50,
            loot: Util.getRandomInt(1, 1000)
        }, {
            percent: 70,
            loot: Items.Candy
        }]
    }, {
        pr: "in the",
        name: "train",
        emoji: "🚂",
        loots: [{
            percent: 3,
            loot: Items.Mysterious_Arrow
        }, {
            percent: 10,
            loot: Items.Money_Box
        }, {
            percent: 20,
            loot: Items.Box
        }, {
            percent: 60,
            loot: Util.randomFood()
        }]

    }, {
        pr: 'in the',
        name: 'sewer',
        emoji: '🕳️',
        loots: [{
            percent: 4,
            loot: Items.Mysterious_Arrow
        }, {
            percent: 10,
            loot: Items.Money_Box
        }, {
            percent: 20,
            loot: Items.Box
        }, {
            percent: 30,
            loot: Items.Dead_Rat
        }, {
            percent: 40,
            loot: Items.Slice_Of_Pizza
        }]
    }, {
        pr: 'in an',
        name: 'urn',
        emoji: '⚱️',
        loots: [{
            percent: 70,
            loot: Util.getRandomInt(1, 1000)
        }, {
            percent: 100,
            loot: Util.randomFood()
        }]
    }, {
        pr: 'in the',
        name: 'park',
        emoji: '🏞️',
        loots: [{
            percent: 3,
            loot: Items.Mysterious_Arrow
        }, {
            percent: 20,
            loot: Items.Ancient_Scroll
        }, {
            percent: 30,
            loot: Items.Diamond
        }, {
            percent: 100,
            loot: Util.randomFood()
        }]
    }, {
        pr: 'behind a',
        name: 'tree',
        emoji: '🌲',
        loots: [{
            percent: 3,
            loot: Items.Mysterious_Arrow
        }, {
            percent: 20,
            loot: Items.Ancient_Scroll
        }]
    }, {
        pr: 'behind a',
        name: 'store',
        emoji: '🏪',
        loots: [{
            percent: 3,
            loot: Items.Mysterious_Arrow
        }, {
            percent: 20,
            loot: Items.Ancient_Scroll
        }]
    }];
    const shuffledLoots: Loot[] = Util.shuffle(rng);
    const choice1ID = Util.generateID();
    const choice2ID = Util.generateID();
    const choice3ID = Util.generateID();
    const choice1BTN = new MessageButton()
        .setLabel(Util.capitalize(shuffledLoots[0].name))
        .setCustomId(choice1ID)
        .setEmoji(shuffledLoots[0].emoji)
        .setStyle("SECONDARY");
    const choice2BTN = new MessageButton()
        .setLabel(Util.capitalize(shuffledLoots[1].name))
        .setCustomId(choice2ID)
        .setEmoji(shuffledLoots[1].emoji)
        .setStyle("SECONDARY");
    const choice3BTN = new MessageButton()
        .setLabel(Util.capitalize(shuffledLoots[2].name))
        .setCustomId(choice3ID)
        .setEmoji(shuffledLoots[2].emoji)
        .setStyle("SECONDARY");
    
    await ctx.makeMessage({
        embeds: [{
            author: { name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL({ dynamic: true }) },
            description: `Where do you want to search ?`,
            color: "#2f3136"
        }],
        components: [Util.actionRow([choice1BTN, choice2BTN, choice3BTN])]
    });
    const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
        return i.user.id === userData.id && (i.customId === choice1ID || i.customId === choice2ID || i.customId === choice3ID);
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 120000 });
    collector.on('collect', async (i: MessageComponentInteraction) => {
        collector.stop();
        if (!i.isButton()) return;
        // Anti-cheat
        const AntiCheatResult = await ctx.componentAntiCheat(i, userData);
        if (AntiCheatResult === true) {
            return;
        }
        const choosedLoot = shuffledLoots.find(loot => loot.name === i.component.label.toLowerCase());
        await ctx.client.database.setCooldownCache("cooldown", userData.id);
        await ctx.makeMessage({
            components: [],
            embeds: [{
                author: { name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL({ dynamic: true }) },
                description: `${Emojis.magnifyingGlass} You are currently searching ${choosedLoot.pr} ${Util.capitalize(choosedLoot.name)}`,
                color: "#2f3136"    
            }]
        });
        await Util.wait(Util.getRandomInt(2, 6) * 1000);

        const luck = Util.getRandomInt(1, 10000);
        const loot = choosedLoot.loots.filter(l => (l.percent * 100) >= luck).sort((a, b) => a.percent - b.percent)[0];
        let infos: {
            emoji: string,
            prize: string
        };
        if (!loot) {
            infos = {
                emoji: '❌',
                prize: 'nothing'
            }
        } else if (Util.isItem(loot.loot)) {
            userData.items.push(loot.loot["id"]);
            infos = {
                emoji: loot.loot.emoji,
                prize: Util.capitalize(loot.loot.name)
            }
        } else {
            userData.money += loot.loot;
            // loop on values chapter_quests, side_quests and daily.quests from userData
            Util.forEveryQuests(userData, (q: Quest) => q.id.startsWith("loot") && (parseInt(q.id.split(":")[1]) > q.total), (quest: Quest) => {
                quest.total += loot.loot as number;
            });

            infos = {
                emoji: Emojis.jocoins,
                prize: Util.localeNumber(loot.loot)
            }
        }
        ctx.makeMessage({
            components: [],
            embeds: [{
                color: "#2f3136",
                description: `${choosedLoot.emoji} You searched ${choosedLoot.pr} ${Util.capitalize(choosedLoot.name)} and found: ${infos.emoji} **${infos.prize}**`,
                author: { name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL({ dynamic: true }) },
                timestamp: new Date()
            }]
        });

        Util.forEveryQuests(userData, (q: Quest) => q.id.startsWith("lloot") && (parseInt(q.id.split(":")[1]) > q.total), (quest: Quest) => {
            quest.total++;
        });
        
        await ctx.client.database.saveUserData(userData);
        await ctx.client.database.delCooldownCache("cooldown", userData.id);



    });



};