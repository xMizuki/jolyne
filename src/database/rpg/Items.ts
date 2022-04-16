import type { Item } from "../../@types";

export const Pizza: Item = {
  name: "Pizza",
  description: "A delicious pizza",
  type: "food",
  cost: 750,
  tradable: true,
  storable: true,
  emoji: "<:complete_pizza:929061977148506133>",
  benefices: {
    health: 75,
    stamina: 0,
    stand: null,
  },
  shop: "Tonio Trussardi's Restaurant",
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
    stand: null,
  },
  shop: "Tonio Trussardi's Restaurant",
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
    stamina: 50,
    stand: null,
  },
  shop: "Tonio Trussardi's Restaurant",
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
    stamina: 0,
    stand: null,
  },
  shop: "Tonio Trussardi's Restaurant",
};
