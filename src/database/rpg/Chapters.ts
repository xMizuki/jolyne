import type { Chapter } from '../../@types';
import * as Quests from './Quests';
import * as NPCs from './NPCs';

export const C1: Chapter = {
    description: {
        'en-US': "You live an ordinary life until you are 15 years old. It's your first day in high school, you're on your way home from school and you see an old classmate. It's Kakyoin ! You greet him but but he runs into you and attacks you. It appears he's being manipulated.\n\nP.S: He's a stand user...",
        'fr-FR': "Vous vivez une vie ordinaire jusqu'à l'âge de 15 ans. C'est votre premier jour au lycée, vous rentrez de l'école et vous croisez un ancien camarade de classe. C'est Kakyoin ! Il te fonce dessus et t'attaque. Il semble qu'il soit un utilisateur de stand...",
        'es-ES': "Vives una vida normal hasta que tengas 15 años. Es tu primer día en la escuela, estás en tu camino hacia casa y ves un vecino. Es Kakyoin ! Te saluda pero se te pega y te ataca. Aparece que está siendo manipulado.\n\nP.S: Es un usuario de stand...",
        'de-DE': "Du lebst eine normallebende Geschichte bis du 15 Jahre alt bist. Es ist dein erster Tag in der Schule, du gehst zu Hause und siehst einen alten Kurskameraden. Er ist Kakyoin ! Du begrüßt ihn aber erst, wenn er dich angreift. Er scheint manipuliert zu sein.\n\nP.S: Er ist ein Stand-Benutzer..."
    },
    title: {
        'en-US': "Prologue",
        'fr-FR': "Prologue",
        'es-ES': "Prologue",
        'de-DE': "Prologue"
    },
    tips: {
        'en-US': ["You may need the `/loot` command until you collect an amout of coins in order to complete some of your quests"],
        'fr-FR': ["Tu peux avoir besoin de la commande `/loot` jusqu'à ce que tu as collecté un certain nombre de pièces dans le but de compléter certaines de tes quêtes"],
        'es-ES': ["Puedes necesitar la `/loot` hasta que recolectes una cantidad determinada de monedas para completar algunas de tus misiones"],
        'de-DE': ["Du kannst das `/loot`-Kommando benutzen, bis du eine bestimmte Anzahl an Münzen sammeln kannst, um einige deiner Aufgaben zu erfüllen"]
    },
    quests: [
        NPCs.kakyoin,
        Quests.Claim_Coins(3500),
        Quests.Awaken_Stand,
        Quests.Loot_Coins(100),
        Quests.Claim_Daily(2)
    ]

};