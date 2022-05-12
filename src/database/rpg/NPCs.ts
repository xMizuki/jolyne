import type { NPC } from '../../@types';
import * as Emojis from '../../emojis.json';
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
    stand: Stands.Hierophant_Green["name"]

}

export const Security_Guard: NPC = {
    id: 'guard',
    name: 'Security Guard',
    emoji: '💂',
    level: 1,
    health: 150,
    max_health: 150,
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
    }
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
    stand: Stands.Magicians_Red["name"]
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
    health: 500,
    max_health: 500,
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
    stand: Stands.Silver_Chariot["name"]
}

export const Devo: NPC = {
    id: 'devo',
    name: 'Devo',
    emoji: Stands.Ebony_Devil["emoji"],
    level: 10,
    health: 120,
    max_health: 120,
    stamina: 120,
    skill_points: {
        strength: 5,
        defense: 5,
        perception: 5,
        stamina: 5
    },
    fight_rewards: {
        xp: 1000,
        money: 500
    },
    stand: Stands.Ebony_Devil["name"],
}