import Client from '../base/Client';
import type { Event } from '../@types';

export const name: Event["name"] = "ready";
export const once: Event["once"] = true;

export const execute: Event["execute"] = (client: Client) => {
    client._ready = true;
    client.log(`Ready! Logged in as ${client.user.tag} (${client.user.id})`);
}