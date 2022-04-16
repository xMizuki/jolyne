import type { Ability } from '../../@types';

export const Stand_Barrage: Ability = {
    name: 'Barrage',
    description: 'Performs an astoundingly fast flurry of punches that deals small damage per hit',
    cooldown: 5,
    damages: 10,
    blockable: false,
    dodgeable: true,
    stamina: 10
};

export const Kick_Barrage: Ability = {
    name: 'Kick Barrage',
    description: 'Performs an astoundingly fast flurry of punches that deals small damage per hit',
    cooldown: 3,
    damages: 7,
    blockable: true,
    dodgeable: true,
    stamina: 5
};

export const Star_Finger: Ability = {
    name: 'Star Finger',
    description: 'Extends Star Platinum\'s finger and stabs the target in the eyes',
    cooldown: 10,
    damages: 25,
    blockable: false,
    dodgeable: true,
    stamina: 20
};

export const Time_Stop: Ability = {
    name: 'Time Stop',
    description: 'Stops time for a short period of time (4 turns)',
    cooldown: 10,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 100
};

export const Road_Roller: Ability = {
    name: 'Road Roller',
    description: 'jumps high into the sky, bringing a steamroller down with them, slamming it down where they were previously standing',
    cooldown: 10,
    damages: 25,
    blockable: false,
    dodgeable: true,
    stamina: 20
};

export const Emerald_Splash: Ability = {
    name: 'Emerald Splash',
    description: 'fires off a large amount of energy which takes the form of emeralds.',
    cooldown: 10,
    damages: 25,
    blockable: false,
    dodgeable: true,
    stamina: 20
};

export const Vola_Barrage: Ability = {
    name: 'Vola Barrage',
    description: 'Sends a wave of bullets in the direction the user is facing.',
    cooldown: 10,
    damages: 15,
    blockable: false,
    dodgeable: true,
    stamina: 30
};

export const Little_Boy: Ability = {
    name: 'Little Boy',
    description: 'drop 3 bombs behind its opponent that will explode instantly',
    cooldown: 15,
    damages: 30,
    blockable: false,
    dodgeable: false,
    stamina: 50
}

export const Light_Speed_Barrage: Ability = {
    name: 'Light-Speed Barrage',
    description: 'erases matter to jump on the enemies and assault them with rapid punches.',
    cooldown: 10,
    damages: 25,
    blockable: false,
    dodgeable: false,
    stamina: 40
}

export const Deadly_Erasure: Ability = {
    name: 'Deadly Erasure',
    description: 'uses their right hand to erase space and jump one you and use the effect of surprise to erase you and make you discover where thing he erase go..',
    cooldown: 20,
    damages: 60,
    blockable: false,
    dodgeable: false,
    stamina: 100
}

export const Crossfire_Hurricane: Ability = {
    name: 'Crossfire Hurricane',
    description: 'launches 1 cross in the shape of an ankh at the oppenent.',
    cooldown: 5,
    damages: 10,
    blockable: true,
    dodgeable: true,
    stamina: 20
}

export const Red_Bind: Ability = {
    name: 'Red Bind',
    description: 'takes two swings at the opponent with fiery chains.',
    cooldown: 7,
    damages: 15,
    blockable: true,
    dodgeable: true,
    stamina: 22
}

export const Bakugo: Ability = {
    name: 'Bakugo',
    description: "grabs the opponent before engulfing the opponent's head in flames.",
    cooldown: 15,
    damages: 45,
    blockable: false,
    dodgeable: false,
    stamina: 50
}


    