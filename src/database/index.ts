import postgres from './postgres';
import redis from './redis';
import { Collection, User } from 'discord.js';
import Jolyne from '../structures/Client';
//import Chapters from './rpg/_chapters';
import * as Chapters from './rpg/Chapters' ;
import type { UserData, SkillPoints }  from '../@types';

export default class DatabaseHandler {
    postgres: postgres;
    redis: redis;
    languages: Collection<string, any> = new Collection();
    _client: Jolyne;

    constructor(client: Jolyne) {
        this.postgres = new postgres();
        this.redis = new redis();
        this._client = client;
    }

    async saveUserData(userData: UserData): Promise<void> {
        return new Promise(async (resolve) => {
            const oldData = await this.postgres.client.query(`SELECT * FROM users WHERE id = $1`, [userData.id]).then(r => r.rows[0] || null);
            if (!oldData) return resolve(oldData);
            const changes: Array<object> = [];
            Object.keys(oldData).filter(r => oldData[r] !== undefined && userData[r as keyof UserData] !== undefined).forEach((key: any) => {
                const oldValue = oldData[key];
                const newValue = userData[key as keyof UserData];
                if (typeof key !== "object") {
                    if (String(newValue) !== String(oldValue)) changes.push({
                        query: `${key}=$${changes.length + 1}`,
                        value: newValue
                    });
                } else {
                    if (key instanceof Array) {
                        if(!arrayEqual(newValue, oldValue)) changes.push({
                            query: `${key}=$${changes.length + 1}`,
                            value: newValue
                        });
                    } else { // If JSON
                        if(JSON.stringify(newValue) !== JSON.stringify(oldValue)) changes.push({
                            query: `${key}=$${changes.length + 1}`,
                            value: newValue
                        });

                    }
                }
            });
            if (changes.length > 0) {
                this.fixStats(userData);
                this.languages.set(userData.id, userData.language);
                await this.postgres.client.query(`UPDATE users SET ${changes.map((r: any) => r.query).join(', ')} WHERE id = $${changes.length + 1}`, [...changes.map((r: any) => r.value), userData.id]);
                await this.redis.client.set(`cachedUser:${userData.id}`, JSON.stringify(userData));
                return resolve(await this.redis.client.get(`cachedUser:${userData.id}`).then(r => JSON.parse(r) || null));
            } else resolve(null);
        });
    }

    async createUserData(userId: string): Promise<UserData> {
        return new Promise(async (resolve) => {
            const discordUserTag = this._client.users.cache.get(userId)?.tag || await this._client.users.fetch(userId).then((r: User) => r.tag || "Unknown#0000").catch(() => "null");
            const newUserData: UserData = {
                id: userId,
                tag: discordUserTag,
                xp: 0,
                level: 1,
                health: 100,
                max_health: 100,
                stamina: 60,
                max_stamina: 60,
                chapter: 1,
                money: 500,
                language: 'en-US',
                skill_points: {
                    strength: 0,
                    defense: 0,
                    perception: 0,
                    stamina: 0
                },
                spb: {
                    strength: 0,
                    defense: 0,
                    perception: 0,
                    stamina: 0
                },
                items: ["pizza", "pizza", "pizza"],
                chapter_quests: Chapters.C1.quests,
                daily_quests: [],
                side_quests: [],
                adventureat: Date.now()
            };
            await this.postgres.client.query(`INSERT INTO users (id, tag, xp, level, health, max_health, stamina, max_stamina, chapter, money, language, skill_points, items, chapter_quests, daily_quests, side_quests, adventureat, spb) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`, [
                newUserData.id,
                newUserData.tag,
                newUserData.xp,
                newUserData.level,
                newUserData.health,
                newUserData.max_health,
                newUserData.stamina,
                newUserData.max_stamina,
                newUserData.chapter,
                newUserData.money,
                newUserData.language,
                newUserData.skill_points,
                newUserData.items,
                newUserData.chapter_quests,
                newUserData.daily_quests,
                newUserData.side_quests,
                newUserData.adventureat,
                newUserData.spb
            ]);
            this.fixStats(newUserData);
            await this.redis.client.set(`cachedUser:${userId}`, JSON.stringify(newUserData));
            this.languages.set(newUserData.id, newUserData.language);
            return resolve(newUserData);    
        });
    }
    
    async delUserData(userId: string): Promise<number> {
        return new Promise(async (resolve) => {
            await this.postgres.client.query(`DELETE FROM users WHERE id = $1`, [userId]);
            const keys = await this.redis.client.keys(`*${userId}*`);
            for (const key of keys) await this.redis.client.del(key);
            return resolve(keys.length);
        });
    }


