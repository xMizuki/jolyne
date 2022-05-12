import { config } from 'dotenv';
import { Pool } from 'pg';
import log from '../utils/logger';
import type { Quest, NPC, UserData } from '../@types';
import * as Util from '../utils/functions';
import * as Stands from '../database/rpg/Stands';
import * as Items from '../database/rpg/Items';
import * as NPCs from '../database/rpg/NPCs';
import * as Quests from '../database/rpg/Quests';
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
        shop: 'Black Market'
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
            language: user.language,
            skill_points: user.skill_points,
            adventureat: Number(user.adventureat)
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
        setTimeout(() => {

            user.quests?.forEach((q: any) => {
                q = JSON.parse(q);
                Object.keys(Quests).map(v => Quests[v as keyof typeof Quests]).filter(q => (q as Quest).id).forEach((qq) => {
                    const quest = qq as Quest;
                    if (!(q as Quest).id) return;
                    if ((quest.id === q.id || q.id.startsWith("cc") || q.id.startsWith("cdaily") || q.id.startsWith("loot")) && !handledQuests.includes(q.id)) {
                        handledQuests.push(q.id);
                        log(`Handled quest: ${q.id}`, "info");
                    }
                    if (quest.id === q.id) {
                        formattedUser.chapter_quests.push({
                            ...q
                        });
                    }
                    if (q.id.startsWith("defeat")) {
                        const npcID = q.id.split("defeat:")[1];
                        const npc: NPC = Object.keys(NPCs).map(v => NPCs[v as keyof typeof NPCs]).filter(r => r.id === npcID)[0];
                        if (npc && !handledQuests.includes(q.id)) {
                            handledQuests.push(q.id);
                            log(`Handled quest: ${q.id}`, "info");
                        }
                        if (npc) {
                            formattedUser.chapter_quests.push({
                                id: q.id,
                                npc: npc,
                                completed: q.completed
                            });
                        }
                    }
                    if (!unhandledQuests.includes(q.id) && !handledQuests.includes(q.id)) {
                        unhandledQuests.push(q.id);
                        log(`Unhandled quest: ${q.id}`, "error");
                    }

                });
    
            });
            //

        }, 1000);

    });
    setTimeout(() => {
        log(`${handledQuests.length}/${handledQuests.length + unhandledQuests.length} handled quests`, "CMD");
        log(`${handledItems.length}/${Object.keys(Items).length} handled items`, "CMD");
        log(`${handledStands.length}/${Object.keys(Stands).length + unhandledStands.length} handled stands`, "CMD");
    }, 2000);    
    

}

init()