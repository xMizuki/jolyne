import type { Ability, Stand } from '../../@types';
import * as Abilities from './Abilities';

export const Star_Platinum: Stand = {
    name: 'Star Platinum',
    description: 'Star Platinum is a very strong humanoid Stand. It was designed to look like a guardian spirit. It was used by [Jotaro Kujo](https://jojo.fandom.com/wiki/Jotaro_Kujo)',
    color: '#985ca3',
    image: 'https://i.pinimg.com/originals/c8/a7/ed/c8a7edf03bcce4b74a24345bb1a109b7.jpg',
    abilities: [
        Abilities.Stand_Barrage
    ],
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 5,
        stamina: 0
    },
    other: {
        woketext: "OrRrr.. OrrRrRRrRrR... RrrRQRrR....",
        wokelast: "ORAAAAAAAAAAAAAAAA !!!!"
    }

};