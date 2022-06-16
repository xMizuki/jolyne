import type { UserData, Quest } from '../../@types';
import { MessageButton, MessageComponentInteraction } from 'discord.js';
import * as Quests from './Quests';
import * as Items from './Items';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json'
import InteractionCommandContext from '../../structures/Interaction';

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

export const remove_thing_kakyoin = async (ctx: InteractionCommandContext, userData: UserData) => {
    const baseText = ctx.translate("action:REMOVE_THING_KAKYOIN.BASE");
    const failedText = ctx.translate("action:REMOVE_THING_KAKYOIN.FAILED");
    const successText = ctx.translate("action:REMOVE_THING_KAKYOIN.SUCCESS");

    ctx.client.database.setCooldownCache("cooldown", userData.id);

    await ctx.makeMessage({
        content: baseText,
        components: []
    });
    await wait(3000);

    if (Util.getRandomInt(1, 3) === 2) {
        await ctx.makeMessage({
            content: baseText + " " + failedText,
            components: []
        });
        for (let i = 0; i < userData.chapter_quests.length; i++) {
            if (userData.chapter_quests[i].id === "action:remove_thing_kakyoin") {
                userData.chapter_quests[i] = Quests.bring_kakyoin_hospital;
                break;
            };
        };

    } else {
        await ctx.makeMessage({
            content: baseText + " " + successText,
            components: []
        });
        for (let i = 0; i < userData.chapter_quests.length; i++) {
            if (userData.chapter_quests[i].id === "action:remove_thing_kakyoin") {
                userData.chapter_quests[i].completed = true;
                break;
            }
        }
    }
    ctx.client.database.delCooldownCache("cooldown", userData.id);
    ctx.client.database.saveUserData(userData);    
};

export const bring_kakyoin_hospital = async (ctx: InteractionCommandContext, userData: UserData) => {
    if (userData.money < 5000) {
        return ctx.sendT("action:BRING_KAKYOIN_HOSPITAL.MONEY", {
            components: []
        });
    }
    userData.money -= 5000;
    // vaidate quest
    for (let i = 0; i < userData.chapter_quests.length; i++) {
        if (userData.chapter_quests[i].id === "action:bring_kakyoin_hospital") {
            userData.chapter_quests[i].completed = true;
            break;
        }
    }
    userData.chapter_quests.push(Quests.KAKYOIN_BACK);
    ctx.client.database.saveUserData(userData);
    ctx.sendT("action:BRING_KAKYOIN_HOSPITAL.SUCCESS", {
        components: []
    });
}

export const analyse_hair = async(ctx: InteractionCommandContext, userData: UserData) => {
    // validate quest
    for (let i = 0; i < userData.chapter_quests.length; i++) {
        if (userData.chapter_quests[i].id === "action:analyse_hair") {
            userData.chapter_quests[i].completed = true;
            break;
        }
    }
    userData.chapter_quests.push(Quests.SPEEDWAGON_ANSWER);
    ctx.client.database.saveUserData(userData);
    ctx.sendT("action:ANALYSE_HAIR.SUCCESS", {
        components: []
    });
}

export const tygad = async(ctx: InteractionCommandContext, userData: UserData) => {
    // validate quest
    for (let i = 0; i < userData.chapter_quests.length; i++) {
        if (userData.chapter_quests[i].id === "action:tygad") {
            userData.chapter_quests[i].completed = true;
            break;
        }
    }
    userData.chapter_quests.push(Quests.TYGAD_ANSWER);
    ctx.client.database.saveUserData(userData);
    ctx.sendT("action:TYGAD.SUCCESS", {
        components: []
    });
}

