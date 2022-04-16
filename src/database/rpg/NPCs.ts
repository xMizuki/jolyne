import type { NPC } from '../../@types';

export const kakyoin: NPC = {
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
    }
};

export const guards: NPC = {
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
    }
};

export const Star_Platinum_User: NPC = {
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
    stand: "Star Platinum"
};

export const The_World_User: NPC = {
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
    stand: "The World"
};
