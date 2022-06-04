import type { Event, InteractionCommand } from '../@types';
import * as Util from '../utils/functions';
import * as Items from '../database/rpg/Items';
import * as Emojis from '../emojis.json';
import InteractionCommandContext from '../structures/Interaction';

export const name: Event["name"] = "interactionCreate";
export const execute: Event["execute"] = async (interaction: InteractionCommand) => {
    if (!interaction.isCommand()) return;
    if (!interaction.client._ready) return interaction.reply({ content: "The bot is still loading, please wait a few seconds and try again."});
    if (await interaction.client.database.getCooldownCache(interaction.user.id)) return interaction.reply({
        content: (interaction.client.translations.get('en-US')("base:COOLDOWN")).replace("{{emojis.jolyne}}", Emojis.jolyne)
    });

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    if (command.cooldown && !isNaN(command.cooldown)) {
        const cd = interaction.client.cooldowns.get(`${interaction.user.id}:${command.name}`);
        if (cd) {
            const timeLeft = cd - Date.now();
            if (timeLeft > 0) {
                return interaction.reply({ content: `You can use this command again in ${(timeLeft / 1000).toFixed(2)} seconds.`, ephemeral: true });
            } else {
                interaction.client.cooldowns.delete(`${interaction.user.id}:${command.name}`);
            }
        } else interaction.client.cooldowns.set(`${interaction.user.id}:${command.name}`, Date.now() + command.cooldown * 1000);
    }

    if (command.category === "adventure") {
        const userData = await interaction.client.database.getUserData(interaction.user.id);
        if (!userData && command.name !== "adventure" && interaction.options.getSubcommand() !== "start") return interaction.reply({ content: interaction.client.translations.get("en-US")("base:NO_ADVENTURE", {
            emojis: Emojis
        })});
        if (command.name === "adventure" && interaction.options.getSubcommand() === "start") command.execute(new InteractionCommandContext(interaction), userData);


        // Quests checker
        let hasChanged: boolean = false;
        for (let i = 0; i < userData.chapter_quests.length; i++) {
            const quest = userData.chapter_quests[i];
            if (quest.completed) continue;

            if (quest.id.startsWith("wait")) {
                if (quest.timeout < Date.now()) {
                    hasChanged = true;
                    quest.completed = true;
                    if (quest.mails_push_timeout) {
                        for (const mail of quest.mails_push_timeout) {
                            userData.mails.push(mail);
                            if (quest.mustRead) {
                                userData.chapter_quests.push({
                                    id: `rdem+${mail.id}`,
                                    completed: false
                                });
                            }
                        }
                    }
                    userData.chapter_quests[i] = quest;
                }
                continue;
            }

        }
        if (hasChanged) interaction.client.database.saveUserData(userData);

        if (command.rpgCooldown) {
            const cd = parseInt(await interaction.client.database.redis.client.get(`jjba:rpg_cooldown_${interaction.user.id}:${command.name}`));
            if (cd && cd > Date.now()) return interaction.reply({ content: interaction.client.translations.get("en-US")(command.rpgCooldown.i18n ?? 'base:RPG_COOLDOWN', {
                time: Util.generateDiscordTimestamp(cd, 'FROM_NOW')
            })});
            await interaction.client.database.redis.client.set(`jjba:rpg_cooldown_${interaction.user.id}:${command.name}`, Date.now() + command.rpgCooldown["base"]);
        }
            
    
        const ctx = new InteractionCommandContext(interaction)
        await command.execute(ctx, userData);

        await Util.wait(2000);
        // Misc
        if (interaction.replied) {
            const newMails = await interaction.client.database.redis.client.get(`jjba:newUnreadMails:${interaction.user.id}`);
            if (newMails) {
                interaction.client.database.redis.client.del(`jjba:newUnreadMails:${interaction.user.id}`);
                interaction.followUp({
                    content: ctx.translate("base:NEW_MAILS", {
                        count: newMails
                    })
                });
            }
            if (await interaction.client.database.getCooldownCache(interaction.user.id)) return;

            while (userData.xp >= Util.getMaxXp(userData.level)) {
                console.log("Level up!");
                userData.xp = userData.xp - Util.getMaxXp(userData.level);
                userData.level++;
                ctx.followUp({
                    content: ctx.translate("base:LEVEL_UP_MESSAGE", {
                        level: userData.level
                    })
                });
                ctx.client.database.saveUserData(userData);
            }
        }
    } else command.execute(new InteractionCommandContext(interaction));

};