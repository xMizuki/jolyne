import Client from "../structures/Client";
import CommandInteractionContext from "../structures/Interaction";
import type { CommandInteraction, Interaction, ColorResolvable, AutocompleteInteraction, Snowflake } from "discord.js";

/**
 * Discord Slash Command Interaction.
 */
interface InteractionCommand extends CommandInteraction {
  /**
   * The Discord Client.
   * @type {Client}
   * @readonly
   */
  client: Client;
}

/**
 * Discord Slash Command Interaction.
 */
 interface InteractionAutocomplete extends AutocompleteInteraction {
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
  cooldown: number = 3;
  /**
   * The cooldown of the command (RPG).
   */
  rpgCooldown?: {
    base: number,
    premium: number,
    i18n?: string
  }
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
  data: DiscordSlashCommandsData;
  /**
   * This is the function that will be called when the command is executed.
   * @param Interaction The CommandInteraction object from the interactionCreate event.
   */
  execute: (...args: any) => void;
}

/**
 * Disord Slash Command Data.
 */
interface DiscordSlashCommandsData {
  name: string,
  description: string,
  autocomplete?: boolean,
  required?: boolean,
  type?:
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  options?: DiscordSlashCommandsData[]
  choices?: {
    name: string,
    value: string
  }[]
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
  readonly id: Snowflake;
  /**
   * The user's Discord Tag.
   */
  tag: string;
  /**
   * The user's inventory.
   */
  items: Item["id"][];
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
  language: supportedLanguages;
  /**
   * The user's stand.
   */
  stand?: Stand["name"];
  /**
   * The user's skill points.
   */
  skill_points: SkillPoints;
  /**
   * The user's chapter quests.
   */
  chapter_quests: Quest[];
  /**
   * The user's side quests.
   */
  side_quests: Quest[];
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
  /**
   * The user's mails
   */
  mails: Mail[];
  /**
   * Daily infos.
   */
  daily: {
    claimedAt: number,
    streak: number,
    quests: Quest[]
  },
  /**
   * The user's stats (battle won, lost etc).
   */
  stats: {
    rankedBattle?: {
      wins: number,
      losses: number
    },
    [key: string]: string;
  }
}

/**
 * A quest object.
 */
interface Quest {
  /**
   * The Quest's ID.
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
   * The quest's rewards.
   */
  rewards?: Prize;
  /**
   * The quest's emoji
   */
  emoji?: string;
  /**
   * ...
   */
  timeout?: number;
  health?: number;
  i18n?: string;
  npc?: NPC;
  email_timeout?: string;
  mails_push_timeout?: Mail[];
  mustRead?: boolean;
  action?: (...args: any) => void;
}

/**
 * A chapter object.
 */
