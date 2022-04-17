import type { Item, UserData, Stand } from "../../@types";
import CommandInteractionContext from "../../structures/Interaction";
import * as Emojis from '../../emojis.json';
import * as Stands from './Stands';
import * as Util from '../../utils/functions'

export const Pizza: Item = {
  name: "Pizza",
  description: "A delicious pizza",
  type: "food",
  cost: 750,
  tradable: true,
  storable: true,
  emoji: Emojis.complete_pizza,
  benefices: {
    health: 75,
  },
  shop: "Tonio Trussardi's Restaurant"
};

export const Spaghetti_Bowl: Item = {
  name: "Spaghetti Bowl",
  description: "A bowl of spaghetti",
  type: "food",
  cost: 2000,
  tradable: false,
  storable: false,
  emoji: "🍝",
  benefices: {
    health: 200,
    stamina: 30,
  },
  shop: "Tonio Trussardi's Restaurant"
};

export const Salad_Bowl: Item = {
  name: "Salad Bowl",
  description: "A bowl of salad",
  type: "food",
  cost: 575,
  tradable: false,
  storable: false,
  emoji: "🥗",
  benefices: {
    health: 50,
    stamina: 50
  },
  shop: "Tonio Trussardi's Restaurant"
};

export const Slice_of_Pizza: Item = {
  name: "Slice of Pizza",
  description: "A slice of pizza",
  type: "food",
  cost: 150,
  tradable: true,
  storable: true,
  emoji: "🍕",
  benefices: {
    health: 10,
  },
  shop: "Tonio Trussardi's Restaurant"
};

export const Mysterious_Arrow: Item = {
  name: "Mysterious Arrow",
  description: "A mysterious arrow",
  type: "arrow",
  cost: 30000,
  tradable: true,
  storable: true,
  emoji: Emojis.mysterious_arrow,
  benefices: {
    stand: 'random'
  },
  shop: "Black Market",
  use: async (ctx: CommandInteractionContext, userData: UserData) => {
    const StandsArray: Stand[] = Object.keys(Stands).filter(r => Stands[r as keyof typeof Stands].available).map(r => Stands[r as keyof typeof Stands]);
    const percent: number = Util.getRandomInt(0, 100);
    if (userData.stand) {
      await ctx.sendT("items:MYSTERIOUS_ARROW.ALREADY_STAND");
      await Util.wait(2000);
      return await ctx.sendT("items:MYSTERIOUS_ARROW.ALREADY_STAND2");
    }
    await ctx.client.database.setCache("action", userData.id, 1);
    await ctx.sendT("items:MYSTERIOUS_ARROW.MANIFESTING");
    await Util.wait(2000);
    await ctx.sendT("items:MYSTERIOUS_ARROW.INVADING");
    await Util.wait(2000);

    let stand: Stand;
    if (percent <= 4) {
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "S"));
    } else if (percent <= 15) {
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "A"));
    } else if (percent <= 40) {
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "B"));
    } else if (percent <= 70) {
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "C"));
    }
    userData.stand = stand.name;
    await ctx.client.database.saveUserData(userData);
    await ctx.client.database.delCache("action", userData.id);
    return ctx.makeMessage({
      content: stand.name
    });

  }
};