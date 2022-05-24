import { config } from 'dotenv';
import { Pool } from 'pg';
import log from '../utils/logger';
import type { Quest, NPC, UserData, Mail, Stand, SkillPoints } from '../@types';
import * as Util from '../utils/functions';
import * as Stands from '../database/rpg/Stands';
import * as Items from '../database/rpg/Items';
import * as NPCs from '../database/rpg/NPCs';
import * as Quests from '../database/rpg/Quests';
import * as Mails from '../database/rpg/Mails';
import * as Emojis from '../emojis.json';

Object.keys(Stands).forEach((v) => {
    const stand = Stands[v as keyof typeof Stands];
    // @ts-expect-error
    Items[`${stand.name.replace(/ /gi, "_").replace(/:/gi, "_")}_Disc` as keyof typeof Items] = {
        id: `${stand.name}:disk`,
        name: `${stand.name} Disc`,
        description: `A disc which contains ${stand.name}'s power...`,
        rarity: stand.rarity,
        type: "disc",
        cost: {
            "SS": 500000,
            "S": 100000,
            "A": 50000,
            "B": 10000,
            "C": 5000
        }[stand.rarity],
        tradable: true,
        storable: true,
        usable: true,
        emoji: Emojis.disk,
        shop: 'Black Market',
    }    
});

config();

const unhandledItems: Array<string> = [];
const unhandledStands: Array<string> = [];
const unhandledQuests: Array<string> = [];
const handledItems: Array<string> = [];
const handledStands: Array<string> = [];
const handledQuests: Array<string> = [];

const client = new Pool({
    user: process.env.PSQL_USER,
    host: "127.0.0.1",
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: 5432
})
.on("connect", () => {
    log("Ready to push.", "postgres");
});

const old_client = new Pool({
    user: process.env.PSQL_USER,
    host: "127.0.0.1",
    database: "rpg",
    password: process.env.PSQL_PASSWORD,
    port: 5432
})
.on("connect", () => {
    log("Ready to compare.", "postgres");
});

