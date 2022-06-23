import type { Shop } from '../../@types';
import * as Emojis from '../../emojis.json';
import * as Items from './Items';

export const Tonio_Trussardis_Restaurant: Shop = {
    name: 'Tonio Trussardi\'s Restaurant',
    items: [
        Items.Spaghetti_Bowl,
        Items.Salad_Bowl,
        Items.Ramen_Bowl,
        Items.Pizza,
    ],
    emoji: Emojis.Tonio_Trussardi,
    color: 'ORANGE'
}

export const Grocery_Store: Shop = {
    name: 'Grocery Store',
    items: [
        Items.Cola,
        Items.Candy,
        Items.Chocolate_Bar,
        Items.Sandwich
    ],
    emoji: '🏪',
    color: 'BLUE'
}

/*
export const Black_Market: Shop = {
    name: 'Black Market',
    items: [
        Items["Mysterious_Arrow"],
        Items.Skill_Points_Reset_Potion,
    ],
    emoji: '🃏',
    color: 'NOT_QUITE_BLACK'
}
*/