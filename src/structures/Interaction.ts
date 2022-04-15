import JolyneClient from './Client';
// eslint-disable-next-line import/no-extraneous-dependencie
import { CommandInteraction, MessagePayload, InteractionReplyOptions, Message } from 'discord.js';
import { APIMessage } from 'discord-api-types';

export default class InteractionCommandContext {
  constructor(
    public interaction: CommandInteraction & { client: JolyneClient },
  ) {}

  get client(): JolyneClient {
    return this.interaction.client;
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
      .deferReply({ ephemeral })
  }

  // eslint-disable-next-line class-methods-use-this

  private resolveMessage(message: Message | APIMessage | null): Message | null {
    if (!message) return null;
    if (message instanceof Message) return message;
    // @ts-expect-error Message constructor is private,
    return new Message(this.client, message);
  }

  async makeMessage(options: InteractionReplyOptions): Promise<Message | null> {
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

  async sendT(text: string, translateVars = {}): Promise<Message | null> {
    return this.makeMessage({
      content: this.translate(text, translateVars),
    });
  }

  async fetchReply(): Promise<Message | null> {
    return this.resolveMessage(
      await this.interaction
        .fetchReply()
    );
  }

  async deleteReply(): Promise<void | null> {
    return this.interaction
      .deleteReply()
  }

  translate(text: string, translateVars: any): string {
    translateVars.emojis = this.client._emojis;
    translateVars.user = this.interaction.user;
    if (this.interaction.options.getUser("user")) translateVars.user_option = this.interaction.options.getUser("user");
    return this.client.translations.get(this.client.database.languages.get(`${this.interaction.guild?.id}`) || 'en-US')(text, translateVars) || text;
  }
}