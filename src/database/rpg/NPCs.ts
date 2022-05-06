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
    stand: Stands.Hierophant_Green.name

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
    stand: Stands.Star_Platinum.name,
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
    stand: Stands.Aerosmith.name
};