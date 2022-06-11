// Outdated code, need to optimize it. IK it's really ugly.
import type { SlashCommand, command } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, SelectMenuInteraction } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';

export const name: SlashCommand["name"] = "help";
export const category: SlashCommand["category"] = "utils";
export const cooldown: SlashCommand["cooldown"] = 5;
export const examples: SlashCommand["examples"] = ["`command:` help"];
export const data: SlashCommand["data"] = {
    name: 'help',
    description: 'Shows the help menu',
    options: [
        {
            type: 3,
            name: 'command',
            description: 'The command you want to know more about',
            required: false
        }
    ],
};

export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext) => {
    const allCommands: any = ctx.client.commands.filter((r: SlashCommand) => r.category !== "owner").map((v: SlashCommand) => {
        if (v.data?.options?.length !== 0 && v.data.options instanceof Array && v.data.options.filter((r: any) => !r.choices).filter((r: any) => r.type !== 3).filter((r: any) => r.type !== 6).filter((r: any) => r.type !== 4).length !== 0) {
            return v.data.options.map((c: any) => {
                return {
                    cooldown: v.cooldown,
                    category: v.category,
                    options: v.data?.options?.filter((r: any) => r.name === c.name)[0]?.options,
                    name: `${v.name} ${c.name}`,
                    description: removeEmoji(c.description)
                };
            });
        } else return {
            cooldown: v.cooldown,
            category: v.category,
            options: v.data?.options?.filter((r: any) => r.type === 3 || r.type === 6 || r.type === 4),
            name: v.name,
            description: removeEmoji(v.data.description)
        };
    }).map(v => {
        if (v instanceof Array) {
            return v.map(v => {
                return {
                    cooldown: v.cooldown,
                    category: v.category,
                    options: v.options,
                    name: v.name,
                    description: v.description
                };
            });
        } else return {
            cooldown: v.cooldown,
            category: v.category,
            options: v.options,
            name: v.name,
            description: v.description
        };
    });
    const commands: command[] = [];
    for (const command of allCommands) {
        if (command instanceof Array) {
            for (const commandx of command) {
                commands.push(commandx);
            }
        } else commands.push(command);
    }

    if (ctx.interaction.options.getString("command")) {
        const command: command = commands.filter((r: any) => r.name.toLowerCase().includes(ctx.interaction.options.getString("command")))[0];
        if (!command) ctx.interaction.reply(`Command not found`);

        const embed = new MessageEmbed().addField("Description", command.description);
        
        if (command.options && command.options.length !== 0) embed.addField("Usage", `/${command.name} ` + command.options.map((v: any) => `\`${v.required ? `<${v.name}>` : `[${v.name}]`}\``).join(", ") + "\n" + command.options.map((v: any) => `> \`${v.name}:\` ${v.description}`).join("\n"));
        if (command.examples) embed.addField("Examples", command.examples.map((v: string) => `/${command.name} ${v}`).join("\n"));
        if (command.cooldown) embed.addField("Cooldown", typeof command.cooldown === "number" ? command.cooldown + " seconds" : command.cooldown);
        embed.setAuthor({name: ctx.interaction.user.tag, iconURL: ctx.interaction.user.displayAvatarURL({
            dynamic: true
        })});
        embed.setTitle(`Command: ${command.name}`);
        embed.setColor("#70926c");
        embed.setTimestamp();
        return ctx.interaction.reply({
            embeds: [embed]
        });
    } else {
        const category_selector = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId(ctx.interaction.id)
            .setPlaceholder('Select a category.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([{
                    label: 'RPG Commands',
                    value: 'adventure',
                    emoji: "927885909976834078"
                },
                {
                    label: 'General Commands',
                    value: 'others',
                    emoji: "ℹ️",
                }
            ]),
        );
        const go_back_button = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId(ctx.interaction.id+"_back")	
            .setEmoji('◀️')
            .setStyle("SECONDARY")
        );
        await ctx.interaction.reply({ embeds: [{
            author: {
                name: "Jolyne Help",
                icon_url: ctx.client.user.displayAvatarURL()
            },
            description: `Hello there ! I'm Jolyne, an RPG JJBA bot\nYou can use me to do a lot of things, but I'm not perfect yet.\nIf you need more information on a specified command, use\n\`/help command: [command]\` or check every commands with all its information [here](https://www.jolyne.wtf/commands).`,
            color: "#70926c",
            fields: [
                {
                    name: "Links",
                    value: ":bookmark: • [RPG Guide](https://jolyne.wtf/docs)\n:desktop: • [Website](https://jolyne.wtf)\n:information_source: • [Support Server](https://www.jolyne.wtf/discord)"
                }
            ]

        }], components: [category_selector] });


        const filter = (i: MessageComponentInteraction) => i.user.id === ctx.interaction.user.id && i.customId.startsWith(ctx.interaction.id);
        const collector = ctx.interaction.channel.createMessageComponentCollector({ filter });
        ctx.timeoutCollector(collector);

        collector.on('collect', async (i: SelectMenuInteraction) => { // i = any cuz i.values doesnt existe on msgcomponentint like what the hell
            ctx.timeoutCollector(collector);

            // CHECKERS
            if (i.customId === ctx.interaction.id+"_back") {
                await ctx.interaction.editReply({ embeds: [{
                    author: {
                        name: "Jolyne Help",
                        icon_url: ctx.client.user.displayAvatarURL()
                    },
                    description: `Hello there ! I'm Jolyne, an RPG JJBA bot\nYou can use me to do a lot of things, but I'm not perfect yet.\nIf you need more information on a specified command, use\n\`/help command: [command]\` or check every commands with all its information [here](https://www.jolyne.wtf/commands).`,
                    color: "#70926c",
                    fields: [
                        {
                            name: "Links",
                            value: ":bookmark: • [RPG Guide](https://jolyne.wtf/docs)\n:desktop: • [Website](https://jolyne.wtf)\n:information_source: • [Support Server](https://www.jolyne.wtf/discord)"
                        }
                    ]
        
                }], components: [category_selector] });        
            } else
            if (i.customId === ctx.interaction.id) {
                const category: string = i.values[0];
                const description: Array<any> = [];
                let cmds: Array<any> = [];
                if (category === 'adventure') {
                    cmds = commands.filter((r: any) => r.category === 'adventure');

                    } else if (category === 'others') {
                        cmds = commands.filter((r: any) => r.category !== 'adventure');
                    }
                for (const cmd of cmds) {
                    description.push(`\`/${cmd.name}\`: ${cmd.description ?? "none"}`);
                }
                ctx.interaction.editReply({ components: [category_selector, go_back_button], embeds: [{
                    author: {
                        name: `${capitalize(category)} Commands`,
                        icon_url: ctx.client.user.displayAvatarURL()
                    },
                    description: description.join("\n"),
                    color: "#70926c"
                }]});
            }
            i.deferUpdate().catch(() => { return; });
        });
    

    }
};

function removeEmoji(string: string) {
    return string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g, "").replace(/🪙/gi, "").replace(/🔎/gi, "").replace(/📧/gi, "").replace(/⭐/gi, "").trim();
}

const capitalize = function(x: string) {
    return x.charAt(0).toUpperCase() + x.slice(1);
};
