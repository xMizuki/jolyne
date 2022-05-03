import type { Stand } from "../../@types";
import * as Abilities from "./Abilities";
import * as Emojis from '../../emojis.json';

export const Star_Platinum: Stand = {
    name: "Star Platinum",
    rarity: "S",
    description: "Star Platinum is a very strong humanoid Stand. It was designed to look like a guardian spirit. It was used by [Jotaro Kujo](https://jojo.fandom.com/wiki/Jotaro_Kujo)",
    color: "#985ca3",
    image: "https://i.pinimg.com/originals/c8/a7/ed/c8a7edf03bcce4b74a24345bb1a109b7.jpg",
    abilities: [
        Abilities.Stand_Barrage,
        Abilities.Kick_Barrage,
        Abilities.Star_Finger,
        Abilities.Time_Stop,

    ],
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 5,
        stamina: 0,
    },
    text: {
        awakening_text: "OrRrr.. OrrRrRRrRrR... RrrRQRrR....",
        awaken_text: "ORAAAAAAAAAAAAAAAA !!!!",
    },
    emoji: Emojis.sp,
    available: true
};

export const The_World: Stand = {
    name: "The World",
    rarity: "S",
    description: "The World, a humanoid Stand, is tall and has a very muscular build. It bears a striking resemblance to [Dio Brando](https://jojo.fandom.com/wiki/Dio_Brando) in terms of appearance.",
    abilities: [
        Abilities.Stand_Barrage,
        Abilities.Kick_Barrage,
        Abilities.Road_Roller,
        Abilities.Time_Stop,
    ],
    color: "YELLOW",
    image: "https://pbs.twimg.com/media/EiN6WPVWoAAAODC?format=jpg&name=large",
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 5,
        stamina: 0,
    },
    text: {
        awakening_text: "WrRrR3.. WrRrrR WRYYRrR...",
        awaken_text: "WRRRRYYYYYYYY !!!!",
        timestop_text: "Toki wo TAMARE!",
        timestop_end_text: "Zero...",
    },
    emoji: Emojis.the_world,
    available: false
};

export const The_World__Over_Heaven: Stand = {
    name: "The World: Over Heaven",
    rarity: "SS",
    description: "The World is a humanoid Stand. It is a very tall humanoid with a very muscular build. It bears a striking resemblance to [Dio Brando](https://jojo.fandom.com/wiki/Dio_Brando) in terms of appearance.",
    abilities: [],
    color: "YELLOW",
    image: "https://pbs.twimg.com/media/EiN6WPVWoAAAODC?format=jpg&name=large",
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 5,
        stamina: 0,
    },
    text: {
        awakening_text: "WrRrR3.. WrRrrR WRYYRrR...",
        awaken_text: "WRRRRYYYYYYYY !!!!",
        timestop_text: "Toki wo TAMARE!",
        timestop_end_text: "Toki wa Ugokidasu.",

    },
    emoji: "<:sp:925699121745104918>",
    available: true
};

export const Hierophant_Green: Stand = {
    name: "Hierophant Green",
    rarity: "B",
    description: "Hierophant Green is an elastic and remote Stand, capable of being deployed far away from its user and performing actions. It is the Stand of [Noriaki Kakyoin](https://jojowiki.com/Noriaki_Kakyoin), featured in Stardust Crusaders.",
    abilities: [
        Abilities.Stand_Barrage,
        Abilities.Emerald_Splash
    ],
    color: "#6AD398",
    image: "https://static.wikia.nocookie.net/jjba/images/c/c8/HierophantGreen.png/revision/latest/scale-to-width-down/350?cb=20140807094417",
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 5,
        stamina: 0,
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "Done.",
    },
    emoji: Emojis.hierophant_green,
    available: true
};

