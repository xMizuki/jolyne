import type { SlashCommand, UserData, Item, Quest } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Quests from '../../database/rpg/Quests';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';
import * as Items from '../../database/rpg/Items';

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
    const dateAtMidnight = new Date().setHours(0, 0, 0, 0);
    const nextDate = dateAtMidnight + 86400000;
    if (ctx.interaction.options.getSubcommand() === "claim") {
        if (userData.daily.claimedAt == dateAtMidnight) {
            return ctx.sendT("daily:ALREADY_CLAIMED", {
                time: ctx.convertMs(nextDate - Date.now())
            });
        }
        let rewards = Util.getRewards(userData);

        // check if the user last daily was claimed after 2 days
        if (userData.daily.claimedAt !== dateAtMidnight - 86400000) {
            userData.daily.streak = 0;
        }
        userData.daily.claimedAt = dateAtMidnight;
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
            const arrow = Items.Mysterious_Arrow;
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
        Util.forEveryQuests(userData, (q: Quest) => q.id.startsWith("cdaily") && (parseInt(q.id.split(":")[1]) > q.total), (quest: Quest) => {
            quest.total++;
        });
        await ctx.client.database.saveUserData(userData);
        ctx.interaction.reply({ embeds: [embed] });
    } else {
        const nextChapterID = Util.generateID();
        const nextChapterBTN = new MessageButton()
            .setCustomId(nextChapterID)
            .setLabel("Claim")
            .setEmoji(Emojis.arrowRight)
            .setDisabled(await ctx.client.database.redis.get(`jjba:finishedQ:${userData.id}`) ? true : false)
            .setStyle("PRIMARY")
        
        makeChapterQuestMessage();
    
        function makeChapterQuestMessage() {
            const fixedChapterContent: Array<object> = [];
            const dftArray: Array<string> = [];
            let percent = 0;
            let xpRewards = 0;
            let cRewards = 0;
    
            for (const quest of userData.daily.quests) {
                let bar: string;
                let status: string;
                const output = Quests.getStatus(quest, userData);
                if (typeof output !== "number" && !output) continue;
                if (quest.i18n) {
                    cRewards += Math.round(Number(quest.id.split(":")[1]) / 2.5);
                    xpRewards += Math.round(Number(quest.id.split(":")[1]) / 3.5);
                    percent += output;
                    bar = ctx.translate(`quest:${quest.i18n}.DESCRIPTION`, {
                        cc: Util.localeNumber(Number(quest.id.split(":")[1])),
                        s: Util.s(Number(quest.id.split(":")[1]))
                    }) + " " + (quest.emoji ? quest.emoji : "");
                    if (quest.id.startsWith("wait")) {
                        status = quest.timeout < Date.now() ? ":white_check_mark:" : `(<t:${(quest.timeout / 1000).toFixed(0)}:R>)`
                    } else if (!isNaN(Number(quest.id.split(":")[1]))) {
                        const goal = Number(quest.id.split(":")[1]);
                        cRewards += Number(quest.id.split(":")[1]) * 1.2;
                        xpRewards += Math.round(Number(quest.id.split(":")[1])/3.5);    
                        status = `(${Util.localeNumber(quest.total)}/${Util.localeNumber(goal)}) ${output.toFixed(2)}%`
                    } else {
                        status = output + "%"
                    }
                } else {
                    if (quest.id.startsWith("rdem+")) {
                        const mailId = quest.id.split("+")[1];
                        const mail = userData.mails.find(mail => mail.id === mailId);
                        if (!mail || quest.completed) {
                            percent += 100;
                            status = ":white_check_mark:";
                        } else {
                            status = ":x:";
                        }
                        bar = {
                            'en-US': `Read the e-mail from ${mail.author.name} (\`${mail.author.email})\``,
                            'fr-FR': `Lire le mail de ${mail.author.name} (\`${mail.author.email}\`)`,
                            'es-ES': `Leer el correo de ${mail.author.name} (\`${mail.author.email}\`)`, 
                            'de-DE': `Lesen Sie die E-Mail von ${mail.author.name} (\`${mail.author.email}\`)`,
                        }[userData.language];
    
                    } else if (quest.id.startsWith("defeat")) {
                        xpRewards += quest.npc.level * 100;
                        cRewards += quest.npc.level * 300;
                        const max = userData.daily.quests.filter((r: Quest) => r.id === quest.id).length;
                        const count = userData.daily.quests.filter((r: Quest) => r.id == quest.id && r.npc.health === 0).length;


    
                        if (dftArray.filter(r => r === quest.id).length !== 0) {
                            if (quest.npc.health === 0) percent += 100;
                            continue;
                        }
                        if (max === 1) bar = `Defeat ${quest.npc.name}`;
                        else bar = `Defeat ${max} ${quest.npc.name}`;
    
                        const perc: number = (count * 100)/max;
                        percent += perc;
                        status = `(${Util.localeNumber(count)}/${Util.localeNumber(max)}) **${perc}%**`
                        dftArray.push(quest.id); 
                    } else {
                        console.log(quest.id);
                    }
                }
                fixedChapterContent.push({
                    content: bar,
                    status: status,
                });
    
            }
            let content = "";
            for (let i = 0; i < fixedChapterContent.length; i++) {
                const cn: any = fixedChapterContent[i];
                let emoji: string = Emojis.reply;
                if (i === fixedChapterContent.length - 1) emoji = Emojis.replyEnd;
                content += `${emoji} ${cn.content} ||${cn.status}||\n`;
            }
            const components: MessageActionRow[] = 100 === (percent / userData.daily.quests.length) ? [Util.actionRow([nextChapterBTN])] : [];
            xpRewards = Math.round(xpRewards);
            cRewards = Math.round(cRewards);
            ctx.makeMessage({
                content: `:scroll: **__Daily Quests:__** (${(percent / userData.daily.quests.length).toFixed(2)}%)\n${content}\n<:timerIcon:944286216688369754> Resets <t:${((new Date(`${new Date().getMonth()+1}-${new Date().getDate()}-${new Date().getUTCFullYear()}`).getTime() + 86400000)/1000).toFixed(0)}:R>\n<:arrowRight:943187898495303720> You'll get **${Util.localeNumber(xpRewards)}** <:xp:925111121600454706> and **${Util.localeNumber(cRewards)}** <:jocoins:927974784187392061> if you complete all your daily quests`,
                components: components
            });
            if (components.length !== 0) {
                const filter = (i: MessageComponentInteraction) => {
                    i.deferUpdate().catch(() => {}); // eslint-disable-line no-empty
                    return i.customId === nextChapterID && i.user.id === userData.id;
                }
                const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
                ctx.timeoutCollector(collector);
                // TODO: collector.on("collect", (i: MessageComponentInteraction) => {
                collector.on("collect", async (i: MessageComponentInteraction) => {
                    collector.stop();
                    ctx.disableInteractionComponents();
                    // Anti-cheat
                    if ((await ctx['componentAntiCheat'](i, userData)) === true) return;
                    if (await ctx.client.database.redis.get(`jjba:finishedQ:${userData.id}`)) return;
                    userData.money += cRewards;
                    userData.xp += xpRewards;
                    await ctx.client.database.redis.set(`jjba:finishedQ:${userData.id}`, 'indeed');
                    ctx.client.database.saveUserData(userData);

                    ctx.followUp({
                        content: `GG! You got **${Util.localeNumber(cRewards)}** <:jocoins:927974784187392061> and **${Util.localeNumber(xpRewards)}** <:xp:925111121600454706>`,
                    })
                });
    
    
            }
    
        }

    

    }
};
