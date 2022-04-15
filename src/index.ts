// Import Structures
import Client from './structures/Client';
import { Intents } from 'discord.js';
import { config } from 'dotenv';
import DJSLIGHT from 'discord.js-light';
import Cluster from 'discord-hybrid-sharding';
import fs from 'fs';
import path from 'path';
import i18n from './structures/i18n';

// Import types
import type { SlashCommand, Event } from './@types';

config();

const client = new Client({
    shards: Cluster.data.SHARD_LIST,
    shardCount: Cluster.data.TOTAL_SHARDS,
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
    ],
    makeCache: DJSLIGHT.Options.cacheWithLimits({
        ApplicationCommandManager: 0, // guild.commands
        BaseGuildEmojiManager: 0, // guild.emojis
        ChannelManager: 0, // client.channels
        GuildChannelManager: 0, // guild.channels
        GuildBanManager: 0, // guild.bans
        GuildInviteManager: 0, // guild.invites
        GuildManager: Infinity, // client.guilds
        GuildMemberManager: 0, // guild.members
        GuildStickerManager: 0, // guild.stickers
        GuildScheduledEventManager: 0, // guild.scheduledEvents
        MessageManager: 0, // channel.messages
        PermissionOverwriteManager: 0, // channel.permissionOverwrites
        PresenceManager: 0, // guild.presences
        ReactionManager: 0, // message.reactions
        ReactionUserManager: 0, // reaction.users
        RoleManager: 0, // guild.roles
        StageInstanceManager: 0, // guild.stageInstances
        ThreadManager: 0, // channel.threads
        ThreadMemberManager: 0, // threadchannel.members
        UserManager: Infinity, // client.users
        VoiceStateManager: 0 // guild.voiceStates
    }),
});

async function init() {
    client.translations = await i18n();

    const eventsFile = fs.readdirSync(path.resolve(__dirname, 'events')).filter(file => file.endsWith('.js'));
    const commandsFile = fs.readdirSync(path.resolve(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const eventFile of eventsFile) {
        const event: Event = await import(path.resolve(__dirname, 'events', eventFile));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        client.log(`Loaded event ${event.name}`);
    }

    for (const commandFile of commandsFile) {
        const command: SlashCommand = await import(path.resolve(__dirname, 'commands', commandFile));
        client.commands.set(command.name.toLowerCase(), command);
        client.log(`Loaded command ${command.name}`);
    }
}

init();

process
    .on("unhandledRejection", (err: Error) => {
        client.log(err.stack, "error");
    })
    .on("uncaughtException", (err: Error) => {
        client.log(err.stack, "error");
        process.exit(1);
    });
client.login(process.env.CLIENT_TOKEN);