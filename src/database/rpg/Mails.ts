import type { Mail, Quest, Chapter, NPC } from '../../@types';
import * as Emojis from '../../emojis.json';
import * as Items from './Items';
import * as NPCs from './NPCs';
import * as Quests from './Quests';

const Defeat = (npc: NPC) : Quest => {
    return {
        id: 'defeat:' + npc.id,
        npc: {
            ...npc,
            max_health: npc.health,
            max_stamina: npc.stamina
        }
    }
}

export const P1C1_GP: Mail = {
    id: "p1c2:gp",
    author: NPCs.Harry_Lester,
    object: "My granson...",
    content: "I hope you are doing well! We haven't seen each other for 2 years now. I hope that since you entered high school you have not had any problems and that you are doing well. If you have any problems, don't hesitate to see me! (especially for problems in fighting, don't forget how strong I am). Oh and, look at your balance, I made you a surprise! Good luck with your studies!\n\nTake care!",
    date: Date.now(),
    footer: 'From your grandpa ❤️',
    prize: {
        money: 500
    },
    archived: false
}

export const SUPPORT_THXREM: Mail = {
    id: "support:thxrem",
    author: NPCs.Jolyne_Team,
    object: "PREMIUM",
    content: `Hello {{userName}},\n
Thank you for becoming a Patreon! Each and every donation keeps Jolyne alive and helps the developer stay motivated.
As a thank you, I gave you **7,500** <:xp:925111121600454706> and **25,000** <:jocoins:927974784187392061>. Want more? Take these 15 arrows, it's free.`,
    date: Date.now(),
    footer: 'Thanks!',
    prize: {
        items: [
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
            Items.Mysterious_Arrow,
        ]
    },
    archived: false
}

export const P1C2_KAKYOIN_BACK: Mail = {
    id: "p1c2:kakyoin_back",
    author: NPCs.Kakyoin,
    object: "Yo!",
    content: `Yooooooo **{{userName}}** !\n\nWe haven't seen each other for a long time... I'm sorry for what happened, I know you'll find it hard to believe but I was manipulated...\nI wonder how you got your stand... Well, to make it up to you, I'll buy you 10 pizzas. I know it's nothing but it's better than nothing ¯\\(ツ)_/¯
        
BTW today some **bandits** attacked my sister, but I can't do anything since i'm in the hospital. Please beat their asses for me !1!1!!1`,
    date: Date.now(),
    footer: 'DONT LOSE OR ELSE ILL KILL YOU!1!111!1',
    chapter_quests: [
        Defeat(NPCs.Weak_Bandit),
        Defeat(NPCs.Weak_Bandit),
        Defeat(NPCs.Weak_Bandit),
        Defeat(NPCs.Weak_Bandit),
        Defeat(NPCs.Weak_Bandit),
        Defeat(NPCs.Strong_Bandit),
        Defeat(NPCs.Strong_Bandit),
        Defeat(NPCs.Strong_Bandit),
        Defeat(NPCs.Bandit_Boss)
    ],
    prize: {
        items: [
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
            Items.Pizza,
        ]
    },
    archived: false
}

export const P1C2_SPEEDWAGON_DIO_HAIR: Mail = {
    author: NPCs.SPEEDWAGON_FOUNDATION,
    id: "p1c2:speedwagon_diohair",
    object: "Analysis completed.",
    content: `Hello **{{userName}}** ,\n\Thank you for bringing us this hair. This hair is from a criminal named "Dio". You can see what this Dio looks like just below the email (attachments). If you ever see this Dio again (even if it is impossible), please contact us immediately.
(Picture of DIO)`,
    archived: false,
    image: "https://cdn.discordapp.com/attachments/930147452579889152/942118200043245619/Photo_de_Dio.png",
    emoji: "📧",
    date: Date.now(),
    footer: "Sincerely, THE SPEEDWAGON FOUNDATION"
}

const Go_To_Airport: Quest = {
    id: "action:gotoairport",
    i18n: "GO_TO_AIRPORT",
    emoji: "🚕",
    completed: false
}
export const GF_MDIO: Mail = {
    author: NPCs.Harry_Lester,
    id: "gf:mdio",
    object: "Dio..",
    content: `My grandson... So Dio was not dead...
Well, at least you're okay. We have to do something as soon as possible, humanity is in danger, we have to get rid of him. I am waiting for you at the airport of Morioh with your friend Kakyoin, don't tell me how I got him here, come quickly find us, I am accompanied by a very strong man...`,
    archived: false,
    emoji: "📧",
    date: Date.now(),
    footer: "DONT DIE!!!!",
    chapter_quests: [Go_To_Airport]
}