interface Chapter {
  /**
   * The chapter's ID
   */
  id: number;
  /**
   * The chapter's description
   */
  description?: Languages;
  /**
   * The chapter's title
   */
  title?: Languages;
  /**
   * Tips for the chapter
   */
  tips?: Languages;
  /**
   * Mails given by the chapter
   */
  mails?: Mail[];
  /**
   * Items given by the chapter
   */
  items?: Item[];
  /**
   * Chapter quests
   */
  quests: Quest[];
  /**
   *  Chapter dialogues
   */
  dialogues?: Languages;
  /**
   * The chapter's parent (if it is not a chapter but a part)
   */
  parent?: Chapter;
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
  /**
   * If the ability is an ultimate ability.
   */
  readonly ultimate?: boolean;
  /**
   * Trigger the ability (only if it's a special ability).
   */
  trigger?: (ctx: CommandInteractionContext, promises: any, promisesOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => any;
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
  readonly color: ColorResolvable;
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
  readonly text: StandText;
  /**
   * The stand's emoji
   */
  readonly emoji: string;
  /**
   * If the stand is available.
   */
  readonly available: boolean;
}

/**
 * StandText interface.
 */
interface StandText {
  awaken_text: string;
  awakening_text: string;
  timestop_text?: string;
  timestop_end_text?: string;
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
   * The item's ID.
   */
  readonly id: string;
  /**
   * The item's name.
   */
  readonly name: string;
  /**
   * The item's description.
   */
  readonly description: string;
  /**
   * The item's rarity
   */
  readonly rarity?: "C" | "B" | "A" | "S" | "SS";
  /**
   * The item's type.
   */
  readonly type: "consumable" | "box" | "cloth" | "arrow" | "body_part" | "scroll" | "disc" | "other";
  /**
   * The item's price.
   */
  readonly price?: number;
  /**
   * If the item is tradable.
   */
  readonly tradable: boolean;
  /**
   * If the item is storable.
   */
  readonly storable: boolean;
  /**
   * If the item is usable.
   */
  readonly usable: boolean;
  /**
   * The item's emoji.
   */
  readonly emoji: string;
  /**
   * The item's benefits.
   */
  readonly benefits?: ItemBenefits;
  /**
   * Bonuses if it's a cloth.
   */ 
  readonly cloth_bonuses?: ClothBonuses;
  /**
   * Function to use the item (if not consumable)
   */
  readonly use?: (ctx: CommandInteractionContext, userData: UserData, skip?: boolean, left?: number) => Promise<any>;
}

/**
 * Shop interface
 */
interface Shop {
  /**
   * The shop's name.
   * @readonly
   */
  readonly name: string;
  /**
   * The shop's items.
   * @readonly
   * @type {Item[]}
   */
  readonly items: Item[];
  /**
   * The shop's emoji.
   * @readonly
   * @type {string}
   */
  readonly emoji: string;
  /**
   * The shop's hex-color code.
   * @readonly
   * @type {ColorResolvable}
   * @default "#ffffff"
   * @example
   * "#ffffff"
   * "#000000"
   * "#ff0000"
   * "#00ff00"
   */
  readonly color?: ColorResolvable;
  /**
   * The date when the shop is open.
   */
  readonly open_date?: `${number}-${number}` | number;
}

interface ItemBenefits {
  health?: number;
  stamina?: number;
  stand?: string | null;
}

interface ClothBonuses {
  health?: number | string;
  stamina?: number | string;
  perception?: number | string;
  strength?: number | string;
}

interface Mail {
  /**
   * The mail's ID.
   */
  readonly id: string;
  /**
   * The mail's author
   */
  readonly author: NPC;
  /**
   * The mail's obejct.
   */
  readonly object: string;
  /**
   * The mail's content
   */
  readonly content: string;
  /**
   * The mail's image URL
   */
  readonly image?: string;
  /**
   * The mail's  date
   */
  readonly date: number;
  /**
   * The mail's footer
   */
  readonly footer: string;
  /**
   * The mail's prize(s)
   */
  prize?: Prize;
  /**
   * The mail emoji (if set)
   */
  readonly emoji?: string;
  /**
   * The mail's quests
   */
  chapter_quests?: Quest[];
  /**
   * If the mail has been archived
   */
  archived: boolean;
}

/**
 * Mail Author interface
 */
interface NPC {
  /**
   * The NPC's ID.
   */
  readonly id: string;
  /**
   * The NPC's author's name.
   */
  readonly name: string;
  /**
   * The NPC's author's e-mail.
   */
  readonly email?: string;
  /**
   * The NPC's author emoji
   */
  readonly emoji: string;
    /**
   * The NPC's level.
   * @readonly
   * @type {number}
   * @memberof Quest
   */
  readonly level?: number;
  /**
   * The NPC's max health.
   * @type {number}
   * @memberof Quest
   */
  max_health?: number;
  /**
   * The NPC's stamina.
   * @type {number}
   * @memberof Quest
   */
  max_stamina?: number; // NPCs doesn't have max_stamina
  /**
   * The NPC's skill-points.
   * @memberof Quest
   * @readonly
   */
  readonly skill_points?: SkillPoints;
  /**
   * The NPC's stand.
   * @type {string}
   * @memberof Quest
   * @readonly
   */
  stand?: string;
  /**
   * The NPC's rewards when he's defeated.
   */
  fight_rewards?: Prize;
  /**
   * The NPC's dialogues.
   */
  dialogues?: {
    [key: string]: string;
  }
  /**
   * The NPC's avatar URL.
   */
  avatarURL?: string;

  /**
   * BATTLE VALUES
   */
   stamina?: number;
   health?: number;
 

  
}

interface Prize {
  xp?: number,
  money?: number,
  items?: Item[],
}

interface Turn {
  lastMove: string,
  logs: Array<string>,
  lastDamage: number
}

interface Languages {
    "en-US": string | string[];
    "fr-FR": string | string[];
    "es-ES": string | string[];
    "de-DE": string | string[];
}

type supportedLanguages = "en-US" | "fr-FR" | "es-ES" | "de-DE";