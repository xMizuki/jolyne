import JolyneClient from '../structures/Client';
import express from 'express';
import TopGG from '@top-gg/sdk';
import * as Util from '../utils/functions';
import { VoteWebhook } from '../structures/Webhook';

export default (client: JolyneClient) => {
    const app = express()
    app.get('/', (req, res) => {
        res.send('Currently Working.');
    });
    const tpg = require('@top-gg/sdk');

    const webhook = new tpg.Webhook(process.env.DBL_WEBHOOK_TOKEN) as TopGG.Webhook;
    app.post("/dblwebhook", webhook.listener(async vote => {
        console.log(vote.user);
        const user = await client.users.fetch(vote.user);
        const userData = await client.database.getUserData(vote.user);    
        //client.webhook.logger.vote(user);
        VoteWebhook.log(user);

        if (!userData) return;

        let rewards = Util.getRewards(userData);

        rewards.money = Math.round(rewards.money / 4.5);
        rewards.xp = Math.round(rewards.money / 2);

        while (await client.database.getCooldownCache(user.id)) {
            await Util.wait(5000);
        }


        if (!userData) return;
        client.database.redis.set(`jjba:vote:${vote.user}`, Date.now() as any);
        let count = Number(await client.database.redis.get(`jjba:voteCount:${vote.user}`));
        if (isNaN(count) || !count) count = 1;
        else count++;
    
        let rount = Number(await client.database.redis.get(`jjba:voteCount${new Date().getUTCMonth()}${new Date().getUTCFullYear()}:${vote.user}`));
        if (isNaN(rount) || !rount) rount = 1;
        else rount++;
    
        let luck = Util.getRandomInt(1, 10)
        if (luck === 1) {
            userData.items.push("mysterious_arrow");
            client.database.redis.set(`jjba:voteTold:${vote.user}`, "m");
        } else client.database.redis.set(`jjba:voteTold:${vote.user}`, "true");
    
    
        await client.database.redis.set(`jjba:voteCount${new Date().getUTCMonth()}${new Date().getUTCFullYear()}:${vote.user}`, String(rount));
        await client.database.redis.set(`jjba:voteCount:${vote.user}`, String(count));
        userData.xp += rewards.xp;
        userData.money += rewards.money
        client.database.saveUserData(userData);
    
    }));
    

    app.listen(Number(process.env.TOP_GG_PORT), () => {
        client.log(`TopGG Webhook is listening on port ${process.env.TOP_GG_PORT}!`);
    });
    
}