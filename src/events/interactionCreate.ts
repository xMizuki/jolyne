import type { Event, InteractionCommand } from '../@types';
import * as Items from '../database/rpg/Items';
import InteractionCommandContext from '../structures/Interaction';

export const name: Event["name"] = "interactionCreate";
export const execute: Event["execute"] = async (interaction: InteractionCommand) => {
    if (!interaction.isCommand()) return;
    if (!interaction.client._ready) return interaction.reply({ content: "The bot is still loading, please wait a few seconds and try again."});

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    if (command.category === "adventure") {
        const userData = await interaction.client.database.getUserData(interaction.user.id);
        command.execute(new InteractionCommandContext(interaction), userData);
    } else command.execute(new InteractionCommandContext(interaction));

};