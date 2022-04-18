import type { SlashCommand, UserData } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../structures/Interaction';
import * as Stands from '../database/rpg/Stands';
import * as Util from '../utils/functions';
import * as Emojis from '../emojis.json';

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
    const rows: UserData[] = await ctx.client.database.postgres.client.query(`SELECT * FROM users WHERE adventureat IS NOT NULL AND level IS NOT NULL AND xp IS NOT NULL ORDER BY level DESC, xp DESC`).then(r => r.rows);
    const userPosition = rows.findIndex(p => p.id === ctx.interaction.user.id) + 1;
    const userStand = userData.stand ? Stands[(userData.stand.replace(/ /gi, "_").replace(/:/gi, "_")) as keyof typeof Stands] : null;
    let color: ColorResolvable = "GREY";
    if (userStand) {
        if (userStand.rarity === "SS" && userData.level < 5) {
            color = "#2b82ab";
        } else if (userStand.rarity === "S" && userData.level < 5) {
            color = "#3b8c4b";
        } else if (userStand.rarity === "A" && userData.level < 5) {
            color = "#786d23";
        } else if (userStand.rarity === "B" && userData.level < 5) {
            color = "#9b8c4b";
        } else if (userStand.rarity === "C" && userData.level < 5) {
            color = "#9b8c4b";
        } else if (userStand.rarity === "SS" && userData.level >= 5) {
            color = "#2b82ab";
        } else if (userStand.rarity === "S" && userData.level >= 5) {
            color = "#3b8c4b";
        } else if (userStand.rarity === "A" && userData.level >= 5) {
            color = "#786d23";
        } else if (userStand.rarity === "B" && userData.level >= 5) {
            color = "#9b8c4b";
        } else if (userStand.rarity === "C" && userData.level >= 5) {
            color = "#9b8c4b";
        } else {
            color = "#9b8c4b";
        }
    
    }


    const embed = new MessageEmbed()
        .setAuthor({ name: userData.tag, iconURL: userOption?.displayAvatarURL({ dynamic: true }) ?? ctx.interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(ctx.translate("profile:ADVENTUREAT", {
            rUnix: `<t:${(userData.adventureat/1000).toFixed(0)}:R>`,
            dUnix: `<t:${(userData.adventureat/1000).toFixed(0)}:D>`,
        }))
        .addField(ctx.translate("profile:STATS"), `${Emojis.a_} LVL: ${userData.level}\n${Emojis.xp} XP: ${Util.localeNumber(userData.xp)}/${Util.localeNumber(Util.getMaxXp(userData.level))}\n${Emojis.jocoins} Coins: ${userData.money}`, true)
        .addField("Rank", `:globe_with_meridians: \`${userPosition}\`/\`${rows.length}\``, true)
        .setColor(color)
        .addField("Player Infos", `:heart: HP: ${Util.localeNumber(userData.health)}/${Util.localeNumber(userData.max_health)}\n:zap: Stamina: ${Util.localeNumber(userData.stamina)}/${Util.localeNumber(userData.max_stamina)}`, true)
        .addField("Combat Stats", `:crossed_swords: ATK Damages: ${Util.getATKDMG(userData)}\n🍃 Dodge Chances: ~${userData.dodge_chances}%`, true)
        .addField("Stand", userStand ? `${userStand.emoji} ${userStand.name}` : "Stand-less", true);
    if (userStand) embed.setThumbnail(userStand.image);

    ctx.makeMessage({
        embeds: [embed]
    });
};
