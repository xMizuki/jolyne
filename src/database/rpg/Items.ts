import type { Item, UserData, Stand } from "../../@types";
import { MessageAttachment, MessageEmbed, ColorResolvable } from 'discord.js';
import CommandInteractionContext from "../../structures/Interaction";
import * as Emojis from '../../emojis.json';
import * as Stands from './Stands';
import * as Util from '../../utils/functions'
import * as Items from './Items';

export const Pizza: Item = {
  id: "pizza",
  name: "Pizza",
  description: "A delicious pizza",
  rarity: 'C',
  type: "consumable",
  cost: 750,
  tradable: true,
  storable: true,
  usable: true,
  emoji: Emojis.complete_pizza,
  benefits: {
    health: 75,
  }
};

export const Spaghetti_Bowl: Item = {
  id: "spaghetti_bowl",
  name: "Spaghetti Bowl",
  description: "A bowl of spaghetti",
  rarity: 'C',
  type: "consumable",
  cost: 2000,
  tradable: false,
  storable: false,
  usable: true,
  emoji: "🍝",
  benefits: {
    health: 200,
    stamina: 30,
  }
};

export const Salad_Bowl: Item = {
  id: "salad_bowl",
  name: "Salad Bowl",
  description: "A bowl of salad",
  rarity: 'C',
  type: "consumable",
  cost: 575,
  tradable: false,
  storable: false,
  usable: true,
  emoji: "🥗",
  benefits: {
    health: 50,
    stamina: 50
  }
};

export const Slice_Of_Pizza: Item = {
  id: "slice_of_pizza",
  name: "Slice of Pizza",
  description: "A slice of pizza",
  rarity: 'C',
  type: "consumable",
  cost: 150,
  tradable: true,
  storable: true,
  usable: true,
  emoji: "🍕",
  benefits: {
    health: 10,
  }
};

export const Mysterious_Arrow: Item = {
  id: "mysterious_arrow",
  name: "Mysterious Arrow",
  description: "A mysterious arrow",
  rarity: 'A',
  type: "arrow",
  cost: 30000,
  tradable: true,
  storable: true,
  usable: true,
  emoji: Emojis.mysterious_arrow,
  benefits: {
    stand: 'random'
  },
  use: async (ctx: CommandInteractionContext, userData: UserData) => {
    const StandsArray: Stand[] = Object.keys(Stands).map(r => Stands[r as keyof typeof Stands]).filter(s => s.available);
    const percent: number = Util.getRandomInt(0, 100);
    if (userData.stand) {
      await ctx.sendT("items:MYSTERIOUS_ARROW.ALREADY_STAND", {
        components: []
      });
      await Util.wait(2000);
      await ctx.sendT("items:MYSTERIOUS_ARROW.ALREADY_STAND2");
      return false;
    }
    await ctx.client.database.setCooldownCache("action", userData.id, 1);
    await ctx.sendT("items:MYSTERIOUS_ARROW.MANIFESTING", {
      components: []
    });
    await Util.wait(2000);
    await ctx.sendT("items:MYSTERIOUS_ARROW.INVADING");
    await Util.wait(2000);

    let stand: Stand;
    let color: ColorResolvable;
    if (percent <= 4) {
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "S"));
      color = "#2b82ab";
    } else if (percent <= 20) {
      color = "#3b8c4b";
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "A"));
    } else if (percent <= 40) {
      color = "#786d23"
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "B"));
    } else {
      stand = Util.randomArray(StandsArray.filter(r => r.rarity === "C"));
      color = stand.color;
    }
    userData.stand = stand.name;
    await ctx.client.database.saveUserData(userData);
    await ctx.client.database.delCooldownCache("action", userData.id);

    const standCartBuffer = await Util.generateStandCart(stand);
    const file = new MessageAttachment(standCartBuffer, "stand.png");
    const embed: MessageEmbed = new MessageEmbed()
    .setTitle(stand.name)
    .setImage('attachment://stand.png')
    .setColor(color)
    .setDescription(`**Rarity:** ${stand.rarity}
**Abilities [${stand.abilities.length}]:** ${stand.abilities.map(v => v.name).join(", ")}
**Skill-Points:** +${Util.calculateArrayValues(Object.keys(stand.skill_points).map(v => stand.skill_points[v as keyof typeof stand.skill_points]))}:
${Object.keys(stand.skill_points).map(v => "  • +" + stand.skill_points[v as keyof typeof stand.skill_points] + " " + v).join("\n")}
`);


    ctx.makeMessage({
      content: `${stand.emoji} **${stand.name}:** ${stand.text.awaken_text}`,
      files: [file],
      embeds: [embed]
    });
    return true;

  }
};

