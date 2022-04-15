import type { SlashCommand, Interaction, command, UserData } from '../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction } from 'discord.js';

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
}

export const execute: SlashCommand["execute"] = async (interaction: Interaction) => {
    const commands = interaction.client.commands.filter((r: command) => r.category !== "owner").map((v: command) => {
        if (v.data?.options.length !== 0 && v.data.options.filter((r: { choices: any; }) => !r.choices).filter((r: { type: number; }) => r.type !== 3).filter((r: { type: number; }) => r.type !== 6).filter((r: { type: number; }) => r.type !== 4).length !== 0) {
            return v.data.options.map((c: { name: any; description: any; }) => {
                return {
                    cooldown: v.cooldown,
                    category: v.category,
                    options: v.data?.options.filter((r: { name: any; }) => r.name === c.name)[0].options,
                    name: `${v.name} ${c.name}`,
                    description: removeEmoji(c.description)
                }
            })
        } else return {
            cooldown: v.cooldown,
            category: v.category,
            options: v.data?.options?.filter((r: { type: number; }) => r.type === 3 || r.type === 6 || r.type === 4),
            name: v.name,
            description: removeEmoji(v.data.description)
        }
    }).map(v => {
        if (v instanceof Array) {
            return v.map(v => {
                return {
                    cooldown: v.cooldown,
                    category: v.category,
                    options: v.options,
                    name: v.name,
                    description: v.description
                }
            })
        } else return {
            cooldown: v.cooldown,
            category: v.category,
            options: v.options,
            name: v.name,
            description: v.description
        }
    });
    if (interaction.options.getString("command")) {
        const command:any = commands.filter((r: any) => r.name === interaction.options.getString("command"))[0];
        if (!command) interaction.reply(`Command not found`);

        const embed = new MessageEmbed().addField("Description", command.description);
        
        if (command.options && command.options.length !== 0) embed.addField("Usage", `/${command.name} ` + command.options.map((v: command) => `\`${v.required ? `<${v.name}>` : `[${v.name}]`}\``).join(", ") + "\n" + command.options.map((v: command) => `> \`${v.name}:\` ${v.description}`).join("\n"))
        if (command.examples) embed.addField("Examples", command.examples.map((v: string) => `/${command.name} ${v}`).join("\n"))
        if (command.cooldown) embed.addField("Cooldown", !isNaN(command.cooldown) ? command.cooldown + " seconds" : command.cooldown);
        embed.setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({
            dynamic: true
        })})
        embed.setTitle(`Command: ${command.name}`)
        embed.setColor("#70926c")
        embed.setTimestamp()
        return interaction.reply({
            embeds: [embed]
        });
    } else {
        const category_selector = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId(interaction.id)
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
            .setCustomId(interaction.id+"_back")	
            .setEmoji('◀️')
            .setStyle("SECONDARY")
        );
        await interaction.reply({ embeds: [{
            author: {
                name: "Jolyne Help",
                icon_url: interaction.client.user.displayAvatarURL()
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


        const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id && i.customId.startsWith(interaction.id);
        const collector = interaction.channel.createMessageComponentCollector({ filter });

        let collectorTimeout = setTimeout(async () => {
            let component = category_selector.toJSON();
            component.components[0].disabled = true;
            interaction.editReply({ components: [new MessageActionRow(component)] });
            collector.stop();
        }, 120000);

        collector.on('collect', async (i: any) => { // i = any cuz i.values doesnt existe on msgcomponentint like what the hell
            // UPDATE COLLECTOR TIMEOUT
            clearTimeout(collectorTimeout);
            collectorTimeout = setTimeout(async () => {
                let component = category_selector.toJSON();
                component.components[0].disabled = true;
                interaction.editReply({ components: [new MessageActionRow(component)] });
                collector.stop();
            }, 120000);

            // CHECKERS
            if (i.customId === interaction.id+"_back") {
                await interaction.editReply({ embeds: [{
                    author: {
                        name: "Jolyne Help",
                        icon_url: interaction.client.user.displayAvatarURL()
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
            if (i.customId === interaction.id) {
                let category: string = i.values[0];
                let description: Array<any> = [];
                let cmds: Array<any> = [];
                if (category === 'adventure') {
                    cmds = commands.filter((r: any) => r.category === 'adventure');

                    } else if (category === 'others') {
                        cmds = commands.filter((r: any) => r.category !== 'adventure');
                    }
                for (const cmd of cmds) {
                    description.push(`\`/${cmd.name}\`: ${cmd.description ?? "none"}`);
                }
                interaction.editReply({ components: [category_selector, go_back_button], embeds: [{
                    author: {
                        name: `${capitalize(category)} Commands`,
                        icon_url: interaction.client.user.displayAvatarURL()
                    },
                    description: description.join("\n"),
                    color: "#70926c"
                }]})
            }
            i.deferUpdate().catch(() => { });
        });
    

    }
}

function removeEmoji(string: string) {
    return string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g, "").replace(/🪙/gi, "").replace(/🔎/gi, "").replace(/📧/gi, "").replace(/⭐/gi, "").trim();
}

interface String {
    capitalize: () => string;
}

const capitalize = function(x: string) {
    return x.charAt(0).toUpperCase() + x.slice(1);
}