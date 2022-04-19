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

    
};