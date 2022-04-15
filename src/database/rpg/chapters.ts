const guards = {
    id: "defeat:guard",
    english_name: "Defeat a Guards",
    ennemy: "Security Guard",
    max_hp: 150,
    level: 2,
    skill_points: {
        strength: 10,
        perceptibility: 2,
        stamina: 2,
        defense: 2 
    },
    hp: 150,
    completed: false
}

export default {
    1: {
        english_description: "You live an ordinary life until you are 15 years old. It's your first day in high school, you're on your way home from school and you see an old classmate. It's Kakyoin ! You greet him but but he runs into you and attacks you. It appears he's being manipulated.\n\nP.S: He's a stand user...",
        english_title: "Prologue",
        tips: ["You may need the `/loot` command until you collect an amout of coins in order to complete some of your quests"],
        french_description: "Vous vivez une vie ordinaire jusqu'à l'âge de 15 ans. C'est votre premier jour au lycée, vous rentrez de l'école et vous croisez un ancien camarade de classe. C'est Kakyoin ! Il te fonce dessus et t'attaque. Il semble qu'il soit un utilisateur de stand...",
        quests: [{
                id: "defeat:kakyoin",
                english_name: "Defeat Kakyoin (using the `/battle` command)",
                ennemy: "Kakyoin",
                stand: "Hierophant Green",
                max_hp: 80,
                level: 2,
                skill_points: {
                    strength: 2,
                    perceptibility: 2,
                    stamina: 2,
                    defense: 2 
                },
                hp: 80,
                completed: false
            },
            {
                id: "cc:3500",
                english_name: "Collect **2,000** coins",
                completed: false,
                total: 0
            },
            {
                id: "getstand",
                english_name: "Awaken your stand... <:mysterious_arrow:924013675126358077>"
            },
            {
                id: "loot:100",
                total: 0,
                completed: false
            },
            {
                id: "cdaily:2",
                total: 0,
                completed: false
            }
        ]
    },
    2:  {
        english_description: "You finally beat Kakyoin. You notice a strange creature on his head, you conclude that it is because of this creature that he is manipulated. On his back, you also find some yellow hairs...",
        english_title: "The beginning",
        tips: ["You may need the `/action` command in order to complete some of your quests"],
        mails: ["p1c2:gp"],
        items: ["mysterious_arrow", "yellow_hair"],
        french_description: "Vous vivez une vie ordinaire jusqu'à l'âge de 15 ans. C'est votre premier jour au lycée, vous rentrez de l'école et vous croisez un ancien camarade de classe. C'est Kakyoin ! Il te fonce dessus et t'attaque. Il semble qu'il soit un utilisateur de stand...",
        quests: [
            {
                id: "action:remove_thing_kakyoin",
                english_title: "Remove the creature",
                english_name: "Remove the creature on the head of the Kakyoin (50% success rate)",
                completed: false,
                emoji: "<:nextlvl:925416226547707924>" 
            },
            {
                id: "action:analyse_hair",
                english_title: "Analyse these hairs",
                english_name: "Send these yellow hairs to the SPEEDWAGON FOUNDATION",
                email_timeout: `${3600000+Date.now()}_speedwagon:diohair`,
                completed: false,
                emoji: "📧"
            },
            {
                id: "cdaily:2",
                total: 0,
                completed: false
            }

        ]

    },
    3:  {
        english_description: "Kakyoin tells you that he has been manipulated by a certain Dio and asks you if you could stop Dio. You accept and you have the mission to contact your grandfather about Dio...",
        english_title: "A bizarre journey",
        tips: ["You may need the `/action` command in order to complete some of your quests"],
        items: ["mysterious_arrow", "mysterious_arrow"],
        french_description: "Vous vivez une vie ordinaire jusqu'à l'âge de 15 ans. C'est votre premier jour au lycée, vous rentrez de l'école et vous croisez un ancien camarade de classe. C'est Kakyoin ! Il te fonce dessus et t'attaque. Il semble qu'il soit un utilisateur de stand...",
        quests: [
            {
                id: "action:tygad",
                english_title: "Tell to your grandfather about Dio",
                english_name: "Send an e-mail to your grandfather",
                email_timeout: `${3600000+Date.now()}_gf:mdio`,
                completed: false,
                emoji: "📧"
            }
        ]
    },
    4:  {
        english_description: "You enter the airport and meet Mohammed Avdol. You also saw your grandfather and your friend Kakyoin again. Unfortunately, it seems that your grandfather has sexually assaulted someone. The guards are after your grandfather and you have to finish them.",
        english_title: "A bizarre journey",
        tips: ["You may need the `/assault` & the `/loot` command in order to complete some of your quests"],
        french_description: "Vous vivez une vie ordinaire jusqu'à l'âge de 15 ans. C'est votre premier jour au lycée, vous rentrez de l'école et vous croisez un ancien camarade de classe. C'est Kakyoin ! Il te fonce dessus et t'attaque. Il semble qu'il soit un utilisateur de stand...",
        dialogues: [
            "<:josepHHM:946797056360583178> Yo my gran- YO what the hell is it really you?????? Anyway, this is my friend, Mohammed Avdol. He's a stand handler, like us.",
            "<:avdolHMMM:946797121313603584> Hello {{userName}}, glad to meet you",
            "<:kakyoin_normal:925688492623818762> Yooooo {{userName}}, glad to see that you're fine",
            "<:josephChad:946797323927838800> Anyways so first of all, i'm going to tell you who Dio is really.",
            "\nDio is just a motherf*cker.",
            "<:avdolHMMM:946797121313603584> Indeed",
            "<:josephChad:946797323927838800> Ok so-",
            "<:cryyy:946797527716495412> IT'S HIM! HE'S THE ONE WHO TOUCHED MY ASS! STOP THIS PERVERT !!!1!1!11!",
            "💂‍♂️ OK, GOT IT",
            "<:OMG:946797585220374558> NOOOOO ! *runs*   BEAT THESE GUARDS PLZ, SEE YA LATER IN THE PLANE **F-6969**"
        ],
        quests: [
            guards, guards, guards, guards, guards, guards, guards, guards, guards, guards, guards, guards, guards, guards, guards,
            {
                id: "cdaily:2",
                total: 0,
                completed: false
            },
            {
                id: "cc:20000",
                total: 0,
                completed: false
            },
            {
                id: `assault:10`,
                total: 0,
                completed: false
            },
            {
                id: `lloot:5`,
                total: 0,
                completed: false
            },
        ]

    }


}