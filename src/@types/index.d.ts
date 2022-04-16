import Client from "../structures/Client";
import type { CommandInteraction, Interaction } from "discord.js";

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
  category: "adventure" | "utils" | "others";
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
  execute: (...args: any) => void;
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
  options: string[];
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
  execute: (...args: any) => void;
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
  skill_points: SkillPoints;
  /**
   * The user's chapter quests.
   */
  chapter_quests: Array;
  /**
   * The user's daily quests.
   */
  daily_quests: Array;
  /**
   * The user's side quests.
   */
  side_quests: Array;
  /**
   * The date when the user started their adventure.
   */
  adventureat: number;
  /**
   * The user's skill points (including bonuses).
   */
  spb?: SkillPoints;
  /**
   * The user's dodge chances.
   */
  dodge_chances?: number;
}

/**
 * A quest object.
 */
interface Quest {
  /**
   * The NPC's ID.
   * @readonly
   */
  readonly id: string;
  /**
   * Total x collected
   */
  total?: number;
  /**
   * If the quest has been completed
   */
  completed?: boolean = false;
  /**
   * The quest's title.
   */
  title?: JSON<{
    "en-US": string;
    "fr-FR": string;
    "es-ES": string;
    "de-DE": string;
  }>;
  /**
   * The quest's description.
   */
  description?: JSON<{
    "en-US": string;
    "fr-FR": string;
    "es-ES": string;
    "de-DE": string;
  }>;
  /**
   * The quest's emoji
   */
  emoji?: string;
  /**
   * ,
   */
  timeout?: number;
  health?: number;
  i18n?: string;
}

/**
 * NPCs Interface.
 */
interface NPC extends Quest {
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
}

/**
 * A chapter object.
 */
interface Chapter {
  /**
   * The chapter's description
   */
  description?: JSON<{
    "en-US": string;
    "fr-FR": string;
    "es-ES": string;
    "de-DE": string;
  }>;
  /**
   * The chapter's title
   */
  title?: JSON<{
    "en-US": string;
    "fr-FR": string;
    "es-ES": string;
    "de-DE": string;
  }>;
  /**
   * Tips for the chapter
   */
  tips?: JSON<{
    "en-US": string;
    "fr-FR": string;
    "es-ES": string;
    "de-DE": string;
  }>;
  /**
   * Mails given by the chapter
   */
  mails?: Array;
  /**
   * Items given by the chapter
   */
  items?: Array;
  /**
   * Chapter quests
   */
  quests?: Array;
}

/**
 * Abilities Interface.
 */
interface Ability {
  /**
   * The ability's name.
   */
  readonly name: string;
  /**
   * The ability's description.
   */
  readonly description: string;
  /**
   * The ability's cooldown.
   */
  readonly cooldown: number;
  /**
   * The ability's base damages.
   */
  readonly damages: number;
  /**
   * If the ability is blockable.
   */
  readonly blockable: boolean;
  /**
   * If the ability is dodgeable.
   */
  readonly dodgeable: boolean;
  /**
   * How much stamina the ability costs.
   */
  readonly stamina: number;
}

/**
 * Stand Interface.
 */
interface Stand {
  /**
   * The stand's name.
   */
  readonly name: string;
  /**
   * The stand's rarity.
   */
  readonly rarity: "C" | "B" | "A" | "S" | "SS";
  /**
   * The stand's description.
   */
  readonly description: string;
  /**
   * The stand's skill points bonuses.
   */
  readonly skill_points: SkillPoints;
  /**
   * The stand's color
   */
  readonly color: string;
  /**
   * The stand's image URL.
   */
  readonly image: string;
  /**
   * The stand's abilities.
   */
  readonly abilities: Array<Ability>;
  /**
   * Other stuffs
   */
  readonly other: JSON<{
    [key: string]: any;
  }>;
  /**
   * The stand's emoji
   */
   readonly emoji: string;
  /**
   * If the stand is available.
   */
   readonly private available: boolean;
}

/**
 * Skill Points interface
 */
interface SkillPoints {
  perception: number;
  strength: number;
  defense: number;
  stamina: number;
}

/**
 * Item interface
 */
interface Item {
    /**
     * The item's name.
     */
    readonly name: string;
    /**
     * The item's description.
     */
    readonly description: string;
    /**
     * The item's type.
     */
    readonly type: "food" | "box" | "cloth" | "arrow";
    /**
     * The item's cost
     */
    readonly cost: number;
    /**
     * If the item is tradable
     */
    readonly tradable: boolean;
    /**
     * If the item is storable
     */
    readonly storable: boolean;
    /**
     * The item's emoji
     */
    readonly emoji: string;
    /**
     * The item's benefices
     */
    readonly benefices: Item_Benefices;
}

interface Item_Benefices {
    health?: number,
    stamina?: number,
    stand?: string
}