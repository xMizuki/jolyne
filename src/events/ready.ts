import type { Event, SlashCommand } from '../@types';
import Client from '../structures/Client';
import { Routes } from 'discord-api-types/v9';

export const name: Event["name"] = "ready";
export const once: Event["once"] = true;

export const execute: Event["execute"] = async (client: Client) => {
    client.user.setActivity({ name: "loading..."});

    const lastCommands = await client.database.redis.client.get("jolyne:commands");
    const commandsData = client.commands.map((v: SlashCommand) => v.data);

    if (JSON.stringify(commandsData) !== lastCommands) {
        client.log('Slash commands has changed. Loading...', 'cmd');
        if (process.env.TEST_MODE === "true") {
            await client._rest.put(Routes.applicationGuildCommands(client.user.id, process.env.DEV_GUILD_ID), {
                body: commandsData
            });    
        } else {
            await client._rest.put(Routes.applicationCommands(client.user.id), {
                body: commandsData
            });    
        }
        client.database.redis.client.set("jolyne:commands", JSON.stringify(commandsData));
        client.log('Slash commands are up to date & have been loaded.', 'cmd');    
    } else client.log('Slash commands are already up to date.', 'cmd');

    // Daily quests
    if (client.guilds.cache.random().shardId === 0) {
        
    }
    client._ready = true;
    client.user.setActivity({ name: "The Way To Heaven", type: "WATCHING" });
    client.log(`Ready! Logged in as ${client.user.tag} (${client.user.id})`);
};