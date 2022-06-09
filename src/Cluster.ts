import 'dotenv/config';
import { Manager } from 'discord-hybrid-sharding';
import redis from 'ioredis';
const TempRedis = new redis({ db: process.env.TEST_MODE === "true" ? 1 : 0 });

TempRedis.keys('*tempCache_*').then(keys => {
    for (const key of keys) {
        TempRedis.del(key);
    }
    console.log(`Cleared ${keys.length} temp cache keys.`);
    TempRedis.quit();
});


const manager = new Manager(`${__dirname}/index.js`, { // compiled file
    totalShards: 'auto',
    shardsPerClusters: 7,
    mode: 'process',
    token: process.env.CLIENT_TOKEN,
});

manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}\n-------------------------------------------------------------`));
manager.spawn({ timeout: -1 }).catch((e) => { console.log(e)});

