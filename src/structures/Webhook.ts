import { WebhookClient, WebhookClientData, WebhookClientOptions, User, Guild } from 'discord.js';
import type { SlashCommand } from '../@types';
class VoteWebhookClient extends WebhookClient {
    constructor(data: WebhookClientData, options?: WebhookClientOptions) {
        super(data, options);
    }
    log (user: User): void {
        this.send({
            content: `:up: | \`${user.tag}\` (${user.id}) voted for Jolyne.`
        })
    }
}

class LogWebhookClient extends WebhookClient {
    constructor(data: WebhookClientData, options?: WebhookClientOptions) {
        super(data, options);
    }
    log (user: User, guild: Guild, command: SlashCommand): void {
        this.send({
            content: `:robot: | \`${user.tag}\` (${user.id}) used the /**${command.name}** command from guild: **${guild.name}** (${guild.id})`
        })
    }
}

export const VoteWebhook = new VoteWebhookClient({ url: process.env.VOTE_WEBHOOK }),
            LogWebhook = new LogWebhookClient({ url: process.env.LOG_WEBHOOK });