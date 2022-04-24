import type { Quest, UserData, QuestNPC, Chapter, NPC } from '../../@types';
import * as Emojis from '../../emojis.json';
import * as Util from '../../utils/functions';

export const Analyse_Hair: Quest = {
    id: "action:analyse_hair",
    i18n: "ANALYSE_HAIR",
    emoji: "📧",
    completed: false
};

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
    id: "action:awaken_stand",
    i18n: "AWAKE_STAND",
    emoji: Emojis.mysterious_arrow,
    completed: false
};


export const LootCoins = (cc: number) => {
    const LootQuest: Quest = {
        id: "loot:" + cc,
        total: 0,
        i18n: "LOOT_COINS",
        emoji: Emojis.jocoins,
        completed: false

    };
    return LootQuest;
};

export const ClaimDaily = (cc: number) => {
    const LootQuest: Quest = {
        id: "cdaily:" + cc,
        i18n: "CLAIM_DAILY",
        total: 0,
        completed: false
    };
    return LootQuest;
};

export const ClaimCoins = (cc: number) => {
    const LootQuest: Quest = {
        id: "cc:" + cc,
        i18n: "CLAIM_COINS",
        total: 0,
        completed: false
    };
    return LootQuest;
};

export const UseLoot = (cc: number) => {
    const LootQuest: Quest = {
        id: "lloot:" + cc,
        i18n: "USE_LOOT",
        total: 0,
        completed: false
    };
    return LootQuest;
};

export const Assault = (cc: number) => {
    const AssaultQuest: Quest = {
        id: "assault:" + cc,
        i18n: "USE_ASSAULT",
        total: 0,
        completed: false
    };
    return AssaultQuest;
};

export const getStatus = function getQuestStatus(quest: QuestNPC | Quest, userData: UserData): number {
    if (quest.id.startsWith("defeat") || quest.id.startsWith("action")) {
        if (quest.completed) 100;
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
};

export const validate = function validateQuest(quests: Array<Quest>, id: string) {
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
    }

}

export const Defeat = function MakeNPCQuest(npc: NPC): Quest {
    return {
        id: 'defeat:' + npc.id,
        npc: {
            ...npc,
            max_health: npc.health,
            max_stamina: npc.stamina
        }
    }
}