export const Cola: Item = {
  id: "cola",
  name: "Cola",
  description: "A fresh can of cola",
  rarity: 'C',
  type: "consumable",
  cost: 355,
  tradable: true,
  storable: true,
  usable: true,
  emoji: Emojis.cola,
  benefits: {
    stamina: 35
  }
};

export const Candy: Item = {
  id: "candy",
  name: "Candy",
  description: "A sweet candy",
  rarity: 'C',
  type: "consumable",
  cost: 50,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '🍬',
  benefits: {
    stamina: 5
  }
};

export const Sandwich: Item = {
  id: "sandwich",
  name: "Sandwich",
  description: "A delicious sandwich",
  rarity: 'C',
  type: "consumable",
  cost: 100,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '🥪',
  benefits: {
    stamina: 10,
    health: 10
  }
}

export const Yellow_Hair: Item = {
  id: "yellow_hair",
  name: "Yellow Hair",
  description: "Some mysterious hairs",
  type: "body_part",
  cost: 0,
  tradable: false,
  storable: true,
  usable: false,
  emoji: Emojis.dio,
}

export const Coconut: Item = {
  id: "coconut",
  name: "Coconut",
  description: "A coconut",
  rarity: 'C',
  type: "consumable",
  cost: 300,
  tradable: true,
  storable: false,
  usable: true,
  emoji: "🥥",
  benefits: {
    health: 70,
    stamina: 70
  },
}

export const Ancient_Scroll: Item = {
  id: "ancient_scroll",
  name: "Ancient Scroll",
  description: "An ancient scroll that can be used for crafting",
  rarity: 'B',
  type: "scroll",
  cost: 5000,
  tradable: true,
  storable: true,
  usable: false,
  emoji: '📜'
}

export const Diamond: Item = {
  id: "diamond",
  name: "Diamond",
  description: "A shiny diamond",
  rarity: 'B',
  type: "other",
  cost: 30000,
  tradable: true,
  storable: true,
  usable: false,
  emoji: '💎'
}

export const Burger: Item = {
  id: "burger",
  name: "Burger",
  description: "A yummy burger",
  rarity: 'C',
  type: "consumable",
  cost: 100,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '🍔',
  benefits: {
    health: 70,
    stamina: 15
  }
}

export const Box: Item = {
  id: "box",
  name: "Box",
  description: "A mysterious box",
  rarity: 'B',
  type: "box",
  cost: 5000,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '📦',
  use: async (ctx: CommandInteractionContext, userData: UserData, skip?: boolean, left?: number) => {
    const response: boolean = await UseBox(ctx, userData, 'Box', skip, left);
    return response;
  }
}

export const Money_Box: Item = {
  id: "money_box",
  name: "Money Box",
  description: "A money box",
  rarity: 'A',
  type: "box",
  cost: 20000,
  tradable: true,
  storable: true,
  usable: true,
  emoji: Emojis.moneyBox,
  use: async (ctx: CommandInteractionContext, userData: UserData, skip?: boolean, left?: number) => {
    const response: boolean = await UseBox(ctx, userData, 'Money Box', skip, left);
    return response;
  }
}

