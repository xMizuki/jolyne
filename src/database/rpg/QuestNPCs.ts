import type { QuestNPC } from '../../@types';

export const kakyoin: QuestNPC = {
    id: 'defeat:kakyoin',
    name: 'Kakyoin',
    level: 1,
    health: 80,
    max_health: 80,
    stamina: 60,
    skill_points: {
        strength: 2,
        defense: 2,
        perceptibility: 2,
        stamina: 2
    },
    rewards: {
        xp: 1000,
        money: 500
    }
};

export const guards: QuestNPC = {
    id: 'defeat:guard',
    name: 'Security Guard',
    level: 1,
    health: 150,
    max_health: 150,
    stamina: 0,
    skill_points: {
        strength: 10,
        defense: 2,
        perceptibility: 2,
        stamina: 2
    },
    rewards: {
        xp: 1500,
        money: 100
    }
};

export const Star_Platinum_User: QuestNPC = {
    id: 'defeat:star_platinum_user',
    name: 'Star Platinum User',
    level: 10,
    health: 300,
    max_health: 300,
    stamina: 200,
    skill_points: {
        strength: 2,
        defense: 2,
        perceptibility: 5,
        stamina: 2
    },
    stand: "Star Platinum",
    rewards: {
        xp: 4000,
        money: 1000
    }
};

export const The_World_User: QuestNPC = {
    id: 'defeat:the_world_user',
    name: 'The World User',
    level: 10,
    health: 300,
    max_health: 300,
    stamina: 200,
    skill_points: {
        strength: 2,
        defense: 2,
        perceptibility: 5,
        stamina: 2
    },
    stand: "The World",
    rewards: {
        xp: 5000,
        money: 1000
    }

};

export const Weak_Bandit: QuestNPC = {
    id: 'defeat:wk_bandit',
    name: 'Weak Bandit',
    level: 1,
    health: 50,
    max_health: 50,
    stamina: 0,
    skill_points: {
        strength: 0,
        defense: 0,
        perceptibility: 0,
        stamina: 0
    },
    rewards: {
        xp: 100,
        money: 100
    }
};

export const Strong_Bandit: QuestNPC = {
    id: 'defeat:str_bandit',
    name: 'Strong Bandit',
    level: 5,
    health: 150,
    max_health: 150,
    stamina: 0,
    skill_points: {
        strength: 10,
        defense: 0,
        perceptibility: 10,
        stamina: 0
    },
    rewards: {
        xp: 500,
        money: 500
    }
};

export const Bandit_Boss: QuestNPC = {
    id: 'defeat:boss_bandit',
    name: 'Bandit Boss',
    level: 10,
    health: 250,
    max_health: 250,
    stamina: 200,
    skill_points: {
        strength: 10,
        defense: 10,
        perceptibility: 10,
        stamina: 10
    },
    rewards: {
        xp: 10000,
        money: 5000
    },
    stand: "The Hand"
};