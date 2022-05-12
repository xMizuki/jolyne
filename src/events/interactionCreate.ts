import type { Event, InteractionCommand } from '../@types';
import * as Items from '../database/rpg/Items';
import * as Emojis from '../emojis.json';

import InteractionCommandContext from '../structures/Interaction';

export const name: Event["name"] = "interactionCreate";
export const execute: Event["execute"] = async (interaction: InteractionCommand) => {
    if (!interaction.isCommand()) return;
    if (!interaction.client._ready) return interaction.reply({ content: "The bot is still loading, please wait a few seconds and try again."});

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

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
    
        await command.execute(new InteractionCommandContext(interaction), userData);

        // Misc
        if (interaction.replied) {
            const newMails = await interaction.client.database.redis.client.get(`jjba:newUnreadMails:${interaction.user.id}`);
            if (newMails) {
                interaction.client.database.redis.client.del(`jjba:newUnreadMails:${interaction.user.id}`);
                interaction.followUp({
                    content: interaction.client.translations.get(userData.language)("base:NEW_MAILS", {
                        count: newMails
                    })
                });

            }

        }
    } else command.execute(new InteractionCommandContext(interaction));

};