export const gotoairport = async(ctx: InteractionCommandContext, userData: UserData) => {
    const slowPrice = 5000;
    const fastPrice = 15000;
    const slowPriceID = Util.generateID();
    const fastPriceID = Util.generateID();
    const slowPriceTime = Date.now() + ((60000 * 60) * 2);
    const fastPriceTime = Date.now() + ((60000 * 60) / 2);
    const slowPriceBTN = new MessageButton()
        .setCustomId(slowPriceID)
        .setLabel(Util.localeNumber(slowPrice))
        .setEmoji(Emojis.jocoins)
        .setStyle("PRIMARY");
    const fastPriceBTN = new MessageButton()
        .setCustomId(fastPriceID)
        .setLabel(Util.localeNumber(fastPrice))
        .setEmoji(Emojis.jocoins)
        .setStyle("SECONDARY");
    await ctx.sendT("action:GO_TO_AIRPORT.BASE", {
        components: [Util.actionRow([slowPriceBTN, fastPriceBTN])],
        slowPrice: Util.localeNumber(slowPrice)
    });
    const filter = async (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => {});
        return (i.customId === slowPriceID || i.customId === fastPriceID) && i.user.id === userData.id;
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
    collector.on("collect", async (i: MessageComponentInteraction) => {
        const AntiCheatResult = await ctx.componentAntiCheat(i, userData);
        if (AntiCheatResult === true) {
            return collector.stop();
        }
        const price = i.customId === slowPriceID ? slowPrice : fastPrice;
        if (userData.money < price) {
            await ctx.sendT("action:GO_TO_AIRPORT.MONEY", {
                components: []
            });
            return;
        }
        // validate quest
        for (let i = 0; i < userData.chapter_quests.length; i++) {
            if (userData.chapter_quests[i].id === "action:gotoairport") {
                userData.chapter_quests[i].completed = true;
                break;
            }
        }
        userData.money -= price;
        const toPushQuest = Quests.Get_At_The_Morioh_Airport;
        if (price == slowPrice) {
            ctx.sendT("action:GO_TO_AIRPORT.SLOW", {
                components: []
            });
            toPushQuest.timeout = slowPriceTime;
        } else {
            ctx.sendT("action:GO_TO_AIRPORT.FAST", {
                components: []
            });
            toPushQuest.timeout = fastPriceTime;
        }
        userData.chapter_quests.push(toPushQuest);
        ctx.client.database.saveUserData(userData);

    });
    
}

export const remove_fleshbud_polnareff = async(ctx: InteractionCommandContext, userData: UserData) => {
    await ctx.client.database.setCooldownCache("cooldown", userData.id);
    try {
        const acceptID = Util.generateID();
        const refuseID = Util.generateID();
        const acceptBTN = new MessageButton()
            .setCustomId(acceptID)
            .setLabel(ctx.translate("base:ACCEPT"))
            .setStyle("SUCCESS");
        const refuseBTN = new MessageButton()
            .setCustomId(refuseID)
            .setLabel(ctx.translate("base:REFUSE"))
            .setStyle("DANGER");
        const dialogues = ctx.translate("action:REMOVE_FLESHBUD_POLNAREFF.DIALOGUES_1", {
            returnObjects: true
        });
        let dial = "";
        for (let i = 0; i < dialogues.length; i++) {
            dial += `${dialogues[i]}\n`;
            ctx.makeMessage({
                content: dial,
                components: []
            });
            await Util.wait(Util.getRandomInt(3, 5) * 1000)
        }
        await ctx.makeMessage({
            components: [Util.actionRow([acceptBTN, refuseBTN])],
        });
        const filter = async (i: MessageComponentInteraction) => {
            i.deferUpdate().catch(() => {});
            return (i.customId === acceptID || i.customId === refuseID) && i.user.id === userData.id;
        }
        const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 150000 });
        let replied: boolean = false;
        collector.on("collect", async (i: MessageComponentInteraction) => {
            replied = true;
            for (let i = 0; i < userData.chapter_quests.length; i++) {
                if (userData.chapter_quests[i].id === "action:remove_fleshbud_polnareff") {
                    userData.chapter_quests[i].completed = true;
                    break;
                }
            }
    
            if (i.customId === acceptID) {
                const dialogues2 = ctx.translate("action:REMOVE_FLESHBUD_POLNAREFF.DIALOGUES_JOTARO", {
                    returnObjects: true
                });
                let dial2 = "";
                for (let i = 0; i < dialogues2.length; i++) {
                    dial2 += `${dialogues2[i]}\n`;
                    ctx.makeMessage({
                        content: dial2,
                        components: []
                    });
                    await Util.wait(Util.getRandomInt(3, 5) * 1000)
                }
             } else {
                    const dialogues2 = ctx.translate("action:REMOVE_FLESHBUD_POLNAREFF.DIALOGUES_2", {
                        returnObjects: true
                    });
                    let dial2 = "";
                    for (let i = 0; i < dialogues2.length; i++) {
                        dial2 += `${dialogues2[i]}\n`;
                        await ctx.makeMessage({
                            content: dial2,
                            components: []
                        });
                        await Util.wait(Util.getRandomInt(3, 5) * 1000)
                    }
                }
                collector.stop("done");
            });
            collector.on("end", () => {
                ctx.client.database.delCooldownCache("cooldown", userData.id);
                if (replied) {
                    userData.items.push(Items.Mysterious_Arrow["id"]);
                    ctx.followUp({
                        content: `${Emojis.mysterious_arrow}`
                    })
                }   ctx.client.database.saveUserData(userData); // save user data
            });
    
    } catch(e) {
        ctx.client.database.delCooldownCache("cooldown", userData.id);
        throw e;
    }
}