export const Aerosmith: Stand = {
    name: "Aerosmith",
    rarity: "C",
    description: "Aerosmith is a plane. It is a long-ranged stand. In the JJBA series, Aerosmith's owner was [Narancia Ghirga](https://jojo.fandom.com/wiki/Narancia_Ghirga)",
    abilities: [
        Abilities.Vola_Barrage,
        Abilities.Little_Boy
    ],
    color: "#0981D1",
    image: "https://static.wikia.nocookie.net/jjba/images/6/66/Aerosmithcolor.png/revision/latest?cb=20180414181107&path-prefix=fr",
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 5,
        stamina: 0,
    },
    text: {
        awakening_text: "[awakening in you... :airplane_small:]",
        awaken_text: "Done. Wait, what is 1+1 ??? I forgot what was it???",
    },
    emoji: Emojis.aerosmith,
    available: true
};

export const The_Hand: Stand = {
    name: "The Hand",
    rarity: "C",
    description: "The hand is a humanoid-type stand who can erase things from existence, it was originally owned by [Okuyasu Nijimura](https://jojo.fandom.com/wiki/Okuyasu_Nijimura)",
    abilities: [
        Abilities.Light_Speed_Barrage,
        Abilities.Deadly_Erasure,
    ],
    color: "#1d57e5",
    image: "https://static.wikia.nocookie.net/jjba/images/4/46/The_Hand_Anime.png/revision/latest?cb=20161217225524&path-prefix=fr",
    skill_points: {
        strength: 10,
        defense: 5,
        perception: 5,
        stamina: 0,
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "Done. YOOOO BRO did you know that i could erase everything ???? And did you know that bungee gum has the properties of both rubber and gum????",
    },
    emoji: Emojis.the_hand,
    available: true
};

export const Hermit_Purple: Stand = {
    name: "Hermit Purple",
    rarity: "C",
    description: "Hermit Purple is the Stand of [Joseph Joestar](https://jojo.fandom.com/wiki/Joseph_Joestar), featured in Stardust Crusaders, and occasionally in Diamond is Unbreakable. The Hermit Hermit Purple manifests itself as multiple, purple, thorn-covered vines that spawn from its handler's hand.",
    abilities: [
        Abilities.Vine_Slap,
        Abilities.The_Joestar_Technique
    ],
    color: "PURPLE",
    image: "https://static.wikia.nocookie.net/jjba/images/c/c8/HermitPurple.png/revision/latest?cb=20180414181107&path-prefix=fr",
    skill_points: {
        strength: 0,
        defense: 3,
        perception: 2,
        stamina: 0,
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "lol what who tf are you??? You ain't a Joestar doe",
    },
    emoji: Emojis.hermit_purple,
    available: true
};

export const Silver_Chariot: Stand = {
    name: "Silver Chariot",
    rarity: "C",
    description: "Silver Chariot appears as a thin, robotic humanoid clad in silver, medieval armor, armed with a basket-hilted foil. It is the Stand of [Jean Pierre Polnareff](https://jojo.fandom.com/wiki/Jean_Pierre_Polnareff), primarily featured in Stardust Crusaders ||and appearing briefly in Vento Aureo.||",
    abilities: [
        Abilities.Fencing_Barrage,
        Abilities.Finisher
    ],
    color: "#808080",
    image: "https://static.wikia.nocookie.net/jjba/images/7/7c/SilverChariot.png/revision/latest?cb=20180609123743",
    skill_points: {
        strength: 3,
        defense: 1,
        perception: 1,
        stamina: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "yo, where's my requiem arrow?!?! PLZ REQUIEM ME FAST!!1!1!11!"
    },
    emoji: Emojis.Silverchariot,
    available: true
};

export const Magicians_Red: Stand = {
    name: "Magicians Red",
    rarity: "A",
    description: "Magicians Red is a humanoid figure with a bird-like head. It has a muscular upper body and its feathered legs are sometimes covered in burning flames. It is the Stand of Muhammad Avdol, featured in Stardust Crusaders",
    abilities: [
        Abilities.Crossfire_Hurricane,
        Abilities.Red_Bind,
        Abilities.Bakugo
    ],
    color: "RED",
    image: "https://i.pinimg.com/736x/8a/cb/27/8acb27c4640370a8919e5fdc30d1d581.jpg",
    skill_points: {
        strength: 8,
        defense: 0,
        perception: 0,
        stamina: 0
    },
    text: {
        awakening_text: "[awakening in you...]",
        awaken_text: "*angry bird noises*"
    },
    emoji: Emojis.Magiciansred,
    available: true
};