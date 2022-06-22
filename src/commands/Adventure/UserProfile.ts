import type { SlashCommand, UserData } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Stands from '../../database/rpg/Stands';
import * as Util from '../../utils/functions';
import * as Emojis from '../../emojis.json';

export const name: SlashCommand["name"] = "profile";
export const category: SlashCommand["category"] = "adventure";
export const cooldown: SlashCommand["cooldown"] = 5;
export const data: SlashCommand["data"] = {
    name: "profile",
    description: "🔱 Display your bizarre profile (or someone's else).",
    options: [
        {
            name:"user",
            description:"The user whose profile you want to see",
            required: false,
            type:6
        }
    ]
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    const userOption = ctx.interaction.options.getUser("user");
    if (userOption) {
        userData = await ctx.client.database.getUserData(userOption.id);
        if (!userData) return ctx.sendT("base:USER_NO_ADVENTURE");
    }
    const rows: UserData[] = (await ctx.client.database.redis.client.keys("cachedUser*").then(async keys => await Promise.all(keys.map(async key => JSON.parse(await ctx.client.database.redis.client.get(key))))));// OLD CODE (causing too much latency) await ctx.client.database.postgres.client.query(`SELECT * FROM users WHERE adventureat IS NOT NULL AND level IS NOT NULL AND xp IS NOT NULL ORDER BY level DESC, xp DESC`).then(r => r.rows);
    console.log(rows[0].id)
    const userGlobalPosition = rows.sort((a: UserData, b: UserData) => (b.level * 100000) + b.xp - (a.level * 100000) + a.xp).findIndex(p => p.id === userData.id) + 1;
    const userRankedPosition = (() => {
        function getRatio(user: UserData) {
            let ratio: string | number = (user.stats.rankedBattle?.wins ?? 0) / (user.stats.rankedBattle?.losses ?? 0);
            if (isNaN(ratio)) ratio = -1;
            if (ratio === Infinity && (user.stats.rankedBattle?.wins ?? 0) < 3) ratio = -1
            return ratio;            
        }
        return rows.filter(r => getRatio(r) !== -1).sort((a: UserData, b: UserData) => (getRatio(b) * 100) - (getRatio(a) * 100)).findIndex(p => p.id === userData.id) + 1;

    })();
    const userMoneyPosition = rows.sort((a: UserData, b: UserData) => b.money - a.money).findIndex(p => p.id === userData.id) + 1;
    const userStand = userData.stand ? Util.getStand(userData.stand) : null;
    let color: ColorResolvable = (await ctx.client.database.redis.client.get(`color${userData.level}_${userData.level}`)) as ColorResolvable;
    if (!color) {
        const randomHex =  [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        color = `#${randomHex}`;
        ctx.client.database.redis.client.set(`color${userData.level}_${userData.level}`, color);
    }
    checkLVL();
    function checkLVL() {
        if (userData.xp >= Util.getMaxXp(userData.level)) {
            userData.xp = userData.xp - Util.getMaxXp(userData.level);
            userData.level++;
            if (userData.xp >= Util.getMaxXp(userData.level)) checkLVL();
        }
    }
    let ratio: string | number = userData.stats.rankedBattle.wins / userData.stats.rankedBattle.losses;
    if (isNaN(ratio)) ratio = 'Not ranked.';
    if (ratio === Infinity && userData.stats.rankedBattle.wins < 3) ratio = 'Not enough ranked.'

    const embed = new MessageEmbed()
        .setAuthor({ name: userData.tag, iconURL: userOption?.displayAvatarURL({ dynamic: true }) ?? ctx.interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(ctx.translate("profile:ADVENTUREAT", {
            rUnix: Util.generateDiscordTimestamp(userData.adventureat, 'FROM_NOW'), //`<t:${(userData.adventureat/1000).toFixed(0)}:R>`,
            dUnix: Util.generateDiscordTimestamp(userData.adventureat, 'DATE') //`<t:${(userData.adventureat/1000).toFixed(0)}:D>`,
        }))
        .addField("Player Infos", `:heart: HP: ${Util.localeNumber(userData.health)}/${Util.localeNumber(userData.max_health)}\n:zap: Stamina: ${Util.localeNumber(userData.stamina)}/${Util.localeNumber(userData.max_stamina)}`, true)
        .addField("Rank", `:globe_with_meridians: \`${userGlobalPosition}\`/\`${rows.length}\`\n⚔️ \`${userRankedPosition}\`/\`${rows.length}\`\n${Emojis.jocoins} \`${userMoneyPosition}\`/\`${rows.length}\``, true)
        .setColor(color)
        .addField(ctx.translate("profile:STATS"), `${Emojis.a_} LVL: ${userData.level}\n${Emojis.xp} XP: ${Util.localeNumber(userData.xp)}/${Util.localeNumber(Util.getMaxXp(userData.level))}\n${Emojis.jocoins} Coins: ${Util.localeNumber(userData.money)}`, true)
        .addField("Combat Infos", `:crossed_swords: ATK Damages: ${Util.getATKDMG(userData)}\n🍃 Dodge Chances: ~${userData.dodge_chances}%`, true)
        .addField("Stand", userStand ? `${userStand.emoji} ${userStand.name}` : "Stand-less", true)
        .addField("Combat Stats [RANKED]", `🇼ins: ${Util.localeNumber(userData.stats.rankedBattle.wins)}\n🇱osses: ${Util.localeNumber(userData.stats.rankedBattle.losses)}\n:regional_indicator_w:/:regional_indicator_l: Ratio: ${ratio}`, true)
    if (userStand) embed.setThumbnail(userStand.image);

    ctx.makeMessage({
        embeds: [embed]
    });
};
