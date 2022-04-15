import { Manager } from 'discord-hybrid-sharding';
import { config } from 'dotenv';

config();

const manager = new Manager(`${__dirname}/index.js`, { // compiled file
    totalShards: 'auto',
    shardsPerClusters: 7,
    mode: 'process',
    token: process.env.CLIENT_TOKEN,
});

manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });