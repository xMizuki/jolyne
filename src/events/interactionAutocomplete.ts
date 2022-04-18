import type { Event, InteractionAutocomplete, Item } from '../@types';
import * as Items from '../database/rpg/Items'
import * as Util from '../utils/functions';
import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';

const b = new SlashCommandBuilder()
        .setName("test")
        .addStringOption((options) =>
            options.setName("test"))

export const name: Event["name"] = "interactionCreate";
export const execute: Event["execute"] = async (interaction: InteractionAutocomplete) => {
    if (!interaction.isAutocomplete()) return;
    const subCommand = interaction.options.getSubcommand();

    const currentInput = interaction.options.getFocused().toString();
    const items = Object.keys(Items).map(key => {
        return {
            name: Items[key as keyof typeof Items].name,
            value: Items[key as keyof typeof Items].description
        }
    });
    if (subCommand === "info") {
        const itemsFound = items.filter(item => item.name.toLowerCase().includes(currentInput.toLowerCase()) || item.value.toLowerCase().includes(currentInput.toLowerCase()));
        interaction.respond(itemsFound.slice(0, 25))
    }
    if (subCommand === "use") {
        const userData = await interaction.client.database.getUserData(interaction.user.id);
        if (!userData) interaction.respond([]);
        const userItems: Item[] = userData.items.map(v => {
            if (!Util.getItem(v)) return
            return Util.getItem(v);
        }).filter(r => r && r.usable);
        const userUniqueItems: Item[] = [...new Set(userItems)];
        const itemsFound = userUniqueItems.filter(item => item.name.toLowerCase().includes(currentInput.toLowerCase()) || item.description.toLowerCase().includes(currentInput.toLowerCase())).filter(r => r.usable);
        interaction.respond(itemsFound.map(v => {
            return {
                name: v.name + ` (${userData.items.filter((r: string) => Util.getItem(r)?.name === v.name).length} left)`,
                value: v.id
            }
        }).slice(0, 25))  


    }
    
};