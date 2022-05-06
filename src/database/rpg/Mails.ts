import type { Mail, Quest, QuestNPC, Chapter } from '../../@types';
import * as Emojis from '../../emojis.json';
import * as Items from './Items';
import * as NPCs from './NPCs';
import * as Quests from './Quests';

export const P1C1_GP: Mail = {
    id: "p1c1_gp",
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
        Quests.Defeat(NPCs.Weak_Bandit),
        Quests.Defeat(NPCs.Weak_Bandit),
        Quests.Defeat(NPCs.Weak_Bandit),
        Quests.Defeat(NPCs.Weak_Bandit),
        Quests.Defeat(NPCs.Weak_Bandit),
        Quests.Defeat(NPCs.Strong_Bandit),
        Quests.Defeat(NPCs.Strong_Bandit),
        Quests.Defeat(NPCs.Strong_Bandit),
        Quests.Defeat(NPCs.Bandit_Boss)
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

