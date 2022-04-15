import type { Event, Interaction } from '../@types';

export const name: Event["name"] = "interactionCreate";
export const execute: Event["execute"] = async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    if (!interaction.client._ready) return interaction.reply("The bot is still loading, please wait a few seconds and try again.");

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    if (command.category === "adventure") {
        const userData = await interaction.client.database.getUserData(interaction.user.id);
        command.execute(interaction, userData);
    } else command.execute(interaction);

}