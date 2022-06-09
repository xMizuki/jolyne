import type { Quest, UserData, Chapter, NPC, Mail } from '../../@types';
import * as Emojis from '../../emojis.json';
import * as Util from '../../utils/functions';
import * as Mails from './Mails';

export const Analyse_Hair: Quest = {
    id: "action:analyse_hair",
    i18n: "ANALYSE_HAIR",
    emoji: "📧",
    completed: false
};

export const Tell_Your_Grandfather_About_DIO: Quest = {
    id: "action:tygad",
    i18n: "TYGAD",
    emoji: "📧",
    completed: false
};


export const SPEEDWAGON_ANSWER: Quest = {
    id: "wait:speedwagon_answer",
    i18n: "SPEEDWAGON_ANSWER",
    timeout: Date.now() + ((60000 * 30)),
    mails_push_timeout: [
        Mails.P1C2_SPEEDWAGON_DIO_HAIR
    ],
    completed: false
}

export const TYGAD_ANSWER: Quest = {
    id: "wait:gfad",
    i18n: "TYGAD_ANSWER",
    timeout: Date.now() + ((60000 * 10)),
    mails_push_timeout: [
        Mails.GF_MDIO
    ],
    mustRead: true,
    completed: false
}

export const Remove_Thing_Kakyoin: Quest = {
    id: "action:remove_thing_kakyoin",
    i18n: "REMOVE_THING_KAKYOIN",
    emoji: "💥",
    completed: false
};

export const Tell_To_Your_Grandfather_About_Dio: Quest = {
    id: "action:tygad",
    i18n: "TELL_GRANDFATHER",
    emoji: "📧",
    completed: false
};

export const bring_kakyoin_hospital: Quest = {
    id: "action:bring_kakyoin_hospital",
    i18n: "BRING_KAKYOIN_HOSPITAL",
    emoji: "🏥",
    completed: false
};


export const Awaken_Stand: Quest = {
    id: "getstand",
    i18n: "AWAKE_STAND",
    emoji: Emojis.mysterious_arrow,
    completed: false
};


export const LootCoins = (amount: number) => {
    const LootQuest: Quest = {
        id: "loot:" + amount,
        total: 0,
        i18n: "LOOT_COINS",
        emoji: Emojis.jocoins,
        completed: false

    };
    return LootQuest;
};

export const ClaimDaily = (amount: number) => {
    const ClaimDaily: Quest = {
        id: "cdaily:" + amount,
        i18n: "CLAIM_DAILY",
        total: 0,
        completed: false
    };
    return ClaimDaily;
};

export const ClaimCoins = (amount: number) => {
    const ClaimCoins: Quest = {
        id: "cc:" + amount,
        i18n: "CLAIM_COINS",
        total: 0,
        completed: false
    };
    return ClaimCoins;
};

export const UseLoot = (amount: number) => {
    const UseLoot: Quest = {
        id: "lloot:" + amount,
        i18n: "USE_LOOT",
        total: 0,
        completed: false
    };
    return UseLoot;
};

export const Assault = (amount: number) => {
    const AssaultQuest: Quest = {
        id: "assault:" + amount,
        i18n: "USE_ASSAULT",
        total: 0,
        completed: false
    };
    return AssaultQuest;
};

export const getStatus = function getQuestStatus(quest: Quest, userData: UserData): number {
    if (quest.id.startsWith("defeat") || quest.id.startsWith("action")) {
        if (quest.completed) return 100;
        else if (quest.health && quest.health === 0) return 100;
        else return 0;
    }
    if (quest.id.startsWith("cc") || quest.id.startsWith("loot") || quest.id.startsWith("cdaily") || quest.id.startsWith("assault") || quest.id.startsWith("lloot")) {
        const goal = Number(quest.id.split(":")[1]);
        if (quest.total >= goal) return 100;
        else return Math.floor((quest.total / goal) * 100);
    }
    if (quest.id === "getstand") {
        if (userData.stand) return 100;
        else return 0;
    }
    if (quest.id.startsWith("wait")) {
        if (quest.timeout < Date.now()) return 100;
        else return 0;
    }
    else if (quest.completed) return 100;
    else return 0;
};

export const validate = function validateQuest(quests: Quest[], id: string) {
    console.log("on valide!")
    let validé = false;
    return quests.map(c => {
        if (c.id === id && !validé) {
            c.completed = true;
            validé = true;
        }
        return c;
    });
};

export const adapt = function adaptQuest(userData: UserData, UserChapter: Chapter): object {
    return {
        1: `**:trident: Chapter \`${Util.romanize(userData.chapter)}\`**: ${UserChapter.title[userData.language]}`,
        2: `**:trident: Chapter \`${Util.romanize(userData.chapter)}\`**: ${UserChapter.title[userData.language]}`,
        3: `**:trident: Chapter \`${Util.romanize(3)} - Part ${Util.romanize(1)}\`**: ${UserChapter.title[userData.language]}`,
        4: `**:trident: Chapter \`${Util.romanize(3)} - Part ${Util.romanize(2)}\`**: ${UserChapter.title[userData.language]}`,
        5: `**:trident: Chapter \`${Util.romanize(3)} - Part ${Util.romanize(3)}\`**: ${UserChapter.title[userData.language]}`,
        6: `**:trident: Chapter \`${Util.romanize(3)} - Part ${Util.romanize(4)}\`**: ${UserChapter.title[userData.language]}`,    
        7: `**:trident: Chapter \`${Util.romanize(3)} - Part ${Util.romanize(5)}\`**: ${UserChapter.title[userData.language]}`,    
    }

}

export const Defeat = (npc: NPC) : Quest => {
    return {
        id: 'defeat:' + npc.id,
        npc: {
            ...npc,
            max_health: npc.health,
            max_stamina: npc.stamina
        }
    }
}

export const KAKYOIN_BACK: Quest = {
    id: "wait:kakyoin_back",
    i18n: "KAKYOIN_BACK",
    timeout: Date.now() + ((60000 * 60) * 2),
    mails_push_timeout: [
        Mails.P1C2_KAKYOIN_BACK
    ],
    mustRead: true
}

export const Get_At_The_Morioh_Airport: Quest = {
    id: "wait:taxiupgo",
    timeout: Date.now() + ((60000 * 60) * 2),
    i18n: "TAXIUPGO",
    completed: false
}

export const Remove_Fleshbud_Polnareff: Quest = {
    id: "action:remove_fleshbud_polnareff",
    i18n: "REMOVE_FLESHBUD_POLNAREFF",
    emoji: "🐛",
    completed: false
}
