import type { SlashCommand, command } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, ColorResolvable } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import * as Util from '../../utils/functions';
import AniListAPI from '../../utils/AniListAPI';
import TurndownService from 'turndown';

const turndownService = new TurndownService();
turndownService.addRule('strikethrough', {
    // @ts-ignore
    filter: "span class='markdown_spoiler",
    replacement: function (content) {
        return '||' + content + '||'
}
})

const query = `
query ($search: String) {
    Character(search: $search) {
        id
        siteUrl
        name {
            first
            last
        }
        image {
            large
        }
        description(asHtml: true)
    }
}
`;

export const name: SlashCommand["name"] = "character";
export const category: SlashCommand["category"] = "utils";
export const cooldown: SlashCommand["cooldown"] = 5;
export const examples: SlashCommand["examples"] = ["`character:` Jotaro Kujo"];
export const data: SlashCommand["data"] = {
    name: 'character',
    description: 'Display informations about a specified anime character',
    options: [
        {
            type: 3,
            name: 'character',
            description: 'The name of the character you want to get information about',
            required: true
        }
    ],
};

export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext) => {
    // ctx.interaction.deferReply().catch(() => {}); // eslint-disable-line no-useless-catch

    const shorten = (str: string) => turndownService.turndown(str.replace(/<span[^>]*>/g, "|").replace(/<\/span[^>]*>/g, "|"));
    const character = ctx.interaction.options.getString('character');
    const response = await AniListAPI(query, {
        search: character
    });

    if (response.error) return ctx.sendT('base:NO_RESULTS');

    const data = response.Character as AnilistCharacter;
    
    let name = data.name.first;
    if (data.name.last != null) {
        name += ` ${data.name.last}`;
    };
    const color = await Util.getImageColor(ctx.client, data.image.large);
    let content = shorten(data.description).match(/(.{1,2045})/g);

    for (let i = 0; i < content.length; i++) {
        if (content[i].startsWith('||') && !content[i].endsWith('||')) {
            content[i] += '||';
        }
        if (!content[i].startsWith('||') && content[i].endsWith('||')) {
            content[i] = '||' + content[i];
        }
    }

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
            .setTitle(name)
            .setURL(data.siteUrl)
            .setDescription(content[embedPage - 1])
            .setThumbnail(data.image.large)
            .setColor(color)
        if (content.length !== 1) {
            embed.setFooter({ text: `Page ${embedPage}/${content.length}`});
            components.push(Util.actionRow([ backBTN, nextBTN ]));
        }
        ctx.makeMessage({
            embeds: [embed],
            components
        });
    }

    sendPage();
    if (content.length === 1) return;

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
            if (embedPage === content.length) return;
            embedPage++;
            if (embedPage > content.length) embedPage = content.length;
        }
        sendPage();
    });



        


};

interface AnilistCharacter {
    id: number;
    siteUrl: string;
    name: {
        first: string;
        last?: string;
    };
    image: {
        large: string;
    };
    description: string;
}