    async getUserData(userId: string, forceData?: boolean): Promise<UserData> {
        return new Promise(async (resolve) => {
            const cachedUser: UserData = await this.redis.client.get(`cachedUser:${userId}`).then(r => JSON.parse(r) || null);
            if (cachedUser) {
                const finalData: UserData = {
                    id: cachedUser.id,
                    tag: cachedUser.tag,
                    xp: Number(cachedUser.xp),
                    level: Number(cachedUser.level),
                    health: Number(cachedUser.health),
                    max_health: Number(cachedUser.max_health || cachedUser.health),
                    stamina: Number(cachedUser.stamina),
                    max_stamina: Number(cachedUser.max_stamina || cachedUser.stamina),
                    chapter: Number(cachedUser.chapter),
                    money: Number(cachedUser.money),
                    language: cachedUser.language,
                    skill_points: cachedUser.skill_points,
                    items: cachedUser.items,
                    chapter_quests: cachedUser.chapter_quests,
                    daily_quests: cachedUser.daily_quests,
                    side_quests: cachedUser.side_quests,
                    adventureat: Number(cachedUser.adventureat),
                    spb: cachedUser.spb,
                    stand: cachedUser.stand
                };
                if (!this.languages.get(userId) || this.languages.get(userId) !== cachedUser.language) this.languages.set(userId, cachedUser.language);
                if (typeof finalData.chapter_quests[0] === "string" && finalData.chapter_quests[0].startsWith("{")) {
                    finalData.chapter_quests = finalData.chapter_quests.map((r: string) => JSON.parse(r));
                }
                if (typeof finalData.daily_quests[0] === "string" && finalData.daily_quests[0].startsWith("{")) {
                    finalData.daily_quests = finalData.daily_quests.map((r: string) => JSON.parse(r));
                }
                return resolve(finalData);
            }
            const userData = await this.postgres.client.query(`SELECT * FROM users WHERE id = $1`, [userId]).then(r => r.rows[0] || null);
            if (userData) {
                await this.redis.client.set(`cachedUser:${userId}`, JSON.stringify(userData));
                const finalData: UserData = userData;
                this.fixStats(finalData);
                if (!this.languages.get(userId) || this.languages.get(userId) !== finalData.language) this.languages.set(userId, finalData.language);
                return resolve(finalData);
            }
            if (!forceData) return resolve(null);
            return await this.createUserData(userId).then(r => resolve(r));
        });
    }
    fixStats(userData: UserData) {
        const stand = require("./rpg/_stands")[userData.stand]?.bonus ?? { strength: 0, stamina: 0, perception: 0, defense: 0 };
        if (!userData.spb) userData.spb = { strength: 0, stamina: 0, perception: 0, defense: 0 };
        Object.keys(stand).filter(r => r!== "total").forEach(async (e: any) => {
            userData.spb[e as keyof SkillPoints] = userData.skill_points[e as keyof SkillPoints] + stand[e];
        });

        if (!userData.stamina && userData.stamina !== 0) userData.stamina = 60;
        if (!userData.health && userData.health !== 0) userData.health = 100;

        // Why am I roundifying everything ?
        // ---> Because Integers cannot be decimal numbers

        const strength = userData.skill_points?.strength ?? 0;
        const stamina = Math.round((userData.skill_points?.stamina ?? 0) / 10);
        const health = userData.skill_points?.defense ?? 0;
        const perception = userData.skill_points?.perception ?? 0;

        userData.max_health = 100;
        userData.max_stamina = 60;
        userData.max_health += Math.round(((userData.level + health) * 10) + ((userData.level + health) * 6 / 100) * 100);
        userData.max_stamina += Math.round((userData.level + stamina) + ((userData.level + stamina) * 5 / 100) * ((userData.level + stamina) * 30));
        userData.dodge_chances = Math.round(Math.round((userData.level / 2) + (perception / 1.15)));
    }

    async getCache(base: string, target?: string): Promise<string | null> {
        if (!target) {
            const keys = await this.redis.client.keys(`tempCache_*${base}`);
            if (keys.filter(r => r.includes(base)).length !== 0) return keys.filter(r => r.includes(base))[0];    
            else return null;
        }
        return await this.redis.client.get(`tempCache_${base}:${target}`).then(r => r || null);
    }    

    async setCache(base: string, target: string, value: string | number = 1): Promise<string> {
        return await this.redis.client.set(`tempCache_${base}:${target}`, value);
    }
    async delCache(base: string, target?: string): Promise<string | number> {
        if (!target) return await this.redis.client.del(`tempCache_*${base}`);
        return await this.redis.client.del(`tempCache_${base}:${target}`);
    }
}

function arrayEqual(array1: any, array2: any) {
    let changed = false;
    if (array1.length !== array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
        if (typeof array1[i] === "object") {
            if (array1[i] instanceof Array) {
                const bothEqual = arrayEqual(array1[i], array2[i]);
                if (!bothEqual) {
                    changed = true;
                    break;
                }
            } else {
                if (JSON.stringify(array1[i]) !== JSON.stringify(array2[i])) {
                    changed = true;
                    break;
                }
            }

        }
        else if (array1[i].startsWith("{")) { // JSON stringified. IK that's dumb but yes I messed up somewhere.
            if (JSON.stringify(array1[i]) === JSON.stringify(array2[i])) {
                changed = true;
                break;
            }
        } else {
            if (["string", "number", "boolean"].includes(typeof array1[i]) && array1[i] !== array2[i]) {
                changed = true;
                break;
            } 
        }
    }
    return !changed;
}
