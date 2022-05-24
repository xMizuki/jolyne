import type { UserData, SkillPoints, Quest, Stand }  from '../@types';
import postgres from './postgres';
import redis from './redis';
import { Collection, User } from 'discord.js';
import Jolyne from '../structures/Client';
import * as Chapters from './rpg/Chapters' ;
import * as Quests from './rpg/Quests' ;
import * as Util from '../utils/functions';

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
            const oldData: UserData = await this.postgres.client.query(`SELECT * FROM users WHERE id = $1`, [userData.id]).then(r => r.rows[0] || null);
            if (!oldData) return resolve(null);
            if (this._client.users.cache.get(userData.id)) userData.tag = this._client.users.cache.get(userData.id).tag;
            else userData.tag = await this._client.users.fetch(userData.id).then((r: User) => r.tag || "Unknown#0000").catch(() => "Unknown#0000");

            const changes: { query: string, value: any }[] = [];
            
            Object.keys(oldData).filter(r => oldData[r as keyof UserData] !== undefined && userData[r as keyof UserData] !== undefined).forEach((key: string | object | boolean | Array<any>) => {
                const oldValue = oldData[key as keyof UserData];
                const newValue = userData[key as keyof UserData];

                const pushChanges = async () => {
                    if (key === "mails" && Util.isMailArray(oldValue) && Util.isMailArray(newValue)) {
                        if (oldValue.length < newValue.length) {
                            const count: number = parseInt(await this.redis.client.get(`jjba:newUnreadMails:${userData.id}`)) || 0;
                            this.redis.client.set(`jjba:newUnreadMails:${userData.id}`, count + newValue.length - oldValue.length);
                        }
                    }
                    changes.push({
                        query: `${key}=$${changes.length + 1}`,
                        value: newValue
                    });
                };

                if (typeof oldValue === 'boolean') {
                    if (newValue !== oldValue) pushChanges()
                } else if (typeof oldValue !== 'object') {
                    if (String(newValue) !== String(oldValue)) pushChanges();
                } else {
                    if (oldValue instanceof Array && newValue instanceof Array) {
                        if(!arrayEqual(newValue, oldValue)) pushChanges();
                    } else {
                        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) pushChanges();
                    }
                }
            });
            if (userData.health < 0) userData.health = 0;
            if (userData.stamina < 0) userData.stamina = 0;

            if (changes.length > 0) {
                if (changes.filter((r: any) => r.query.includes("language")).length > 0) this.languages.set(userData.id, userData.language);
                if (changes.filter((r: any) => r.query.includes("money")).length > 0) {
                    for (const key in userData) {
                        if (userData.hasOwnProperty(key)) {
                            const element = userData[key as keyof typeof userData];
                            if (Util.isQuestArray(element)) {
                                for (const quest of element.filter(q => q.id.startsWith("cc") && !q.completed)) {
                                    let goal = Number(quest.id.split(":")[1]);
                                    if (quest.total) quest.total = quest.total + userData.money - oldData.money;
                                    else quest.total = userData.money - oldData.money;
                                    if (quest.total < 0) quest.total = 0;
                                    if (quest.total >= goal) {
                                        quest.completed = true;
                                        quest.total = goal;
                                    };
                                }
                                // @ts-ignore
                                userData[key as keyof typeof userData] = element;
                            }
                        }
                    }
        
                }
                this.fixStats(userData);
                await this.postgres.client.query(`UPDATE users SET ${changes.map((r) => r.query).join(', ')} WHERE id = $${changes.length + 1}`, [...changes.map((r) => r.value), userData.id]);
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
                items: ["pizza", "pizza", "pizza", "mysterious_arrow"],
                chapter_quests: Chapters.C1.quests,
                side_quests: [],
                mails: [],
                adventureat: Date.now(),
                daily: {
                    claimedAt: 0,
                    streak: 0,
                    quests: []
                },
                stats: {}
            };
            await this.postgres.client.query(`INSERT INTO users (${Object.keys(newUserData).join(", ")}) VALUES (${Object.keys(newUserData).map((r: string) => `$${Object.keys(newUserData).indexOf(r) + 1}`).join(', ')})`, [...Object.values(newUserData)]);
            /*
            await this.postgres.client.query(`INSERT INTO users (id, tag, xp, level, health, max_health, stamina, max_stamina, chapter, money, language, skill_points, items, chapter_quests, side_quests, adventureat, spb, daily, stats) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`, [
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
                newUserData.side_quests,
                newUserData.adventureat,
                newUserData.spb,
                newUserData.daily,
                newUserData.stats
            ]);*/
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
                    side_quests: cachedUser.side_quests,
                    adventureat: Number(cachedUser.adventureat),
                    mails: cachedUser.mails,
                    spb: cachedUser.spb,
                    stand: cachedUser.stand,
                    daily: cachedUser.daily,
                    stats: cachedUser.stats // Automatically fixed with the fixStats function
                };
                if (!this.languages.get(userId) || this.languages.get(userId) !== cachedUser.language) this.languages.set(userId, cachedUser.language);
                this.fixStats(finalData);

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
        console.log("SPB SPB")
        const stand: Stand["skill_points"] = userData.stand ? Util.getStand(userData.stand)?.skill_points : null;
        userData.spb = { strength: userData.skill_points.strength, stamina: userData.skill_points.stamina, perception: userData.skill_points.perception, defense: userData.skill_points.defense };
        if (stand) Object.keys(stand).filter(r => r!== "total").forEach(async (e: any) => {
            userData.spb[e as keyof SkillPoints] = userData.skill_points[e as keyof SkillPoints] + stand[e as keyof SkillPoints];
        });
        if (!userData.stamina && userData.stamina !== 0) userData.stamina = 60;
        if (!userData.health && userData.health !== 0) userData.health = 100;
        if (!userData.stats) userData.stats = {}
        if (!userData.stats.rankedBattle) userData.stats.rankedBattle = {
            wins: 0,
            losses: 0
          }

          if (!userData.daily || userData.daily.claimedAt === undefined) {
            userData.daily = {
                claimedAt: 0,
                streak: 0,
                quests: []
            }
        }
        

        // Why am I roundifying everything ?
        // ---> Because Integers cannot be decimal numbers

        const strength = userData.skill_points?.strength ?? 0;
        const stamina = Math.round((userData.spb?.stamina ?? 0) / 10);
        const health = userData.spb?.defense ?? 0;
        const perception = userData.spb?.perception ?? 0;

        userData.max_health = 100;
        userData.max_stamina = 60;
        userData.max_health += Math.round(((userData.level + health) * 10) + ((userData.level + health) * 6 / 100) * 100);
        userData.max_stamina += Math.round((userData.level + stamina) + ((userData.level + stamina) * 5 / 100) * ((userData.level + stamina) * 30));
        userData.dodge_chances = Math.round(Math.round((userData.level / 2) + (perception / 1.15)));
    }

    // TODO: Finish this code
    async updateDailyQuests(userData: UserData) {
        await this.saveUserData(userData);
    }
    

    async getCooldownCache(base: string, target?: string): Promise<string | null> {
        if (!target) {
            const keys = await this.redis.client.keys(`tempCache_*${base}`);
            if (keys.filter(r => r.includes(base)).length !== 0) return keys.filter(r => r.includes(base))[0];    
            else return null;
        }
        return await this.redis.client.get(`tempCache_${base}:${target}`).then(r => r || null);
    }    

    async setCooldownCache(base: string, target: string, value: string | number = Infinity): Promise<string> {
        return await this.redis.client.set(`tempCache_${base}:${target}`, value);
    }
    async delCooldownCache(base: string, target?: string): Promise<string | number> {
        if (!target) return await this.redis.client.del(`tempCache_*${base}`);
        return await this.redis.client.del(`tempCache_${base}:${target}`);
    }
}

function arrayEqual(array1: any[], array2: any[]) {
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
        else if (array1[i].startsWith("{")) { // TODO: remove this
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
