import { Manager } from 'discord-hybrid-sharding';
import { config } from 'dotenv';
import redis from 'ioredis';
const TempRedis = new redis();

TempRedis.keys('*tempCache_*').then(keys => {
    for (const key of keys) {
        TempRedis.del(key);
    }
    console.log(`Cleared ${keys.length} temp cache keys.`);
    TempRedis.quit();
});

config();

const manager = new Manager(`${__dirname}/index.js`, { // compiled file
    totalShards: 'auto',
    shardsPerClusters: 7,
    mode: 'process',
    token: process.env.CLIENT_TOKEN,
});

manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}\n-------------------------------------------------------------`));
manager.spawn({ timeout: -1 });