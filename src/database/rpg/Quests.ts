import type { Quest, UserData, QuestNPC, Chapter } from '../../@types';
import * as Emojis from '../../emojis.json';
import * as Util from '../../utils/functions';

export const Analyse_Hair: Quest = {
    id: "action:analyse_hair",
    title: {
        "en-US": "Analyse these hairs",
        "fr-FR": "Analyser ces cheveux",
        "es-ES": "Analizar estos pelos",
        "de-DE": "Analysiere diese Haare"
    },
    description: {
        "en-US": "Send these yellow hairs to the SPEEDWAGON FOUNDATION",
        "fr-FR": "Envoyez ces cheveux jaune à la FOUNDATION SPEEDWAGON",
        "es-ES": "Envía estos pelos a la FOUNDACIÓN SPEEDWAGON",
        "de-DE": "Sende diese gelben Haare zur SPEEDWAGON FOUNDATION"
    },
    i18n: "ANALYSE_HAIR",
    emoji: "📧",
    completed: false
};

export const Remove_Thing_Kakyoin: Quest = {
    id: "action:remove_thing_kakyoin",
    title: {
        "en-US": "Remove the creature",
        "fr-FR": "Enlever la créature",
        "es-ES": "Eliminar la criatura",
        "de-DE": "Entferne die Kreatur"
    },
    description: {
        "en-US": "Remove the creature on the head of the Kakyoin (50% success rate)",
        "fr-FR": "Enlever la créature sur la tête du Kakyoin (50% de réussite)",
        "es-ES": "Eliminar la criatura en la cabeza del Kakyoin (50% de éxito)",
        "de-DE": "Entferne die Kreatur auf der Kopf des Kakyoins (50% Erfolgswahrscheinlichkeit)"
    },
    i18n: "REMOVE_THING_KAKYOIN",
    emoji: "💥",
    completed: false
};

export const Tell_To_Your_Grandfather_About_Dio: Quest = {
    id: "action:tygad",
    title: {
        "en-US": "Tell to your grandfather about Dio",
        "fr-FR": "Dire à votre grand-père sur Dio",
        "es-ES": "Dile a tu abuelo sobre Dio",
        "de-DE": "Sag dein Großvater über Dio"
    },
    description: {
        "en-US": "Send an e-mail to your grandfather",
        "fr-FR": "Envoyez un courriel à votre grand-père",
        "es-ES": "Envía un correo electrónico a tu abuelo",
        "de-DE": "Sende eine E-Mail an dein Großvater"
    },
    i18n: "TELL_GRANDFATHER",
    emoji: "📧",
    completed: false
};

export const bring_kakyoin_hospital: Quest = {
    id: "action:bring_kakyoin_hospital",
    title: {
        "en-US": "Bring the Kakyoin to the hospital",
        "fr-FR": "Ramener le Kakyoin à l'hôpital",
        "es-ES": "Trae el Kakyoin al hospital",
        "de-DE": "Bringe den Kakyoin zum Krankenhaus"
    },
    description: {
        "en-US": "Bring the Kakyoin to the hospital",
        "fr-FR": "Ramener le Kakyoin à l'hôpital",
        "es-ES": "Trae el Kakyoin al hospital",
        "de-DE": "Bringe den Kakyoin zum Krankenhaus"
    },
    i18n: "BRING_KAKYOIN_HOSPITAL",
    emoji: "🏥",
    completed: false
};


export const Awaken_Stand: Quest = {
    id: "action:awaken_stand",
    title: {
        "en-US": "Awaken your stand",
        "fr-FR": "Évillez votre stand",
        "es-ES": "Despertar tu estand",
        "de-DE": "Erwecken dein Stand"
    },
    description: {
        "en-US": "Awaken your stand",
        "fr-FR": "Évillez votre stand",
        "es-ES": "Despertar tu estand",
        "de-DE": "Erwecken dein Stand"
    },
    i18n: "AWAKE_STAND",
    emoji: Emojis.mysterious_arrow,
    completed: false
};


export const LootCoins = (cc: number) => {
    const LootQuest: Quest = {
        id: "loot:" + cc,
        total: 0,
        description: {
            "en-US": "Loot " + Util.localeNumber(cc)+ " coins (using the `/loot` command)",
            "fr-FR": "Ramasser " + Util.localeNumber(cc)+ " pièces (en utilisant la commande `/loot`)",
            "es-ES": "Botín " + Util.localeNumber(cc)+ " monedas (usando el comando `/loot`)",
            "de-DE": "Plündern Sie " + Util.localeNumber(cc)+ " Münzen (mit dem `/loot` Befehl)"
        },
        i18n: "LOOT_COINS",
        emoji: Emojis.jocoins,
        completed: false

    };
    return LootQuest;
};

export const ClaimDaily = (cc: number) => {
    const LootQuest: Quest = {
        id: "cdaily:" + cc,
        description: {
            "en-US": "Claim your daily reward (using the `/daily claim` command)",
            "fr-FR": "Récupérez votre récompense quotidienne (en utilisant la commande `/daily claim`)",
            "es-ES": "Recibir tu recompensa diaria (usando el comando `/daily claim`)",
            "de-DE": "Erhalten Sie Ihre tägliche Belohnung (mit dem `/daily claim` Befehl)"
        },
        i18n: "CLAIM_DAILY",
        total: 0,
        completed: false
    };
    return LootQuest;
};

export const ClaimCoins = (cc: number) => {
    const LootQuest: Quest = {
        id: "cc:" + cc,
        description: {
            "en-US": "Claim " + Util.localeNumber(cc)+ " coins",
            "fr-FR": "Récolter " + Util.localeNumber(cc)+ " pièces",
            "es-ES": "Recibir " + Util.localeNumber(cc)+ " monedas",
            "de-DE": "Erhalten Sie " + Util.localeNumber(cc)+ " Münzen"
        },
        i18n: "CLAIM_COINS",
        total: 0,
        completed: false
    };
    return LootQuest;
};

export const UseLoot = (cc: number) => {
    const LootQuest: Quest = {
        id: "lloot:" + cc,
        description: {
            "en-US": "Use the `/loot` command" + Util.localeNumber(cc)+ ` time${Util.s(cc)}`,
            "fr-FR": "Utilisez la commande `/loot`" + Util.localeNumber(cc)+ ` fois`,
            "es-ES": "Usa el comando `/loot`" + Util.localeNumber(cc)+ ` veces`,
            "de-DE": "Benutze den `/loot` Befehl" + Util.localeNumber(cc)+ ` mal`
        },
        i18n: "USE_LOOT",
        total: 0,
        completed: false
    };
    return LootQuest;
};

export const Assault = (cc: number) => {
    const AssaultQuest: Quest = {
        id: "assault:" + cc,
        description: {
            "en-US": "Assault " + Util.localeNumber(cc)+ " times (using the `/assault` command)",
            "fr-FR": "Assaillissez " + Util.localeNumber(cc)+ " fois (en utilisant la commande `/assault`)",
            "es-ES": "Asaltar " + Util.localeNumber(cc)+ " veces (usando el comando `/assault`)",
            "de-DE": "Anzugspielen " + Util.localeNumber(cc)+ " mal (mit dem `/assault` Befehl)"
        },
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