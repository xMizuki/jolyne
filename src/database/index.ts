import postgres from './postgres';
import redis from './redis';
import { Collection, User } from 'discord.js';
import Jolyne from '../base/Client';
import Chapters from './rpg/chapters'
import type { UserData }  from '../@types'

export default class DatabaseHandler {
    postgres: postgres;
    redis: redis;
    cache: Collection<string, any>;
    _client: Jolyne;

    constructor(client: Jolyne) {
        this.cache = new Collection();
        this.postgres = new postgres();
        this.redis = new redis();
        this._client = client;
    }

    async saveUserData(userData: UserData): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const oldData = await this.postgres.client.query(`SELECT * FROM users WHERE id = $1`, [userData.id]).then(r => r.rows[0] || null);
            if (!oldData) return resolve(oldData);
            const changes: Array<{}> = [];
            Object.keys(oldData).filter(r => oldData[r] !== undefined && userData[r as keyof UserData] !== undefined).forEach((key: any) => {
                const oldValue = oldData[key];
                const newValue = userData[key as keyof UserData];
                if (typeof key !== "object") {
                    if (String(newValue) !== String(oldValue)) changes.push({
                        query: `${key}=$${changes.length + 1}`,
                        value: newValue
                    })
                } else {
                    if (key instanceof Array) {
                        if(!arrayEqual(newValue, oldValue)) changes.push({
                            query: `${key}=$${changes.length + 1}`,
                            value: newValue
                        })
                    } else { // If JSON
                        if(JSON.stringify(newValue) !== JSON.stringify(oldValue)) changes.push({
                            query: `${key}=$${changes.length + 1}`,
                            value: newValue
                        });

                    }
                }
            })
            if (changes.length > 0) {
                console.log(`UPDATE users SET ${changes.map((r: any) => r.query).join(', ')} WHERE id = $${changes.length + 1}`, [...changes.map((r: any) => r.value), userData.id])
                await this.postgres.client.query(`UPDATE users SET ${changes.map((r: any) => r.query).join(', ')} WHERE id = $${changes.length + 1}`, [...changes.map((r: any) => r.value), userData.id]);
                await this.redis.client.set(`jjba:user:${userData.id}`, JSON.stringify(userData));
                return resolve(await this.redis.client.get(`jjba:user:${userData.id}`).then(r => JSON.parse(r) || null));
            } else resolve(null);
        });
    }

    async createUserData(userId: string): Promise<UserData> {
        return new Promise(async (resolve, reject) => {
            const discordUserTag = this._client.users.cache.get(userId)?.tag || await this._client.users.fetch(userId).then((r: User) => r.tag || "Unknown#0000").catch(() => "null")
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
                language: 'english',
                skill_points: {
                    strength: 0,
                    defense: 0,
                    perceptibility: 0,
                    stamina: 0
                },
                items: ["pizza", "pizza", "pizza"],
                quests: Chapters[1].quests,
                squests: [],
                adventureat: Date.now()
            };
            await this.postgres.client.query(`INSERT INTO users (id, tag, xp, level, health, max_health, stamina, max_stamina, chapter, money, language, skill_points, items, quests, squests, adventureat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`, [
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
                newUserData.quests,
                newUserData.squests,
                newUserData.adventureat
            ]);
            await this.redis.client.set(`jjba:user:${userId}`, JSON.stringify(newUserData));
            return resolve(newUserData);    
        })
    }        

    async getUserData(userId: string, forceData?: boolean): Promise<UserData> {
        return new Promise(async (resolve, reject) => {
            const cachedUser = await this.redis.client.get(`jjba:user:${userId}`).then(r => JSON.parse(r) || null);
            if (cachedUser) {
                const finalData: UserData = {
                    id: cachedUser.id,
                    tag: cachedUser.tag,
                    xp: parseInt(cachedUser.xp),
                    level: parseInt(cachedUser.level),
                    health: parseInt(cachedUser.health),
                    max_health: parseInt(cachedUser.max_health || cachedUser.health),
                    stamina: parseInt(cachedUser.stamina),
                    max_stamina: parseInt(cachedUser.max_stamina || cachedUser.stamina),
                    chapter: parseInt(cachedUser.chapter),
                    money: parseInt(cachedUser.money),
                    language: cachedUser.language,
                    skill_points: cachedUser.skill_points,
                    items: cachedUser.items,
                    quests: cachedUser.quests,
                    squests: cachedUser.squests,
                    adventureat: parseInt(cachedUser.adventureat),
                    spb: cachedUser.spb,
                    stand: cachedUser.stand
                };
                return resolve(finalData);

            }
            const userData = await this.postgres.client.query(`SELECT * FROM users WHERE id = $1`, [userId]).then(r => r.rows[0] || null);
            if (userData) {
                await this.redis.client.set(`jjba:user:${userId}`, JSON.stringify(userData));
                const finalData: UserData = userData;
                return resolve(finalData);
            }
            if (!forceData) return resolve(null);
            return await this.createUserData(userId).then(r => resolve(r));
        })
    }
    fixStats(userData: UserData) {
        const stand = require("./rpg/stands.json")[userData.stand]?.bonus ?? { total: 0, strength: 0, stamina: 0, perceptibility: 0, defense: 0 };
        Object.keys(stand).filter(r => r!== "total").forEach(async e => {
            userData.spb[e] = userData.skill_points[e] + stand[e];
        });

        if (!userData.stamina && userData.stamina !== 0) userData.stamina = 60;
        if (!userData.health && userData.health !== 0) userData.health = 100;

        // Why am I roundifying everything ?
        // ---> Because Integers cannot be decimal numbers

        const strength = userData.skill_points?.strength ?? 0;
        const stamina = Math.round((userData.skill_points?.stamina ?? 0) / 10);
        const health = userData.skill_points?.defense ?? 0;
        const perception = userData.skill_points?.perceptibility ?? 0;

        userData.max_health = 100;
        userData.max_stamina = 60;
        userData.max_health += Math.round(((userData.level + health) * 10) + ((userData.level + health) * 6 / 100) * 100);
        userData.max_stamina += Math.round((userData.level + stamina) + ((userData.level + stamina) * 5 / 100) * ((userData.level + stamina) * 30));
        userData.dodge_chances = Math.round(Math.round((userData.level / 2) + (perception / 1.15)));
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