async function init() {
    const users = await old_client.query("SELECT * FROM users");
    old_client.end();
    users.rows.forEach(async (user) => {
        // @ts-expect-error
        const formattedUser: UserData = {
            id: user.id,
            tag: user.tag,
            items: user.items,
            level: Number(user.level),
            xp: Number(user.xp),
            chapter_quests: [],
            side_quests: [],
            daily: {
                claimedAt: 0,
                streak: 0,
                quests: []
            },
            health: Number(user.health),
            stamina: Number(user.stamina),
            chapter: user.chapter,
            money: Number(user.money),
            language: 'en-US',
            skill_points: {
                perception: user.skill_points.perceptibility,
                strength: user.skill_points.strength,
                defense: user.skill_points.defense,
                stamina: user.skill_points.stamina
            },
            adventureat: Number(user.adventureat),
            stats: {},
            mails: [],
            stand: user.stand ? Util.getStand(user.stand).name : null
        };

        user.items.forEach(async (item: string) => {
            const Uitem = Util.getItem(item)
            if (!Uitem && !unhandledItems.includes(item)) {
                unhandledItems.push(item);
                log(`Unhandled item: ${item}`, "error");
            }
            if (Uitem && !handledItems.includes(item)) {
                handledItems.push(item);
                log(`Handled item: ${item}`, "info");
            }
        })
        if (user.stand) {
            const userStand = Util.getStand(user.stand);

            if (!userStand && !unhandledStands.includes(user.stand)) {
                unhandledStands.push(user.stand);
                log(`Unhandled stand: ${user.stand}`, "error");
            }
            if (userStand && !handledStands.includes(user.stand)) {
                handledStands.push(user.stand);
                log(`Handled stand: ${user.stand}`, "info");
            }
        }
        const quests = Object.keys(Quests).map(q => Quests[q as keyof typeof Quests]).filter(q => (q as Quest).id) as Quest[];
        const mails = Object.keys(Mails).map(q => Mails[q as keyof typeof Mails]).filter(q => (q as Mail).id) as Mail[];
        if (user.emails && user.emails.length !== 0) {
            for (const mail of user.emails.map((m: string) => JSON.parse(m))) {
                const mailx = mails.find(m => m.id === mail.id);
                if (!mailx) continue;
                formattedUser.mails.push({
                    ...mailx,
                    date: mail.date,
                    prize: (mail.prize && mail.prize.length !== 0) ? mailx.prize : null,
                    archived: mail.archived,
                    chapter_quests: (mail.quests && mail.quests.length !== 0) ? mailx.chapter_quests : null
                });

            }
        }
        if (user.quests) {
            for (const quest of user.quests.map((q: string) => JSON.parse(q))) {
                if (quest.id.startsWith("cc") || quest.id.startsWith("cdaily") || quest.id.startsWith("loot") || quest.id.startsWith("lloot") || quest.id.startsWith("assault")) {
                    // @ts-ignore
                    const i18n = {
                        'loot': 'LOOT_COINS',
                        'cdaily': 'CLAIM_DAILY',
                        'cc': 'CLAIM_COINS',
                        'lloot': 'USE_LOOT',
                        'assault': 'USE_ASSAULT'
                    }[quest.id.split(":")[0]];
                    formattedUser.chapter_quests.push({
                        id: quest.id,
                        i18n: i18n,
                        completed: quest.completed,
                        total: quest.total
                    });
                } else if (quest.id.startsWith("defeat")) {
                    const NPC = Object.keys(NPCs).map(n => NPCs[n as keyof typeof NPCs]).find((npc) => npc.id === quest.id.split(":")[1]);
                    formattedUser.chapter_quests.push({
                        id: quest.id,
                        npc: {
                            ...NPC,
                            health: (quest.hp || quest.health) === 0 ? 0 : NPC.max_health
                        }
                    });
                } else if (quest.id.startsWith("action")) {
                    const questx = quest.id === "action:gotoairport" ? {
                        id: "action:gotoairport",
                        i18n: "GO_TO_AIRPORT",
                        emoji: "🚕",
                        completed: false
                    } : quests.find(r => r.id === quest.id)
                    if (questx) {
                        formattedUser.chapter_quests.push({
                            ...questx,
                            completed: quest.completed
                        });
                    } 
                } else if (quest.id.startsWith("wait")) {
                    const questx = quests.find(r => r.id === quest.id);
                    let mailsx: Mail[] = [];
                    if (quest.email_push_timeout) mailsx.push(mails.find(r => r.id === quest.email_push_timeout));
                    formattedUser.chapter_quests.push({
                        ...questx,
                        completed: quest.completed,
                        mails_push_timeout: mailsx
                    });
                } else if (quest.id.startsWith("rdem")) {
                    formattedUser.chapter_quests.push({
                        id: quest.id,
                        completed: quest.completed
                    });
                } else {
                    const questx = quests.find(r => r.id === quest.id);
                    if (questx) {
                        formattedUser.side_quests.push(questx);
                    } 
                }
            } 
        }
        fixStats(formattedUser);
        if (formattedUser.id === "776562585361186826") console.log(formattedUser.mails, user.emails.map((q: string) => JSON.parse(q)));
    
        await client.query(`DELETE FROM users WHERE id='${formattedUser.id}'`);
        await client.query(`INSERT INTO users (${Object.keys(formattedUser).join(", ")}) VALUES (${Object.keys(formattedUser).map((r: string) => `$${Object.keys(formattedUser).indexOf(r) + 1}`).join(', ')})`, [...Object.values(formattedUser)]);

    });
    setTimeout(() => {
        log(`${handledQuests.length}/${handledQuests.length + unhandledQuests.length} handled quests`, "CMD");
        log(`${handledItems.length}/${Object.keys(Items).length} handled items`, "CMD");
        log(`${handledStands.length}/${Object.keys(Stands).length + unhandledStands.length} handled stands`, "CMD");
    }, 2000);    
    

}

init()

function fixStats(userData: UserData) {
    const stand: Stand["skill_points"] = userData.stand ? Util.getStand(userData.stand)?.skill_points : null;
    if (!userData.spb) userData.spb = { strength: 0, stamina: 0, perception: 0, defense: 0 };
    if (stand) Object.keys(stand).filter(r => r!== "total").forEach(async (e) => {
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