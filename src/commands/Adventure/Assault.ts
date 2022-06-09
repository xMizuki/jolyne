import type { SlashCommand, UserData, Item, NPC } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import type { Quest, Chapter } from '../../@types';
import * as Util from '../../utils/functions';
import * as NPCs from '../../database/rpg/NPCs';
import * as Emojis from '../../emojis.json';
import * as Quests from '../../database/rpg/Quests';

export const name: SlashCommand["name"] = "assault";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 3;
export const rpgCooldown: SlashCommand["rpgCooldown"] = {
    base: 60000 * 5,
    premium: 60000 * 2,
    emoji: Emojis['JolyneAhhhhh']

}
export const data: SlashCommand["data"] = {
    name: "assault",
    description: "Assault a random person in the city"
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    if (userData.health <= 0) {
        ctx.client.database.redis.client.del(`jjba:rpg_cooldown_${userData.id}:assault`);
        return ctx.sendT("base:DEAD");
    }
    const rng: {
        npc: NPC,
        luck: number
    }[] = [{
        npc: NPCs.Jotaro,
        luck: 0.25
    }, {
        npc: NPCs.Dio,
        luck: 0.5
    }, {
        npc: NPCs.Police_Officer,
        luck: 20
    }, {
        npc: NPCs["Mysterious_Stand_User"],
        luck: 10
    }, {
        npc: NPCs["Normal_Citizen"],
        luck: 100
    }, {
        npc: NPCs.Weak_Bandit,
        luck: 60
    }, {
        npc: NPCs.Bandit_Boss,
        luck: 40
    }];

    Util.forEveryQuests(userData, (q: Quest) => q.id.startsWith("assault") && (parseInt(q.id.split(":")[1]) > q.total), (quest: Quest) => {
        quest.total++;
    });

    await ctx.client.database.saveUserData(userData);

    const luck = Util.getRandomInt(1, 10000);
    const NPC = rng.filter(l => (l.luck * 100) >= luck).sort((a, b) => a.luck - b.luck)[0].npc;

    let protectedNPC: NPC = {
        ...NPC
    }

    ctx.client.database.setCooldownCache("cooldown", userData.id);
    await ctx.defer();
    await ctx.followUp({
        content: `${NPC.dialogues?.assault ? Util.makeNPCString(NPC) + " " + NPC.dialogues.assault : `You assaulted ${Util.makeNPCString(NPC)}`}`,
    });
    await Util.wait(3000);
    await ctx.client.database.delCooldownCache("cooldown", userData.id);
    delete require.cache[require.resolve('../../database/rpg/NPCs')];
    await ctx.client.commands.get("fight").execute(ctx, userData, protectedNPC);
};