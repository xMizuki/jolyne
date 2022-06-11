import redis from 'ioredis';
import log from '../utils/logger';

export default class RedisHandler {
    client: redis;
    connect: Promise<void>;
    connected: boolean;
    connectResolve: (value: void | PromiseLike<void>) => void;

    constructor() {
        this.connect = new Promise((resolve) => this.connectResolve = resolve);
        this.client = new redis({ db: process.env.DEV_MODE === "true" ? 1 : 0 })
        .on('connect', () => {
            log("Connected.", "redis");
            if (this.connectResolve)
                this.connectResolve();
        });
    }

    async get(key: string) {
        return await this.client.get(key);
    }

    async set(key: string, value: string) {
        return await this.client.set(key, value);
    }

    async del(key: string) {
        return await this.client.del(key);
    }

    async hget(key: string, field: string) {
        return await this.client.hget(key, field);
    }

    async hset(key: string, field: string, value: string) {
        return await this.client.hset(key, field, value);
    }

    async hdel(key: string, field: string) {
        return await this.client.hdel(key, field);
    }

    async hgetall(key: string) {
        return await this.client.hgetall(key);
    }

    async hkeys(key: string) {
        return await this.client.hkeys(key);
    }

    async hvals(key: string) {
        return await this.client.hvals(key);
    }

    async hlen(key: string) {
        return await this.client.hlen(key);
    }

    async hincrby(key: string, field: string, increment: number) {
        return await this.client.hincrby(key, field, increment);
    }

    async hincrbyfloat(key: string, field: string, increment: number) {
        return await this.client.hincrbyfloat(key, field, increment);
    }

    async hmset(key: string, ...args: any[]) {
        return await this.client.hmset(key, ...args);
    }

    async hmget(key: string, ...args: any[]) {
        return await this.client.hmget(key, ...args);
    }

    async keys(pattern: string) {
        return await this.client.keys(pattern);
    }

    async sadd(key: string, ...args: any[]) {
        return await this.client.sadd(key, ...args);
    }

    async srem(key: string, ...args: any[]) {
        return await this.client.srem(key, ...args);
    }

    async smembers(key: string) {
        return await this.client.smembers(key);
    }

    async sismember(key: string, member: string) {
        return await this.client.sismember(key, member);
    }

    async sinter(...args: any[]) {
        return await this.client.sinter(...args);
    }

    async sunion(...args: any[]) {
        return await this.client.sunion(...args);
    }

}