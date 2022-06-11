import type { SlashCommand, UserData, Item } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, Message } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import type { Quest, Chapter } from '../../@types';
import * as Util from '../../utils/functions';
import * as Items from '../../database/rpg/Items';
import * as Emojis from '../../emojis.json';
import * as Quests from '../../database/rpg/Quests';

export const name: SlashCommand["name"] = "casino";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 10;
export const data: SlashCommand["data"] = {
    name: "casino",
    description: "Casino.",
    options: [{
        name: 'bet',
        description: 'The amount of your bet. To win, you must have at least 2 identical symbols',
        type: 4,
        required: true
    }]
};

export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    // yo what the fuck was that, give me every fruits emoji
    const fruits = [
        "🍏",
        "🍎",
        "🍐",
        "🍊",
        "🍋",
        "🍌",
        "🍉",
        "🍇",
        "🍓",
        "🍒",
        "🍑",
    ]
    // const fruits = [Emojis['JolyneAhhhhh'], Emojis['a_'], "🍌", Emojis.diary, Emojis['complete_pizza'], "🍒", Emojis['jocoins']];
    let slotMachineFruits: string[] = Util.shuffle([...Util.shuffle([...Util.shuffle(fruits), ...Util.shuffle(fruits), ...Util.shuffle(fruits), ...Util.shuffle(fruits)])]); // Am I shuffling too much? Yes.

    const betID = Util.generateID();
    const cancelID = Util.generateID();
    const pullAgainID = Util.generateID();

    const betBTN = new MessageButton()
        .setCustomId(betID)
        .setLabel('Bet')
        .setEmoji('🎰')
        .setStyle('PRIMARY');
    const cancelBTN = new MessageButton()
        .setCustomId(cancelID)
        .setLabel('Nevermind')
        .setStyle('SECONDARY');
    const pullAgainBTN = new MessageButton()
        .setCustomId(pullAgainID)
        .setLabel('Pull again')
        .setEmoji('🎰')
        .setStyle('SECONDARY');
    
    let bet = ctx.interaction.options.getInteger('bet');
    if (bet < 0) bet = 1;
    let left = Util.getRandomInt(2, 5);

    await ctx.sendT('casino:CONFIRM_MESSAGE', {
        bet: Util.localeNumber(bet),
        left: Util.localeNumber(userData.money),
        components: [
            Util.actionRow([ betBTN, cancelBTN ])
        ]
    });
    const filter = (i: MessageComponentInteraction)  => {
        i.deferUpdate().catch(() => { }); //eslint-disable-line no-empty
        return (i.customId === betID || i.customId === cancelID || i.customId === pullAgainID) && i.user.id === ctx.author.id;
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
    ctx.timeoutCollector(collector, 30000);

    let followUpReply: Message;

    collector.on('collect', async (i: MessageComponentInteraction) => {
        if ((await ctx['componentAntiCheat'](i, userData)) === true) return;

        if (i.customId === cancelID) {
            await ctx.sendT('casino:CANCEL_MESSAGE', {
                components: []
            });
            return collector.stop('DONT_DISABLE_COMPONENTS');
        } else if (i.customId === pullAgainID) {
            collector.stop();
            await followUpReply.fetch().then(m => m.delete().catch(() => { })); //eslint-disable-line no-empty
            // await followUpReply.delete() 
            return ctx.client.commands.get('casino').execute(ctx, userData);
        }
        ctx.timeoutCollector(collector, 30000);
        ctx.client.database.setCooldownCache('casino', userData.id);

        while (left !== -1) {
            await runSlotMachine();
            await Util.wait(1000);
            left--;
        }


    });

    async function runSlotMachine() {
        let msg = "[  :slot_machine: | **CASINO** ]\n+----------------+\n"
                + "| " + slotMachineFruits[0] + " : " + slotMachineFruits[1] + " : " + slotMachineFruits[2] + "  | \n"
                + "| " + slotMachineFruits[3] + " : " + slotMachineFruits[4] + " : " + slotMachineFruits[5] + "  | **<**\n"
                + "| " + slotMachineFruits[6] + " : " + slotMachineFruits[7] + " : " + slotMachineFruits[8] + "  | \n+----------------+\n";

        if (left === 0) {
            let followUpMSG: string;

            if (slotMachineFruits[3] === slotMachineFruits[4] && slotMachineFruits[4] === slotMachineFruits[5]) { // JACKPOT
                msg += "| : : **JACKPOT** : : |\n";
                userData.money += Math.round(bet * 4.5);
                followUpMSG = Util.randomArray(ctx.translateObject("casino:JACKPOT_MESSAGES"));
            } else if (slotMachineFruits[3] === slotMachineFruits[4] || slotMachineFruits[4] === slotMachineFruits[5] || slotMachineFruits[5] === slotMachineFruits[3]) { // 2 identical symbols
                msg += "| : : : : **WIN** : : : : |";
                userData.money += Math.round(bet * 1.5);
                followUpMSG = ctx.translate("casino:CASINO_YOU_GOT", {
                    amount: Util.localeNumber(Math.round(bet * 1.5))
                });
            } else {
                msg += "| : : : : **LOSE** : : : : |";
                userData.money -= bet;
                followUpMSG = Util.randomArray(ctx.translateObject('casino:LOSE_MESSAGES'));
            }
            await ctx.client.database.delCooldownCache('casino', userData.id);
            ctx.client.database.saveUserData(userData);
            followUpReply = await ctx.followUp({
                content: followUpMSG,
                fetchReply: true
            });
            ctx.makeMessage({
                content: msg,
                components: [
                    Util.actionRow([ pullAgainBTN ])
                ]
            });
        } else {
            slotMachineFruits = slotMachineFruits.slice(3);
            msg += `| : : : : :  **${left}**  : : : : : |`;

            await ctx.makeMessage({
                content: msg,
                components: []
            });

        }
    }

};