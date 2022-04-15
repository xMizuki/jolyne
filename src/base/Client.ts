import { Client, Collection, ClientOptions } from 'discord.js';
import emojis from '../emojis.json';
import log from '../utils/logger';
import database from '../database';
import * as Functions from '../utils/functions'

export default class Jolyne extends Client {
    _ready: boolean = false;
    _emojis: object = emojis;
    collection: Collection<string, any>;
    commands: Collection<string, any> = new Collection();
    cooldowns: Collection<string, any>;
    cache: Collection<string, any>;
    log: object;
    database: database;
    translations: Map<any, Function>;
    functions: object;

    constructor(options?: ClientOptions) {
      super(options);
      this.cache = new Collection();
      this.cooldowns = new Collection();
      this.log = log;
      this.database = new database(this);
      this.functions = Functions;
    }
}