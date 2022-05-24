import type { SlashCommand, UserData, Item } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import type { Quest, Chapter } from '../../@types';
import * as Util from '../../utils/functions';
import * as Chapters from '../../database/rpg/Chapters';
import * as Emojis from '../../emojis.json';
import * as Quests from '../../database/rpg/Quests';

export const name: SlashCommand["name"] = "chapter";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 3;
export const data: SlashCommand["data"] = {
    name: "chapter",
    description: "Show informations about your current chapter & your chapter quests",
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData, followUp?: boolean) => {
    const nextChapterID = Util.generateID();
    const nextChapterBTN = new MessageButton()
        .setCustomId(nextChapterID)
        .setLabel("Next")
        .setEmoji(Emojis.arrowRight)
        .setStyle("PRIMARY")
    
    makeChapterQuestMessage();

    function makeChapterQuestMessage() {
        const UserChapter = getUserChapter();
        const fixedChapterContent: Array<object> = [];
        const dftArray: Array<string> = [];
        let percent = 0;

        for (const quest of userData.chapter_quests) {
            let bar: string;
            let status: string;
            const output = Quests.getStatus(quest, userData);
            if (typeof output !== "number" && !output) continue;
            if (quest.i18n) {
                percent += output;
                bar = ctx.translate(`quest:${quest.i18n}.DESCRIPTION`, {
                    cc: Util.localeNumber(Number(quest.id.split(":")[1])),
                    s: Util.s(Number(quest.id.split(":")[1]))
                }) + " " + (quest.emoji ? quest.emoji : "");
                if (quest.id.startsWith("wait")) {
                    status = quest.timeout < Date.now() ? ":white_check_mark:" : `(<t:${(quest.timeout / 1000).toFixed(0)}:R>)`
                } else if (!isNaN(Number(quest.id.split(":")[1]))) {
                    const goal = Number(quest.id.split(":")[1]);
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
                    const max = userData.chapter_quests.filter((r: Quest) => r.id === quest.id).length;
                    const count = userData.chapter_quests.filter((r: Quest) => r.id == quest.id && r.npc.health === 0).length;

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
        const components: MessageActionRow[] = 100 === (percent / userData.chapter_quests.length) ? [Util.actionRow([nextChapterBTN])] : [];
        if (followUp) {
            return ctx.followUp({
                content: `${Quests.adapt(userData, UserChapter)[userData.chapter as keyof typeof Quests.adapt]}\n\`\`\`\n${UserChapter.description[userData.language]}\n\`\`\`\n\n:scroll: **__Quests:__** (${(percent / userData.chapter_quests.length).toFixed(2)}%)\n${content}`,
            });
        }
        ctx.makeMessage({
            content: `${Quests.adapt(userData, UserChapter)[userData.chapter as keyof typeof Quests.adapt]}\n\`\`\`\n${UserChapter.description[userData.language]}\n\`\`\`\n\n:scroll: **__Quests:__** (${(percent / userData.chapter_quests.length).toFixed(2)}%)\n${content}`,
            components: components
        });
        if (components.length !== 0) {
            const filter = (i: MessageComponentInteraction) => {
                i.deferUpdate().catch(() => {}); // eslint-disable-line no-empty
                return i.customId === nextChapterID && i.user.id === userData.id;
            }
            const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
            collector.on("end", () => {
                if (!ctx.interaction.replied) ctx.disableInteractionComponents()
            });
            // TODO: collector.on("collect", (i: MessageComponentInteraction) => {
            collector.on("collect", async (i: MessageComponentInteraction) => {
                // Anti-cheat
                const AntiCheatResult = await ctx.componentAntiCheat(i, userData);
                if (AntiCheatResult === true) {
                    return collector.stop();
                }

                userData.chapter++;
                const currentChapter = getUserChapter();
                if (!currentChapter || !Quests.adapt(userData, currentChapter)[userData.chapter as keyof typeof Quests.adapt]) { // This chapter was the last developed chapter
                    ctx.followUp({
                        content: "This chapter is currently the last, the developers are working hard to add more chapters.",
                        ephemeral: true
                    });
                    return collector.stop();
                }
                const dialogues = currentChapter.dialogues ? currentChapter.dialogues[userData.language] : undefined;
                if (dialogues) {
                    let dial = "";
                    await ctx.client.database.setCooldownCache("cooldown", userData.id);
                    for (const d of dialogues) {
                        dial += `${d}\n`;
                        ctx.makeMessage({
                            content: dial.replace(/{{userName}}/gi, ctx.interaction.user.username),
                            components: []
                        });
                        await Util.wait(Util.getRandomInt(2, 4) * 1000);
                    }
                    await Util.wait(3000);
                    await ctx.client.database.delCooldownCache("cooldown", userData.id);
                }

                userData.chapter_quests = currentChapter.quests;
                const items: Item[] = [];

                if (currentChapter.mails && currentChapter.mails.length !== 0) {
                    for (const mail of currentChapter.mails) {
                        userData.mails.push(mail);
                    }
                }
                if (currentChapter.items && currentChapter.items.length !== 0) {
                    for (const item of currentChapter.items) {
                        items.push(item);
                        userData.items.push(item.id);
                    }
                }
                const uniqueItems = [...new Set(items.map(i => i.id))];
                if (uniqueItems.length !== 0) {
                    // Reply by formatting item: x1, x2, x3, the emoji, the name
                    const itemList = uniqueItems.map(i => {
                        const item = items.find(r => r.id === i);
                        if (!item) return "";
                        const amount = items.filter(r => r.id === i).length;
                        return `\`-\` x${amount} ${item.name} ${item.emoji}`;
                    }).join("\n");
                    ctx.followUp({
                        content: `You received the following items:\n${itemList}`,
                    });
                };
                await ctx.client.database.saveUserData(userData);
                return ctx.client.commands.get("chapter").execute(ctx, userData, dialogues ? true : false);
                                        
            });


        }

    }
    function getUserChapter(): Chapter {
        return Object.keys(Chapters).map(c => Chapters[c as keyof typeof Chapters]).find(c => c.id === userData.chapter);
    }
    function makeChapterTitle(chapter: Chapter): string {
        const part = getChapterPart(chapter);
        if (chapter.parent) return `**:trident: Chapter \`${Util.romanize(chapter.parent.id)} - Part ${Util.romanize(part)}\`**: ${chapter.title[userData.language]}`;
        else if (Object.keys(Chapters).map(c => Chapters[c as keyof typeof Chapters]).filter(c => c.parent === chapter).length !== 0) return `**:trident: Chapter \`${Util.romanize(part)} - Part I\`**: ${chapter.title[userData.language]}`;
        else return `**:trident: Chapter \`${Util.romanize(part)}\`**: ${chapter.title[userData.language]}`;
    }
    function getChapterPart(chapter: Chapter): number {
        let ld: number = Object.keys(Chapters).map(c => Chapters[c as keyof typeof Chapters]).filter(c => c.parent && c.parent === chapter).length;
        let result: number = 0;
        if (ld !== 0) result = chapter.id - Object.keys(Chapters).map(c => Chapters[c as keyof typeof Chapters]).filter(c => c.id <= chapter.id && c.parent).length - ld;
        else if (chapter.parent) {
            const parentPart = getChapterPart(chapter.parent);
            result = parentPart + (parentPart - chapter.id)

        }
        return result;
    }
    function nextChapterId(): number {
        const chapterIdArray = Object.keys(Chapters).map(c => Chapters[c as keyof typeof Chapters]).map(c => c.id);
        const chapterIdArraySorted = chapterIdArray.sort((a, b) => a - b);
        const chapterIdArraySortedFiltered = chapterIdArraySorted.filter(c => c > userData.chapter);
        if (chapterIdArraySortedFiltered.length === 0) return undefined;
        return chapterIdArraySortedFiltered[0];
    }

};