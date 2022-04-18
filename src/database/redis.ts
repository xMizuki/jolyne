import redis from 'ioredis';
import log from '../utils/logger';

export default class RedisHandler {
    client: redis;
    connect: Promise<void>;
    connected: boolean;
    connectResolve: any;

    constructor() {
        this.connect = new Promise((resolve) => this.connectResolve = resolve);
        this.client = new redis()
        .on('connect', () => {
            log("Connected.", "redis");
            if (this.connectResolve)
                this.connectResolve();
        });
    }

}