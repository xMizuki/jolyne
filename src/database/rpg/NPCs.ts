import type { NPC } from '../../@types';
import * as Emojis from '../../emojis.json';
import * as Items from './Items';
import * as Stands from './Stands';

export const Harry_Lester: NPC = {
    id: 'harry_lester',
    email: 'harry.lester78@mori.oh',
    name: "Harry Lester",
    emoji: '👴'
}

export const Jolyne_Team: NPC = {
    id: 'jolyne_team',
    email: 'support@jolyne.wtf',
    name: "Jolyne TEAM",
    emoji: Emojis.happyjolyne
}

export const Jolyne: NPC = {
    id: 'jolyne',
    name: "Jolyne",
    emoji: Emojis.jolyne
}

export const SPEEDWAGON_FOUNDATION: NPC = {
    id: 'speedwagon_foundation',
    email: 'contact@speedwagon.net',
    name: "SPEEDWAGON FOUNDATION",
    emoji: '🔬'
}

export const Kakyoin: NPC = {
    id: 'kakyoin',
    email: 'kakyoin69@mori.oh',
    name: "Kakyoin",
    emoji: Emojis.kakyoin_serious,
    level: 1,
    health: 80,
    max_health: 80,
    stamina: 60,
    skill_points: {
        strength: 2,
        defense: 2,
        perception: 2,
        stamina: 2
    },
    fight_rewards: {
        xp: 1000,
        money: 500
    },
    stand: Stands.Hierophant_Green["name"],
    avatarURL: 'https://steamuserimages-a.akamaihd.net/ugc/921427477593480623/EA78387AF7B63E522A76CA04E2557C886C66300A/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
}

export const Security_Guard: NPC = {
    id: 'guard',
    name: 'Security Guard',
    emoji: '💂',
    level: 1,
    health: 50,
    max_health: 50,
    stamina: 0,
    skill_points: {
        strength: 10,
        defense: 2,
        perception: 2,
        stamina: 2
    },
    fight_rewards: {
        xp: 1500,
        money: 100
    }
}

export const Star_Platinum_User: NPC = {
    id: 'star_platinum_user',
    name: 'Star Platinum User',
    emoji: Emojis.sp,
    level: 10,
    health: 300,
    max_health: 300,
    stamina: 200,
    skill_points: {
        strength: 2,
        defense: 2,
        perception: 5,
        stamina: 2
    },
    stand: Stands.Star_Platinum["name"],
    fight_rewards: {
        xp: 4000,
        money: 1000
    }
}

export const The_World_User: NPC = {
    id: 'the_world_user',
    name: 'The World User',
    emoji: Emojis.the_world,
    level: 10,
    health: 300,
    max_health: 300,
    stamina: 200,
    skill_points: {
        strength: 2,
        defense: 2,
        perception: 2,
        stamina: 2
    },
    fight_rewards: {
        xp: 4000,
        money: 1000
    },
    stand: Stands.The_World["name"]
}

export const Weak_Bandit: NPC = {
    id: 'wk_bandit',
    name: 'Weak Bandit',
    emoji: '💢',
    level: 1,
    health: 50,
    max_health: 50,
    stamina: 60,
    skill_points: {
        strength: 2,
        defense: 2,
        perception: 5,
        stamina: 2
    },
    fight_rewards: {
        xp: 100,
        money: 500
    }
}

export const Strong_Bandit: NPC = {
    id: 'str_bandit',
    name: 'Strong Bandit',
    emoji: '💢',
    level: 3,
    health: 150,
    max_health: 150,
    stamina: 60,
    skill_points: {
        strength: 2,
        defense: 2,
        perception: 5,
        stamina: 2
    },
    fight_rewards: {
        xp: 500,
        money: 500
    }
}

export const Bandit_Boss: NPC = {
    id: 'boss_bandit',
    name: 'Bandit Boss',
    emoji: '💢',
    level: 10,
    health: 300,
    max_health: 300,
    stamina: 200,
    skill_points: {
        strength: 2,
        defense: 2,
        perception: 2,
        stamina: 2
    },
    fight_rewards: {
        xp: 4000,
        money: 1000
    },
    stand: Stands.Aerosmith["name"]
};

export const Taxi_Driver: NPC = {
    id: 'taxi_driver',
    name: 'Taxi Driver',
    emoji: '🚕'
}

export const Mohammed_Avdol: NPC = {
    id: 'mohammed_avdol',
    name: 'Mohammed Avdol',
    emoji: '<:avdolHMMM:946797121313603584>',
    level: 20,
    health: 700,
    max_health: 700,
    stamina: 200,
    skill_points: {
        strength: 40,
        defense: 20,
        perception: 20,
        stamina: 20
    },
    fight_rewards: {
        xp: 10000,
        money: 10000
    },
    stand: Stands.Magicians_Red["name"],
    private: true
}

export const Lisa: NPC = {
    id: 'lisa',
    name: 'Lisa',
    emoji: Emojis.cryyy
}

export const Polnareff: NPC = {
    id: 'polnareff',
    name: 'Jean-Pierre Polnareff',
    emoji: Emojis.Polnareff,
    level: 20,
    health: 400,
    max_health: 400,
    stamina: 300,
    skill_points: {
        strength: 20,
        defense: 20,
        perception: 10,
        stamina: 20
    },
    fight_rewards: {
        xp: 10000,
        money: 10000
    },
    stand: Stands.Silver_Chariot["name"],
    avatarURL: 'https://pbs.twimg.com/media/EZq-yvPXkAQc6Bv.jpg',
    private: true
}

