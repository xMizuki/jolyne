import type { UserData, NPC } from '../@types';
import JolyneClient from './Client';
import { CommandInteraction, MessagePayload, InteractionReplyOptions, Message, InteractionCollector, Collection, MessageButton, MessageSelectMenu, MessageActionRowComponentResolvable, MessageComponentInteraction, User } from 'discord.js';
import { APIMessage } from 'discord-api-types';
import * as Util from '../utils/functions';
import * as NPCs from '../database/rpg/NPCs';
const NPCArray = Object.keys(NPCs).map(n => NPCs[n as keyof typeof NPCs]);
const NPCStrings: any = {};
for (const NPC of NPCArray) {
  NPCStrings[NPC.id] = Util.makeNPCString(NPC);
}
const collectorsCache: Collection<string, string> = new Collection();

export default class InteractionCommandContext {
  _timeoutCollector: NodeJS.Timeout;
  constructor(
    public interaction: CommandInteraction & { client: JolyneClient },
  ) {}

  get client(): JolyneClient {
    return this.interaction.client;
  }

  get author(): User {
    return this.interaction.user;
  }


  async defer(
    options?: MessagePayload | InteractionReplyOptions,
    ephemeral = false,
  ): Promise<void> {
    if (this.interaction.deferred && options) {
      await this.followUp(options);
      return;
    }

    await this.interaction
      .deferReply({ ephemeral });
  }

  // eslint-disable-next-line class-methods-use-this

  private resolveMessage(message: Message | APIMessage | null): Message | null {
    if (!message) return null;
    if (message instanceof Message) return message;
    // @ts-expect-error Message constructor is private, but we need it.
    return new Message(this.client, message);
  }

  async makeMessage(options: object): Promise<Message | null> {
    if (this.interaction.replied || this.interaction.deferred)
      return this.resolveMessage(
        await this.interaction
          .editReply(options)
      );

    return this.resolveMessage(
      await this.interaction
        .reply({ ...options, fetchReply: true })
    );
  }

  async followUp(options: MessagePayload | InteractionReplyOptions): Promise<Message | null> {
    return this.resolveMessage(
      await this.interaction
        .followUp(options)
    );
  }

  async sendT(text: string, options: any = {}): Promise<Message | null> {
    const messageOptions: any = {
      content: this.translate(text, options)
    };

    if (options.embed) messageOptions.embed = options.embed;
    if (options.files) messageOptions.files = options.files;
    if (options.components) messageOptions.components = options.components;

    return this.makeMessage(messageOptions);
  }

  async fetchReply(): Promise<Message | null> {
    return this.resolveMessage(
      await this.interaction
        .fetchReply()
    );
  }

  async deleteReply(): Promise<void | null> {
    return this.interaction
      .deleteReply();
  }

  async disableInteractionComponents() {
    const interaction = await this.interaction.fetchReply();
    if (interaction.components.length === 0) return;
    const disabledComponents = interaction.components.map(c => {
      c.components.map(v => {
        v.disabled = true;
        return v;
      })
      return c;
    });
    this.makeMessage({ components: disabledComponents });
  }
  

  timeoutCollector(collector: InteractionCollector<any>, time = 120000, disableComponents?: boolean): NodeJS.Timeout {
    clearTimeout(this._timeoutCollector);
    if (!collectorsCache.has(collector.messageId)) {
      collectorsCache.set(collector.messageId, collector.messageId);
      collector.on('end', async (int: any, reason: string) => {
        console.log(reason)
        collectorsCache.delete(collector.messageId);
        if (!disableComponents) {
          if (reason) {
            if (!reason.includes('DONT_DISABLE_COMPONENTS')) this.disableInteractionComponents();
          } else this.disableInteractionComponents();
        }
      });
    }
    return this._timeoutCollector = setTimeout(async () => {
      if (collector.ended) return;
      collector.stop();
    }, time);

  }
  async componentAntiCheat(i: MessageComponentInteraction, userData: UserData): Promise<boolean> {
    const currentData = await this.client.database.getUserData(userData.id);
    if (!currentData) return true;
    if (await this.client.database.getCooldownCache(currentData.id)) return true;
    userData = currentData;
    return false;
  }

  translate(text: string, translateVars: any = {}): string {
    translateVars.emojis = this.client._emojis;
    translateVars.user = this.interaction.user;
    translateVars.npc = NPCStrings;
    if (this.interaction.options.getUser("user")) translateVars.user_option = this.interaction.options.getUser("user");
    return this.client.translations.get(this.client.database.languages.get(`${this.interaction.guild?.id}`) || 'en-US')(text, translateVars) || text;
  }
  translateObject(text: string, translateVars: any = {}): any[] {
    translateVars.returnObjects = true;
    return (this.translate(text, translateVars) as any);
  }
  convertMs(milliseconds: number): string {
    const and = this.translate("base:AND");
    const day = this.translate("base:DAY");
    const hour = this.translate("base:HOUR");
    const minute = this.translate("base:MINUTE");
    const second = this.translate("base:SECOND");
    const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
    const days: number = roundTowardsZero(milliseconds / 86400000),
        hours = roundTowardsZero(milliseconds / 3600000) % 24,
        minutes = roundTowardsZero(milliseconds / 60000) % 60,
        seconds = roundTowardsZero(milliseconds / 1000) % 60;
    const isDays = days > 0,
        isHours = hours > 0,
        isMinutes = minutes > 0,
        isSeconds = seconds > 0;
    const pattern =
        (!isDays ? `` : (isMinutes || isHours) ? `{days} ${day}(s), ` : `{days} ${day}(s) and `) +
        (!isHours ? `` : (isMinutes) ? `{hours} ${hour}(s), ` : `{hours} ${hour}(s) and `) +
        (!isMinutes ? `` : `{minutes} ${minute}(s)`) +
        (!isSeconds ? `` : ` and {seconds} ${second}(s)`);
    let sentence = pattern
        .replace(`{duration}`, pattern)
        .replace(`{days}`, String(days))
        .replace(`{hours}`, String(hours))
        .replace(`{minutes}`, String(minutes))
        .replace(`{seconds}`, String(seconds))
        .replace(`${day}(s)`, `day${Util.s(days)}`)
        .replace(`${hour}(s)`, `hour${Util.s(hours)}`)
        .replace(`${minute}(s)`, `minute${Util.s(minutes)}`)
        .replace(`${second}(s)`, `second${Util.s(seconds)}`);
    if (sentence.startsWith(` ${and}`)) sentence = sentence.slice(5);
    if (sentence.endsWith(`${and} `)) {
        sentence = sentence.split(``).reverse().join(``);
        sentence = sentence.slice(5);
        sentence = sentence.split(``).reverse().join(``);

    }
    return sentence;
}
}