const UseBox = async (ctx: CommandInteractionContext, userData: UserData, box: string, skip?: boolean, left?: number): Promise<boolean> => {
  ctx.client.database.setCooldownCache("action", userData.id, 1);
  const win: Array<any> = [];
  let win_content: string = "";
  let superator = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
  const common_items = Object.keys(Items).filter(v => Items[v as keyof typeof Items].rarity === "C" && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'box' && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'disc');
  const mid_items = Object.keys(Items).filter(v => Items[v as keyof typeof Items].rarity === "B" && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'box' && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'disc');
  const rare_items = Object.keys(Items).filter(v => Items[v as keyof typeof Items].rarity === "A" && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'box');
  const epic_items = Object.keys(Items).filter(v => Items[v as keyof typeof Items].rarity === "S" && Items[v as keyof typeof Items].storable && Items[v as keyof typeof Items].type !== 'box');
  let emoji: { emoji?: string, shaking?: string } = {};
  if (box.toLowerCase().startsWith("money")) {
    superator = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"
    win.push(`coins:${Util.getRandomInt(20000, 50000)}`);
    emoji = {
      shaking: "<a:money_box_shaking:962388845540823100>",
      emoji: Emojis.moneyBox
    }
  } else {
    emoji = {
      shaking: Emojis.box_shaking,
      emoji: `📦`
    }
    win.push(`coins:${Util.getRandomInt(500, 3000)}`)
    win.push(`xp:${Util.getRandomInt(50, 400)}`);
    for (let i = 0; i < 10; i++) {
      if (Util.randomArray([true, false])) {
          win.push(Util.randomArray(common_items))
      }
    }
  if (Util.getRandomInt(0, 100) >= 50) {
      win.push(Util.randomArray(mid_items))
      for (let i = 0; i < 3; i++) {
          if (Util.randomArray([true, false])) {
              win.push(Util.randomArray(mid_items))
          }
      }
    }
    if (Util.getRandomInt(0, 10) === 1) {
      win.push(Util.randomArray(rare_items))
      for (let i = 0; i < 2; i++) {
          if (Util.randomArray([true, false])) {
              win.push(Util.randomArray(rare_items))
          }
      }
    }

  }
  const unitems = [...new Set(win)];
  for (let i = 0; i < unitems.length; i++) {
      const item_value = win[i];
      if (!item_value.startsWith("xp") && !item_value.startsWith("coins")) {
          const item = Items[item_value as keyof typeof Items];
          if (item && !win_content.includes(item.name)) {
              win_content += `+ **${win.filter(r => r === item_value).length}** ${item.emoji} ${item.name}\n`;
              userData.items.push(item_value);
          }
      } else {
          let togive: string = item_value.startsWith("xp") ? "xp" : "coins";
          let emoji = item_value.startsWith("xp") ? Emojis.xp : Emojis.jocoins;
          win_content += `+ **${Util.localeNumber(Number(item_value.split(":")[1]))}** ${emoji} ${item_value.split(":")[0].toUpperCase().replace("COINS", "coins")}\n`;
          if (emoji === Emojis.xp) win_content+=superator+"\n";
          // @ts-expect-error
          userData[togive as keyof typeof userData] = Number(item_value.split(":")[1]) + Number(userData[togive as keyof typeof userData]);
      }
  }
  await ctx.makeMessage({ content: `${emoji.shaking} Your ${box.split("_").map(v => Util.capitalize(v)).join(" ")} is shaking...`, components: [] });
  await Util.wait(3000);
  let content = `▬▬▬▬▬「${emoji.emoji} **${box.split("_").map(v => v.toUpperCase()).join(" ")}**」▬▬▬▬▬▬\n`;
  await ctx.makeMessage({ content: content });
  if (skip) await Util.wait(1000);
  for (const cn of win_content.split("\n")) {
      if (!skip) await Util.wait(900);
      if (cn.length === 0) content += superator
      else content+=cn+"\n";
      if (!skip) await ctx.makeMessage({ content: content })
  }
  if (skip) await ctx.makeMessage({ content: content });
  if (skip) {
    if (left <= 1) ctx.client.database.delCooldownCache("action", userData.id);
  } else ctx.client.database.delCooldownCache("action", userData.id);
  return true;
}

export const Athletic_Shoe: Item = {
  id: "athletic_shoe",
  name: "Athletic Shoe",
  description: "A shoe that can be used for running (and maybe crafting?)",
  type: "cloth",
  cost: 5000,
  tradable: true,
  storable: true,
  usable: false,
  emoji: '👟',
  cloth_bonuses: {
    stamina: 10
  }
}

export const Chocolate_Bar: Item = {
  id: "chocolate_bar",
  name: "Chocolate Bar",
  description: "A chocolate bar",
  type: "consumable",
  cost: 115,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '🍫',
  benefits: {
    stamina: 10
  }
}

export const Dead_Rat: Item = {
  id: "dead_rat",
  name: "Dead Rat",
  description: "A dead rat",
  type: "consumable",
  cost: 5,
  tradable: true,
  storable: true,
  usable: true,
  emoji: '🐀',
  benefits: {
    health: -500,
    stamina: -500
  }
}

export const Jotaro_Hat: Item = {
  id: "jotaro_hat",
  name: "Jotaro's Hat",
  description: "Jotaro's lost hat",
  type: "cloth",
  cost: 5000000,
  tradable: true,
  storable: true,
  usable: false,
  emoji: Emojis.jotaroHat,
  cloth_bonuses: {
    health: 500,
    stamina: 500
  }
}

export const Ramen_Bowl: Item = {
  id: "ramen_bowl",
  name: "Ramen Bowl",
  description: "A bowl of ramen",
  type: "consumable",
  cost: 1500,
  tradable: false,
  storable: false,
  usable: true,
  emoji: '🍜',
  benefits: {
    health: 170,
    stamina: 100
  }
}

export const Requiem_Arrow: Item = {
  id: "requiem_arrow",
  name: "Requiem Arrow",
  description: "Requiem wo... ONE WORLD!",
  type: "other",
  cost: 99999999,
  tradable: true,
  storable: false,
  usable: false,
  emoji: Emojis.requiem_arrow
}