export const Devo: NPC = {
    id: 'devo',
    name: 'Devo',
    emoji: Stands.Ebony_Devil["emoji"],
    level: 2,
    health: 120,
    max_health: 120,
    stamina: 120,
    skill_points: {
        strength: 2,
        defense: 2,
        perception: 2,
        stamina: 2
    },
    fight_rewards: {
        xp: 1000,
        money: 500,
        items: [
            Items.Mysterious_Arrow
        ]
    },
    stand: Stands.Ebony_Devil["name"],
    avatarURL: 'https://static.wikia.nocookie.net/jojo/images/4/43/Devo_full_color.png/revision/latest?cb=20170315225526&path-prefix=es',
    dialogues: {
        lose: 'NOOOOOO PLEASE SPARE ME fsdmlgsdkgl!sdf42144242241! ! ! ! ! ! ! !',
        win: 'LOL NOT EVEN HARD GET REKT BOZO L L L L L L'
    },
    private: true
}

export const Jotaro: NPC = {
    id: 'jotaro',
    name: 'Jotaro',
    emoji: Emojis.jotaro,
    level: 200,
    health: 1500,
    max_health: 1500,
    stamina: 1500,
    skill_points: {
        strength: 200,
        defense: 200,
        perception: 200,
        stamina: 200
    },
    fight_rewards: {
        xp: 100000,
        money: 100000
    },
    stand: Stands.Star_Platinum["name"],
    dialogues: {
        assault: "Yare Yare, I'll end this quickly.",
        lose: "I'll be back!",
        win: "... Too easy."
    },
    avatarURL: 'https://media.discordapp.net/attachments/971380591478059018/977503787629543474/unknown.png'
}

export const Dio: NPC = {
    id: 'dio',
    name: 'Dio',
    emoji: Emojis.dio,
    level: 200,
    health: 1500,
    max_health: 1500,
    stamina: 1500,
    skill_points: {
        strength: 200,
        defense: 200,
        perception: 200,
        stamina: 200
    },
    fight_rewards: {
        xp: 100000,
        money: 100000
    },
    stand: Stands.The_World["name"],
    dialogues: {
        assault: "WRYYYYYY!",
        lose: "Wryy... I'LL BE BACK!",
        win: "Not even hard..."
    },
    avatarURL: 'https://vignette.wikia.nocookie.net/jojo/images/d/d4/Dio_full_color.png/revision/latest?cb=20170315231205&path-prefix=es'
}

export const Normal_Citizen: NPC = {
    id: 'normal_citizen',
    name: 'Normal Citizen',
    emoji: '👨‍🌾',
    level: 1,
    health: 50,
    max_health: 50,
    stamina: 50,
    skill_points: {
        strength: 1,
        defense: 1,
        perception: 1,
        stamina: 1
    },
    fight_rewards: {
        xp: 100,
        money: 100
    },
    dialogues: {
        assault: "Hey, you there!",
        lose: "Why'd you do that?",
        win: "Beware!"
    }
}

export const Police_Officer: NPC = {
    id: 'police_officer',
    name: 'Police Officer',
    emoji: '👮‍♂️',
    level: 1,
    health: 50,
    max_health: 50,
    stamina: 50,
    skill_points: {
        strength: 1,
        defense: 1,
        perception: 1,
        stamina: 1
    },
    fight_rewards: {
        xp: 100,
        money: 100
    },
    dialogues: {
        assault: "Hey, you there!",
        lose: "Justice won't lose!",
        win: "Justice won."
    }
}

export const Mysterious_Stand_User: NPC = {
    id: 'mysterious_stand_user',
    name: 'Mysterious Stand User',
    emoji: '🧙‍♂️',
    level: 10,
    health: 100,
    max_health: 100,
    stamina: 100,
    skill_points: {
        strength: 10,
        defense: 10,
        perception: 10,
        stamina: 10
    },
    fight_rewards: {
        xp: 1200,
        money: 3000
    },
    dialogues: {
        assault: "...",
        lose: "...",
        win: "..."
    },
    stand: (() => {
        const stands = Object.values(Stands)
        return stands[Math.floor(Math.random() * stands.length)].name
    })(),
    private: true
}

export const Pucci: NPC = {
    id: 'pucci',
    name: 'Pucci',
    emoji: Emojis.Pucci,
    level: 200,
    health: 5000,
    max_health: 5000,
    stamina: 5000,
    skill_points: {
        strength: 200,
        defense: 200,
        perception: 200,
        stamina: 200
    },
    fight_rewards: {
        xp: 1000000,
        money: 1000000
    },
    stand: Stands.Whitesnake["name"]
}

export const Gray_Fly: NPC = {
    id: 'gray_fly',
    name: 'Gray Fly',
    emoji: '🪰',
    level: 20,
    health: 500,
    max_health: 500,
    stamina: 500,
    skill_points: {
        strength: 40,
        defense: 30,
        perception: 30,
        stamina: 30
    },
    fight_rewards: {
        xp: 25000,
        money: 10000,
    },
    stand: Stands.Tower_Of_Gray["name"],
    private: true
}
