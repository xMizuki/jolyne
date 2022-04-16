import type { SlashCommand, UserData } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';
import InteractionCommandContext from '../structures/Interaction';
import type { Quest, Chapter } from '../@types'
import * as Util from '../utils/functions';
import * as Chapters from '../database/rpg/Chapters';
import * as Emojis from '../emojis.json'
import * as Quests from '../database/rpg/Quests';

export const name: SlashCommand["name"] = "chapter";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 3;
export const data: SlashCommand["data"] = {
    name: "chapter",
    description: "Show informations about your current chapter & your chapter quests",
}


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    const UserChapter: Chapter = Chapters[`C${userData.chapter}` as keyof typeof Chapters];
    let percent: number = 0;
    let chp = {
        1: `**:trident: Chapter \`${Util.romanize(userData.chapter)}\`**: ${UserChapter.title[userData.language]}`,
        2: `**:trident: Chapter \`${Util.romanize(userData.chapter)}\`**: ${UserChapter.title[userData.language]}`,
        3: `**:trident: Chapter \`${Util.romanize(3)} - Part ${Util.romanize(1)}\`**: ${UserChapter.title[userData.language]}`,
        4: `**:trident: Chapter \`${Util.romanize(3)} - Part ${Util.romanize(2)}\`**: ${UserChapter.title[userData.language]}`,
        5: `**:trident: Chapter \`${Util.romanize(3)} - Part ${Util.romanize(3)}\`**: ${UserChapter.title[userData.language]}`,
    };
    makeChapterQuestMessage()

    function makeChapterQuestMessage() {
        const fixedChapterContent: Array<object> = [];
        const dftArray: Array<string> = [];

        for (const quest of UserChapter.quests) {
            let bar: string;
            const output = Quests.getStatus(quest, userData);
            percent += output;
            if (quest.i18n) {
                bar = ctx.translate(`quest:${quest.i18n}.DESCRIPTION`, {
                    cc: Util.localeNumber(Number(quest.id.split(":")[1])),
                    s: Util.s(Number(quest.id.split(":")[1]))
                }) + " " + (quest.emoji ? quest.emoji : "");
                if (!isNaN(Number(quest.id.split(":")[1]))) {
                    const goal = Number(quest.id.split(":")[1]);
                    const fixPercent: number = (output / goal) * 100;
                    fixedChapterContent.push({
                        content: bar,
                        status: `(${quest.total}/${Util.localeNumber(goal)}) ${fixPercent.toFixed(2)}%`,
                    });
                } else {
                    fixedChapterContent.push({
                        content: bar,
                        status: percent + "%"
                    });
                }
                
            } else {
                if (quest.id.startsWith("defeat")) {
                    let max = userData.chapter_quests.filter((r: Quest) => r.id === quest.id).length;
                    let count = userData.chapter_quests.filter((r: Quest) => r.id == quest.id && r.completed).length;

                    if (dftArray.filter(r => r === quest.id).length !== 0) {
                        if (quest.completed) percent += 100;
                        continue;
                    }
                    bar = `Defeat ${max} ${quest.name}`
                    let perc: number = (count * 100)/max
                    percent += perc;
                    dftArray.push(quest.id); 
                    fixedChapterContent.push({
                        content: bar,
                        status: `(${count}/${max}) **${perc}%**`
                    });
                } else {
                    console.log(quest.id)
                }
            }
        }
        let content: string = "";
        for (let i = 0; i < fixedChapterContent.length; i++) {
            let cn: any = fixedChapterContent[i];
            let emoji: string = Emojis.reply;
            if (i === fixedChapterContent.length - 1) emoji = Emojis.replyEnd;
            content += `${emoji} ${cn.content} ||${cn.status}||\n`;
        }
        ctx.makeMessage({
            content: `${chp[userData.chapter as keyof typeof chp]}\n\`\`\`\n${UserChapter.description[userData.language]}\n\`\`\`\n\n:scroll: **__Quests:__** (${percent.toFixed(2)}%)\n${content}`,
        });

    }

}