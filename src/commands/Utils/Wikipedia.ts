import type { SlashCommand, command } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import fetch from 'node-fetch';
import wiki from 'wikijs';
import * as Util from '../../utils/functions';

export const name: SlashCommand["name"] = "wikipedia";
export const category: SlashCommand["category"] = "utils";
export const cooldown: SlashCommand["cooldown"] = 5;
export const examples: SlashCommand["examples"] = ["`command:` help"];
export const data: SlashCommand["data"] = {
    name: 'wikipedia',
    description: 'Search for a Wikipedia article',
    options: [
        {
            type: 3,
            name: 'query',
            description: 'What would you like to search in wikipedia?',
            required: true
        }, {
            type: 3,
            name: 'language',
            description: 'The language you want to search in (default: en)',
            required: false,
            choices: [
                {
                    name: 'English',
                    value: 'en'
                }, {
                    name: 'Español',
                    value: 'es'
                }, {
                    name: 'Français',
                    value: 'fr'
                }, {
                    name: 'Deutsch',
                    value: 'de'
                }, {
                    name: 'Italiano',
                    value: 'it'
                }, {
                    name: 'Português',
                    value: 'pt'
                }, {
                    name: '日本語',
                    value: 'ja'
                }, {
                    name: '한국어',
                    value: 'ko'
                }, {
                    name: '中文',
                    value: 'zh'
                }, {
                    name: 'Русский',
                    value: 'ru'
                }, {
                    name: 'Українська',
                    value: 'uk'
                }, {
                    name: 'Türkçe',
                    value: 'tr'
                }, {
                    name: 'Nederlands',
                    value: 'nl'
                }, {
                    name: 'Polski',
                    value: 'pl'
                }, {
                    name: 'Svenska',
                    value: 'sv'
                }, {
                    name: 'Dansk',
                    value: 'da'
                }, {
                    name: 'Slovenčina',
                    value: 'sk'
                }, {
                    name: 'Suomi',
                    value: 'fi'
                }, {
                    name: 'Norsk',
                    value: 'no'
                }
            ]
        }
    ],
};

const cache: { [key: string]: any } = {};

export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext) => {
    ctx.interaction.deferReply().catch(() => {}); // eslint-disable-line no-useless-catch
    const language = ctx.interaction.options.getString("language") || "en";
    const query = ctx.interaction.options.getString("query");
    const apiUrl = `https://${language}.wikipedia.org/w/api.php`
    const apiQuery = `${apiUrl}?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&format=json&pithumbsize=100&list=search&srsearch=${encodeURIComponent(query)}`;

    const response = await fetch(apiQuery);
    const json = await response.json() as WikipediaResult;
    if (!json || !json.query?.search[0]) return ctx.sendT('base:NO_RESULTS');

    const page = json.query.search[0];
    // We're using wikijs to get the page content because it's better.
    const wikiPage = await wiki({ apiUrl }).page(page.title);

    const content = (await wikiPage.rawContent()).match(/(.{1,2045})/g);
    let color: ColorResolvable = (await ctx.client.database.redis.client.get(`color_${page.title}`)) as ColorResolvable;
    if (!color) {
        const randomHex =  [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        color = `#${randomHex}`;
        ctx.client.database.redis.client.set(`color_${page.title}`, color);
    };
    let fixedContent = content;
    for (let i = 0; i < content.length; i++) {
        if (fixedContent[i].startsWith('==')) {
            if (fixedContent[i + 1]) {
                fixedContent[i + 1] = fixedContent[i] + "\n\n" + fixedContent[i + 1];
                fixedContent[i] = null;
                i++;
            }
        }
    }
    fixedContent = fixedContent.filter(x => x);
    
    let embedPage = 1;

    const backID = Util.generateID();
    const nextID = Util.generateID();

    const backBTN = new MessageButton()
        .setEmoji('◀')
        .setStyle('SECONDARY')
        .setCustomId(backID);
    const nextBTN = new MessageButton()
        .setEmoji('▶')
        .setStyle('SECONDARY')
        .setCustomId(nextID);


    function sendPage() {
        const components: MessageActionRow[] = [];
        const embed = new MessageEmbed()
            .setTitle(page.title)
            .setURL(`https://${language}.wikipedia.org/wiki/${encodeURIComponent(page.title)}`)
            .setDescription(fixedContent[embedPage - 1])
            .setThumbnail(json.query.pages[page.pageid]?.thumbnail?.source)
            .setColor(color)
        if (fixedContent.length !== 1) {
            embed.setFooter({ text: `Page ${embedPage}/${fixedContent.length}`});
            components.push(Util.actionRow([ backBTN, nextBTN ]));
        }
        ctx.makeMessage({
            embeds: [embed],
            components
        });
    }

    sendPage();
    if (fixedContent.length === 1) return;
    
    const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate().catch(() => { }); // eslint-disable-line @typescript-eslint/no-empty-function
        return (i.customId === backID || i.customId === nextID) && i.user.id === ctx.author.id;
    }
    const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
    ctx.timeoutCollector(collector, 120000);

    collector.on('collect', (i: MessageComponentInteraction) => {
        ctx.timeoutCollector(collector, 120000);
        if (i.customId === backID) {
            if (embedPage === 1) return;
            embedPage--;
            if (embedPage < 1) embedPage = 1;
        } else if (i.customId === nextID) {
            if (embedPage === fixedContent.length) return;
            embedPage++;
            if (embedPage > fixedContent.length) embedPage = fixedContent.length;
        }
        sendPage();
    });


};

interface WikipediaResult {
    query: {
        searchinfo: {
            totalhits: string
        },
        search: {
            ns: number,
            title: string,
            pageid: number,
            size: number,
            wordcount: number,
            snippet: string,
            timestamp: string
        }[],
        pages: {
            [key: number]: {
                thumbnail: {
                    source: string
                }
            }
        }
    }
}