import { config } from 'dotenv';
import { Pool } from 'pg';
import log from '../utils/logger';
import * as Util from '../utils/functions';
import * as Stands from '../database/rpg/Stands';
import * as Items from '../database/rpg/Items';
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
const handledItems: Array<string> = [];
const handledStands: Array<string> = [];

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
    });
    log(`${handledItems.length}/${Object.keys(Items).length} handled items`, "CMD");
    log(`${handledStands.length}/${Object.keys(Stands).length + unhandledStands.length} handled stands`, "CMD");

}

init()