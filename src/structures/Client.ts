import type { SlashCommand, command } from '../@types';
import { Client, Collection, ClientOptions } from 'discord.js-light';
import { REST } from '@discordjs/rest';
import emojis from '../emojis.json';
import log from '../utils/logger';
import database from '../database';
import Cluster from 'discord-hybrid-sharding';

export default class Jolyne extends Client {
    _ready: boolean;
    _emojis: object = emojis;
    _rest: REST;
    commands: Collection<string, SlashCommand> = new Collection();
    cooldowns: Collection<string, any> = new Collection();
    log: Function;
    database: database;
    translations: Map<any, Function>;
    cluster: Cluster.Client;

    constructor(options?: ClientOptions) {
      super(options);
      this._ready = false;
      this.log = log;
      this.database = new database(this);
      this._rest = new REST({
        version: '9'
      }).setToken(process.env.CLIENT_TOKEN);
      this.cluster = new Cluster.Client(this); 
    }
}