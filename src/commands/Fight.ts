import type { SlashCommand, UserData, NPC, Stand, Ability } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';
import InteractionCommandContext from '../structures/Interaction';
import type { Quest, Chapter } from '../@types';
import * as Util from '../utils/functions';
import * as Chapters from '../database/rpg/Chapters';
import * as Quests from '../database/rpg/Quests';
import * as Stands from '../database/rpg/Stands';
import * as Emojis from '../emojis.json';

export const name: SlashCommand["name"] = "fight";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 3;
export const data: SlashCommand["data"] = {
    name: "fight",
    description: "[SUB-COMMANDS]",
    options: [{
        name: "npc",
        description: "Start a fight against an NPC from your quests",
        options: [],
        type: 1
    }, {
        name: "player",
        description: "Start a fight against a player",
        type: 1,
        options: [{
            name: "user",
            description: "The user whose profile you want to see",
            required: false,
            type: 6
        }]
    }]
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData: UserData, customNPC?: NPC) => {
    let ennemy: NPC;
    const lastChapterEnnemyQuest: Quest = userData.chapter_quests.filter(v => v.npc && v.npc.health !== 0)[0];
    const lastDailyEnnemyQuest: Quest = userData.daily.quests.filter(v => v.npc && v.npc.health !== 0)[0];

    const selectMenuID = Util.generateID();

    const user = ctx.interaction.options.getUser("user");
    const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => { });
        if (user) return i.user.id === user.id || i.user.id === userData.id;
        return i.user.id === userData.id;
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });

    if (!user) {
        if (lastChapterEnnemyQuest && lastDailyEnnemyQuest) {
            const selectMenu = new MessageSelectMenu()
            .setCustomId(selectMenuID)
            .setPlaceholder('Select an opponent.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([{
                    label: lastChapterEnnemyQuest.npc.name,
                    value: 'quests',
                    description: ctx.translate("battle:FROM_CQ"),
                    emoji: lastChapterEnnemyQuest.npc.emoji
                }, {
                    label: lastDailyEnnemyQuest.npc.name,
                    description: ctx.translate("battle:FROM_DQ"),
                    value: "squests",
                    emoji: lastDailyEnnemyQuest.npc.emoji
                }]);
            ctx.sendT("battle:MULTIPLE_QUESTION", {
                components: [Util.actionRow([selectMenu])]
            });
        }
        if (!lastChapterEnnemyQuest && !lastDailyEnnemyQuest) return await ctx.sendT("battle:NOBODY_BATTLE");
        if (lastChapterEnnemyQuest) return startBattle(lastChapterEnnemyQuest.npc, "chapter_quests");
        if (lastDailyEnnemyQuest) return startBattle(lastDailyEnnemyQuest.npc, "daily.quests");
    }

    function startBattle(opponent: UserData | NPC, type: "chapter_quests" | "daily.quests" | "ranked" | "friendly" | "custom") {
        const attackID = Util.generateID();
        const defendID = Util.generateID();
        const forfeitID = Util.generateID();
        const standID = Util.generateID();

        const promises: Promise<any>[] = []; // Game promises
        const promisesOptions = {
            timestop_cd: 0
        }
        /** EXAMPLE
        promises.push((async () => {
            if (promisesOptions.timestop_cd !== 0) {
                trns++;
                promisesOptions.timestop_cd--;
            }
        })());
        */
        
        const shields: Array<{
            id: string,
            left: number,
            max: number
        }> = [{
            id: userData.id,
            left: Math.round(userData.max_health / 3),
            max: Math.round(userData.max_health / 3)
        }, {
            id: opponent.id,
            left: Math.round(opponent.max_health / 3),
            max: Math.round(opponent.max_health / 3)
        }];
        const cooldowns: Array<{
            id: string,
            move: string,
            cooldown: number
        }> = [];
        const UserStand: Stand | null = userData.stand ? Stands[`${Util.getStand(userData.stand)}` as keyof typeof Stands] : null;
        const OpponentStand: Stand | null = opponent.stand ? Stands[`${Util.getStand(opponent.stand)}` as keyof typeof Stands] : null;
        if (UserStand) for (const ability of UserStand.abilities) {
            cooldowns.push({
                id: userData.id,
                move: ability.name,
                cooldown: ability.cooldown
            });
        }
        if (OpponentStand) for (const ability of OpponentStand.abilities) {
            cooldowns.push({
                id: opponent.id,
                move: ability.name,
                cooldown: ability.cooldown
            });
        }


        const attackBTN = new MessageButton()
            .setCustomId(attackID)
            .setLabel("Attack")
            .setEmoji("⚔️")
            .setStyle("PRIMARY");
        const defendBTN = new MessageButton()
            .setCustomId(defendID)
            .setLabel("Defend")
            .setEmoji("🛡")
            .setStyle("PRIMARY");
        const forfeitBTN = new MessageButton()
            .setCustomId(forfeitID)
            .setLabel("Forfeit")
            .setEmoji("🗡")
            .setStyle("SECONDARY");
        const NPCBTN = new MessageButton()
            .setCustomId('[@ny]')
            .setLabel('[Waiting for your turn...]')
            .setDisabled(true)
            .setStyle('DANGER')

        const standBTN = (povData: NPC | UserData) => {
            const stand = Util.getStand(povData.stand ?? "");
            return new MessageButton()
                .setCustomId(standID)
                .setLabel(`${stand.name}'s abilities`)
                .setEmoji(stand.emoji)
                .setStyle("SECONDARY");
        }
        const turns: Array<{
            lastMove: string,
            lastUser: string,
            logs: Array<string>,
            lastDamage: number
        }> = [];
        let trns = 0//Util.getRandomInt(0, 10);
        turns.push({
            lastMove: "",
            lastUser: Util.isNPC(opponent) ? opponent.name : user.username,
            logs: [],
            lastDamage: 0
        })
        loadBaseEmbed();

        collector.on("collect", async (i: MessageComponentInteraction) => {
            const povData = whosTurn();
            if (Util.isNPC(povData)) return;
            if (i.user.id !== whosTurn().id) return; // If it's not the turn of the player

            const before = whosTurn();
            let dodged: boolean = false;
            const dodges = Util.calcDodgeChances(before);
            const dodgesNumerator = 90 + (!Util.isNPC(before) ? before.spb?.perception : before.skill_points.perception);
            const dodgesPercent = Util.getRandomInt(0, Math.round(dodgesNumerator));
            if (dodgesPercent < dodges) dodged = true;

            const currentTurn = turns[turns.length - 1];
            let output: any; // chng to string après

            switch (i.customId) {
                case attackID:
                    const input = attack({ damages: Util.getATKDMG(povData), username: i.user.username }, dodged, currentTurn);
                    output = input;
                    break;
                case defendID:
                    output = defend();
                    break;
            }
            await Promise.all(promises);

            currentTurn.logs.push(output);
            pushTurn();
            trns++;
            await loadBaseEmbed();
            if (whosTurn().id === opponent.id && Util.isNPC(opponent)) await NPCAttack(); 
        });

        function pushTurn() {
            if (turns[turns.length - 1].logs.length >= 2 && turns[turns.length - 1].lastMove !== "TS") turns.push({
                lastMove: turns[turns.length - 1].lastMove,
                lastUser: beforeTurnUsername(),
                logs: [],
                lastDamage: turns[turns.length - 1].lastDamage
            });
        }

        function attack(input: { damages: number, username: string }, dodged: boolean, turn: { lastMove: string, lastUser: string, logs: Array<string> }) {
            if (dodged) {
                return `🌬️ **${input.username}** attacked but ${turn.lastUser} dodged.`;
            } else if (turn.lastMove === "defend") {
                const then = attackShield(beforeTurn().id, input.damages);
                if (then.left === 0) {
                    regenerateShieldToUser(beforeTurn().id);
                    removeHealthToLastGuy(input.damages * 1.75);
                    return `**${input.username}** attacked and broke ${turn.lastUser}'s guard for ${input.damages * 1.75} damages.`;
                } else {
                    return `**${input.username}** attacked but ${turn.lastUser} blocked. (:shield: ${then.left}/${then.max} left).`;
                }
            } else {
                removeHealthToLastGuy(input.damages);
                return `**${input.username}** attacked and did ${input.damages} damages.`;
            }
        }

        async function NPCAttack() {
            await Util.wait(1200);
            const NPC = whosTurn();
            if (!Util.isNPC(NPC)) return; //typeguard
            let possibleMoves: Array<string | Ability> = ["attack", "defend"];

            /*
            if (OpponentStand) {
                for (const ability of OpponentStand.abilities) {
                    if (cooldowns.find(c => c.id === NPC.id && c.move === ability.name).cooldown === 0) {
                        possibleMoves.push(ability);
                    }
                }
            }*/
            const choosedMove = Util.randomArray(possibleMoves);
            switch (choosedMove) {
                case "attack":
                    const input = attack({ damages: Util.calcATKDMG(NPC), username: NPC.name }, false, turns[turns.length - 1]);
                    turns[turns.length - 1].logs.push(input);
                    break;
                case "defend":
                    defend();
                    break;
            }
            trns++;
            pushTurn();
            await loadBaseEmbed();
        }
        function triggerAbility(ability: Ability) {
            //if (ability)
        }
        function defend() {
            turns[turns.length - 1].lastMove = "defend";
            turns[turns.length - 1].lastUser = beforeTurnUsername();
            turns[turns.length - 1].logs.push(`> :shield: ${whosTurnUsername()} is now defending.`);
            loadBaseEmbed();
        }
        function isAbility(ability: string | Ability): ability is Ability {
            return (ability as Ability).cooldown !== undefined;
        }

        async function loadBaseEmbed() {
            const povData = whosTurn();
            const components: Array<MessageButton> = [];
            const footer: { text: string } = Util.isNPC(povData) ? { text: "" } : { text: `⚡ You have ${povData.stamina} stamina left.` };
            const content: string = Util.isNPC(povData) ? "[Waiting for your turn...]" : `It's ${ctx.client.users.cache.get(povData.id).username ?? "?"}'s turn.`;

            // BTNS
            if (Util.isNPC(povData)) components.push(NPCBTN);
            else {
                components.push(attackBTN, defendBTN);
                if (povData.stand) components.push(standBTN(povData));
                components.push(forfeitBTN);
            }
            const fields = [];
            for (let i = 0; i < turns.filter(r => r.logs.length !== 0).length; i++) {
                const turn = turns[i];
                fields.push({
                    name: `__Turn ${i + 1}__`,
                    value: turn.logs.join("\n")
                })
            }

            await ctx.makeMessage({
                content: content,
                components: [Util.actionRow(components)],
                embeds: [{
                    title: "Battle ⚔️",
                    description: `\`>>>\` ${ctx.interaction.user.username} (${userData.stand ?? "Stand-less"}) ${Emojis.vs} ${Util.isNPC(opponent) ? opponent.name : ctx.client.users.cache.get(opponent.id)?.username ?? "?"} (${opponent.stand ?? "Stand-less"})\n\n`
                    + `:heart: \`${ctx.interaction.user.username}\` ${userData.health}/${userData.max_health}\n:heart: \`${Util.isNPC(opponent) ? opponent.name : ctx.client.users.cache.get(opponent.id)?.username ?? "?"}\` ${opponent.health}/${opponent.max_health}\n----------------------------------\n`
                    + `:shield: \`${ctx.interaction.user.username}\` ${getShieldStats(userData.id).left}/${getShieldStats(userData.id).left}\n:shield: \`${Util.isNPC(opponent) ? opponent.name : ctx.client.users.cache.get(opponent.id)?.username ?? "?"}\` ${getShieldStats(opponent.id).left}/${getShieldStats(opponent.id).max}\n\n`,
                    footer: footer,
                    color: "BLURPLE",
                    thumbnail: {
                        url: !Util.isNPC(povData) ? ctx.client.users.cache.get(povData.id).displayAvatarURL({dynamic: true}) : ""
                    },
                    fields: fields
                }]
            })
            
        }

        function whosTurn(): NPC | UserData {
            return trns % 2 === 0 ? userData as UserData : opponent as NPC;
        }
        function beforeTurn() {
            return trns % 2 !== 0 ? userData as UserData : opponent as NPC;
        }
        function beforeTurnUsername() {
            const bft = beforeTurn();
            if (Util.isNPC(bft)) return bft.name;
            else return ctx.client.users.cache.get(bft.id)?.username ?? "?";
        }
        function whosTurnUsername() {
            const wt = whosTurn();
            if (Util.isNPC(wt)) return wt.name;
            else return ctx.client.users.cache.get(wt.id)?.username ?? "?";
        }
        function getShieldStats(id: string): { left: number, max: number } {
            return shields.filter(s => s.id === id)[0];
        }
        function attackShield(id: string, damage: number) {
            const shield = getShieldStats(id);
            shield.left -= damage;
            if (shield.left < 0) shield.left = 0;
            return shield;
        }
        function regenerateShieldToUser(id: string) {
            const shield = getShieldStats(id);
            shield.left = shield.max;
        }
        function removeHealthToLastGuy(damage: number) {
            turns[turns.length - 1].lastDamage = damage;
            const lastGuy = beforeTurn();
            lastGuy.health -= damage;
            if (lastGuy.health < 0) lastGuy.health = 0;
        }


    }
};

/* TODO list
- cooldowns when guard broke on function
*/