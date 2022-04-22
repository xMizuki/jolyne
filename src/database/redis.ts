import redis from 'ioredis';
import log from '../utils/logger';

export default class RedisHandler {
    client: redis;
    connect: Promise<void>;
    connected: boolean;
    connectResolve: any;

    constructor() {
        this.connect = new Promise((resolve) => this.connectResolve = resolve);
        this.client = new redis({ db: process.env.TEST_MODE === "true" ? 1 : 0 })
        .on('connect', () => {
            log("Connected.", "redis");
            if (this.connectResolve)
                this.connectResolve();
        });
    }

}