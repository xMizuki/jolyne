import type { Ability, UserData, NPC, Turn } from '../../@types';
import * as Util from '../../utils/functions';
import CommandInteractionContext from '../../structures/Interaction';

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
    stamina: 100,
    ultimate: true,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        turns[turns.length - 1].lastMove = "attack";
        const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const callerStand = Util.getStand(caller.stand);
        const victimStand = Util.getStand(victim.stand);
        const canCounter = victimStand.abilities.find(ability => ability.name === 'Time Stop') ? true : false;

        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: canCounter ? 2 : 4,
            completed: false
        };

        turns[turns.length - 1].logs.push(`!!! **${callerUsername}:** ${callerStand.name}: ${callerStand.text.timestop_text}`);
        const func = (async () => {
            if (gameOptions[tsID].completed) return;
            gameOptions.donotpush = true;
            gameOptions.invincible = true;
            gameOptions.trns--;
            if (gameOptions[tsID].cd !== 0) {
                gameOptions[tsID].cd--;
                if (gameOptions[tsID].cd === 0) {
                    gameOptions[tsID].completed = true;
                    gameOptions.donotpush = false;
                    gameOptions.invincible = false;
                    gameOptions.trns--;
                    canCounter ? turns[turns.length - 1].logs.push(`::: ${victimUsername}'s ${victimStand.name} countered the time stop`) :                     turns[turns.length - 1].logs.push(`??? **${callerUsername}:** ${callerStand.text.timestop_end_text}`);
                    gameOptions.pushnow();
                }
            }
        });

        promises.push(func);

    }
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
    stamina: 50,
    trigger: (ctx: CommandInteractionContext, promises: Array<Function>, gameOptions: any, caller: UserData | NPC, victim: UserData | NPC, trns: number, turns: Turn[]) => {
        const callerUsername = Util.isNPC(caller) ? caller.name : ctx.client.users.cache.get(caller.id)?.username;
        const victimUsername = Util.isNPC(victim) ? victim.name : ctx.client.users.cache.get(victim.id)?.username;
        const callerStand = Util.getStand(caller.stand);
        const victimStand = Util.getStand(victim.stand);
        const canCounter = victimStand.abilities.find(ability => ability.name === 'Time Stop') ? true : false;
        const damage = Math.round(Util.calcAbilityDMG(Bakugo, caller) / 10);


        const tsID = Util.generateID();
        gameOptions[tsID] = {
            cd: 3,
        };
        const func = (async () => {
            if (gameOptions[tsID].cd === 0) return;
            gameOptions[tsID].cd--;
            turns[turns.length - 1].logs.push(`:fire:${victimUsername} took some burn damages (-${damage} :heart:)`);
            victim.health -= damage;
            if (victim.health <= 0) {
                victim.health = 0;
                turns[turns.length - 1].logs.push(`:fire:${victimUsername} died by burning`);
            }
        });

        promises.push(func);
    }
}

export const Vine_Slap: Ability = {
    name: 'Vine Slap',
    description: "extends Hermit Purple's vines to whip twice in the opponent's dierction",
    cooldown: 6,
    damages: 20,
    blockable: true,
    dodgeable: true,
    stamina: 25
}

export const The_Joestar_Technique: Ability = {
    name: 'The Joestar Technique',
    description: '..... runs away using the secret Joestar Technique. yes this is too op',
    cooldown: 0,
    damages: 0,
    blockable: false,
    dodgeable: false,
    stamina: 0
}

export const Fencing_Barrage: Ability = {
    name: 'Fencing Barrage',
    description: 'A defensive 360-degree slash that does multiple hits.',
    cooldown: 5,
    damages: 15,
    blockable: false,
    dodgeable: true,
    stamina: 20
}

export const Finisher: Ability = {
    name: 'Finisher',
    description: 'attacks or finish the opponent by aiming at one of his vital parts [CRITICAL]',
    cooldown: 11,
    damages: 30,
    blockable: false,
    dodgeable: false,
    stamina: 35
}
    