export const drive_airplane_to_hongkong = async (ctx: InteractionCommandContext, userData: UserData) => {
    await ctx.client.database.setCooldownCache("cooldown", userData.id);
    const finishEmoji = '🔲';
    let map = [
        finishEmoji,finishEmoji,finishEmoji,finishEmoji,finishEmoji,finishEmoji,finishEmoji,finishEmoji,finishEmoji,finishEmoji 
    ];
    const crashEmoji = '🪰';
    for (let i = 0; i < 18; i++) {
        const howMuch = Util.getRandomInt(2, 4);
        let map2 = [
            '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦', '🟦'
        ];
        for (let i = 0; i < howMuch; i++) {
            map2[i] = crashEmoji;
        }
        Util.shuffle(map2);
        for (const i of map2) map.push(i);
    }
    function splitEvery10Array(arr: string[]) {
        const result: string[][] = [];
        for (let i = 0; i < arr.length; i += 10) {
            result.push(arr.slice(i, i + 10));
        }
        return result.map(v => v.join(''));
    }
    let planeDirection = map.length - 5;
    map[planeDirection - 10] = '🟦'; // anti impossible
    let oldEmoji = '🟦';

    const backId = Util.generateID();
    const centerId = Util.generateID();
    const forwardId = Util.generateID();

    const backBTN = new MessageButton()
        .setCustomId(backId)
        .setEmoji('⬅️')
        .setStyle("SECONDARY");
    const centerBTN = new MessageButton()
        .setCustomId(centerId)
        .setEmoji('⬆️')
        .setStyle("PRIMARY");
    const forwardBTN = new MessageButton()
        .setCustomId(forwardId)
        .setEmoji('➡️')
        .setStyle("SECONDARY");
    function makeMessage (): void {
        map[planeDirection] = '✈️';
        ctx.makeMessage({
            components: [
                Util.actionRow([backBTN, centerBTN, forwardBTN]),
            ],
            embeds: [{
                title: '🌏 Hongkong',
                description: splitEvery10Array(map).join('\n'),
                footer: {
                    text: "Drive the airplane to hongkong. Don't crash!"
                }
            }]
        })
    }
    makeMessage();
    const filter = async (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => {});
        return (i.customId === backId || i.customId === centerId || i.customId === forwardId) && i.user.id === userData.id;
    };
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 150000 });
    ctx.timeoutCollector(collector);

    collector.on("collect", async (i: MessageComponentInteraction) => {
        map[planeDirection] = oldEmoji;
        if (i.customId === backId) {
            planeDirection -= 1;
        } else if (i.customId === forwardId) {
            planeDirection += 1;
        } else planeDirection -= 10;
        if (map[planeDirection] === crashEmoji) {
            collector.stop("crashed");
            ctx.makeMessage({
                content: '💥 YOURE SO BAD YOU CRASHED THE AIRPLANE!'
            });
        } else if (map[planeDirection] === finishEmoji) {
            collector.stop("finished");
            ctx.makeMessage({
                content: 'You successfully landed in Hongkong!'
            });
            // validate quest
            for (let i = 0; i < userData.chapter_quests.length; i++) {
                if (userData.chapter_quests[i].id === 'action:drive_airplane_to_hongkong') {
                    userData.chapter_quests[i].completed = true;
                    break;
                }
            }
            ctx.client.database.saveUserData(userData);
        }
        oldEmoji = map[planeDirection];
        makeMessage()

    });

    collector.on('end', async (int: any, reason: string) => {
        await ctx.client.database.delCooldownCache("cooldown", userData.id);
    });


}