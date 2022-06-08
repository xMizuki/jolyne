import { WebhookClient, WebhookClientData, WebhookClientOptions, User } from 'discord.js';

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
export const VoteWebhook = new VoteWebhookClient({ url: process.env.VOTE_WEBHOOK });