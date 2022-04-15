import { SlashCommandBuilder } from '@discordjs/builders';
import Client from '../structures/Client';
import type { CommandInteraction, Interaction, Message } from 'discord.js';

/**
 * Discord Slash Command Interaction.
 */
interface Interaction extends CommandInteraction {
    /**
     * The Discord Client.
     * @type {Client}
     * @readonly
     */
    client: Client;
}

/**
 * Discord Message.
 */
 interface Message extends Message {
    /**
     * The Discord Client.
     * @type {Client}
     * @readonly
     */
    client: Client;
}

/**
 * A CommandInteraction object used to create Discord Slash Commands.
 */
interface SlashCommand {
    /**
     * The name of the command.
     */
    name: string;
    /**
     * The category of the command.
     */
    category: string;
    /**
     * The cooldown of the command.
     */
    cooldown?: number | 3;
    /**
     * The category of the command.
     */
    category: 'adventure' | 'utils' | 'others';
    /**
     * The examples of the command.
     */
    examples?: string[];
    /**
     * The data as SlashCommandBuilder.
     */
    data: JSON<any>;
    /**
     * This is the function that will be called when the command is executed.
     * @param Interaction The CommandInteraction object from the interactionCreate event.
     */
    execute: (...args: any[]) => void;
}

/**
 * A command object used for formatting SlashCommands (used in the help command).
 */
interface command {
    /**
     * The name of the command.
     */
    cooldown: number;
    /**
     * The category of the command.
     */
    category: string;
    /**
     * The options as SlashCommandBuilder.
     */
    options: any[];
    /**
     * The name of the command.
     */
    name: string;
    /**
     * The description of the command.
     */
    description: string;
    /**
     * If this option is required or not.
     */
    required?: boolean;
    /**
     * The data as SlashCommandBuilder.
     */
    data?: command;
    /**
     * Examples of the command.
     */
    examples?: string[];
}

/**
 * An object used to use events.
 */
interface Event {
    /**
     * The name of the event.
     */
    name: string;
    /**
     * If this event must be called only once.
     */
    once?: boolean;
    /**
     * The function that will be called when the event is triggered.
     */
    execute: (...args: any[]) => void;
}


/**
 * Player's Data Interface.
 */
interface UserData {
    /**
     * The user's Discord ID.
     * @readonly
     */
    readonly id: string;
    /**
     * The user's Discord Tag.
     */
    tag: string;
    /**
     * The user's inventory.
     */
    items: string[];
    /**
     * The user's levle.
     */
    level: number;
    /**
     * The user's xp.
     */
    xp: number;
    /**
     * The user's health.
     */
    health: number;
    /**
     * The user's max health (skill points, level, stand bonuses).
     */
    max_health: number;
    /**
     * The user's stamina.
     */
    stamina: number;
    /**
     * The user's max stamina (skill points, level, stand bonuses).
     */
    max_stamina: number;
    /**
     * The user's chapter.
     */
    chapter: number;
    /**
     * The user's money.
     */
    money: number;
    /**
     * The user's prefered language.
     */
    language: string;
    /**
     * The user's stand.
     */
    stand?: string;
    /**
     * The user's skill points.
     */
    skill_points: JSON<{ 
        strength: number;
        defense: number;
        perceptibility: number; // (perception)
        stamina: number;
    }>;
    /**
     * The user's chapter quests.
     */
    quests: Array;
    /**
     * The user's daily quests.
     */
    squests: Array;
    /**
     * The date when the user started their adventure.
     */
    adventureat: number;
    /**
     * The user's skill points (including bonuses).
     */
    spb?: JSON<{ 
        strength: number;
        defense: number;
        perceptibility: number; // (perception)
        stamina: number;
    }>;
    /**
     * The user's dodge chances.
     */
    dodge_chances?: number;
}

/**
 * NPCs Interface.
 */
interface NPC {
    /**
     * The NPC's ID.
     * @readonly
     */
    readonly id: string;
    /**
     * The NPC's name.
     * @readonly
     * @type {string}
     * @memberof NPC
     */
    readonly name?: string;
    /**
     * The NPC's level.
     * @readonly
     * @type {number}
     * @memberof NPC
     */
    readonly level?: number;
    /**
     * The NPC's health.
     * @type {number}
     * @memberof NPC
     */
    health?: number;
    /**
     * The NPC's max health.
     * @type {number}
     * @memberof NPC
     */
    max_health?: number;
    /**
     * The NPC's stamina.
     * @type {number}
     * @memberof NPC
     */
    stamina?: number; // NPCs doesn't have max_stamina
    /**
     * The NPC's skill-points.
     * @memberof NPC
     * @readonly
     */
    readonly skill_points?: JSON<{
        strength: number;
        defense: number;
        perceptibility: number; // (perception)
        stamina: number;
    }>;
    /**
     * The NPC's stand.
     * @type {string}
     * @memberof NPC
     * @readonly
     */ 
    readonly stand?: string;
    /**
     * If the NPC has been defeated.
     * @type {boolean}
     * @memberof NPC
     */
    completed: boolean;
}

/**
 * A quest object.
 */
interface Quest extends NPC {
    /**
     * The quest's description.
     * @readonly
     * @type {JSON}
     * @memberof Quest
     */
    readonly description: JSON<{
        english: string;
        french?: string;
        german?: string;
        spanish?: string;
    }>;

    // Too lazy to comment.
    email_timeout?: string;
    emoji?: string;

}


// Stopping commenting from now on. plz do it for me