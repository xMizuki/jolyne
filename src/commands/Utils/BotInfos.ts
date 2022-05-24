import type { SlashCommand, UserData } from '../../@types';
import { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, MessageComponentInteraction, MessageAttachment } from 'discord.js';
import InteractionCommandContext from '../../structures/Interaction';
import { localeNumber } from '../../utils/functions';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

export const name: SlashCommand["name"] = "infos";
export const category: SlashCommand["category"] = "others";
export const cooldown: SlashCommand["cooldown"] = 10;
export const data: SlashCommand["data"] = {
    name: "infos",
    description: "🤖 Show my informations.",
    options: []
};

const width = 800;
const height = 300;
const ticksOptions = [{
    ticks: {
        fontColor: "white",
        fontStyle: "bold"
    }
}];
const options = {
    legend: {
        display: false
    },
    scales: {
        yAxes: ticksOptions,
        xAxes: ticksOptions
    }
};
const isSameDay: Function = (firstDate: Date, secondDate: Date) => {
    return `${firstDate.getDate()}|${firstDate.getMonth()}|${firstDate.getFullYear()}` === `${secondDate.getDate()}|${secondDate.getMonth()}|${secondDate.getFullYear()}`;
};
const generateCanvas = async (joinedXDays: any[], lastXDays: any[]) => {
    const canvasRenderService = new ChartJSNodeCanvas({
        width,
        height
    });
    const image = await canvasRenderService.renderToBuffer({
        type: "line",
        data: {
            labels: lastXDays,
            datasets: [{
                label: "Players",
                data: joinedXDays,
                borderColor: "rgb(112, 146, 108)",
                fill: true,
                backgroundColor: "rgba(150, 219, 150, 0.11)"
            }]
        },
        options
    });
    const attachment = new MessageAttachment(image, "image.png");
    return attachment;
};
const joinedXDayss = async (numberOfDays: number, members: any[]) => {
    const days: number[] = [];
    let lastDate = 0;
    members = members.sort((a: UserData, b: UserData) => b.adventureat - a.adventureat);
    for (let i = 0; i < numberOfDays; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        for (const member of members) {
            const joinedDate = new Date(Number(member.adventureat));
            if (isSameDay(joinedDate, date)) {
                if (lastDate !== joinedDate.getDate()) {
                    lastDate = joinedDate.getDate();
                    days.push(1);
                } else {
                    let currentDay = days.pop();
                    days.push(++currentDay);
                }
            }
        }
        if (days.length < i) days.push(0);
    }
    return days.reverse();
};
const lastXDayss = (numberOfDays: number, monthIndex: any[]) => {
    const days = [];
    for (let i = 0; i < numberOfDays; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        let day: string | number = date.getDate();
        const month = monthIndex[date.getMonth()];
        if (day < 10) day = `0${day}`;
        days.push(`${day} ${month}`);
    }
    return days.reverse();
};


export const execute: SlashCommand["execute"] = async (ctx: InteractionCommandContext, userData?: UserData) => {
    await ctx.defer();
    const numberOfDays = 30;

    const userss = await ctx.client.database.redis.client.keys("*cachedUser*");
    let user = [];
    for (const u of userss) {
        const cachedUser: UserData = JSON.parse(await ctx.client.database.redis.client.get(u));
        if (cachedUser.adventureat) user.push(cachedUser);
    }
    user = user.sort((a: UserData, b: UserData) => b.adventureat - a.adventureat);
    let days: {
        count: number,
        date: `${number} ${string}`
    }[] = [];
    const m: any = ctx.translate("base:SMALL_MONTHS", {
        returnObjects: true
    });
    for (const u of user) {
        const date = new Date(u.adventureat);
        const day = date.getDate();
        const month = m[date.getMonth()];
        let dayIndex = days.find(r => r.date === `${day} ${month}`);
        if (!dayIndex) days.push({
            count: 0,
            date: `${day} ${month}`
        });
        dayIndex = days.find(r => r.date === `${day} ${month}`);
        dayIndex.count++;
        days = days.map(v => {
            if (v.date === `${day} ${month}`) v = dayIndex;
            return v;
        });
    }
    days = days.reverse();
    const joinedXDays = await joinedXDayss(numberOfDays, user);
    const lastXDays = lastXDayss(numberOfDays, m);
    lastXDays.length = lastXDays.length - 1;
    const attachment = await generateCanvas(joinedXDays, lastXDays);

    const clusterPromises = await Promise.all([
        ctx.client.cluster.broadcastEval('this.guilds.cache.size'),
        ctx.client.cluster.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0)'),
        ctx.client.cluster.broadcastEval('Number(Number(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))')
    ]);
    const guilds = clusterPromises[0].reduce((acc, guild) => acc + guild, 0);
    const members = clusterPromises[1].reduce((acc, member) => acc + member, 0);
    const memory = clusterPromises[2].reduce((acc, mem) => acc + mem, 0);

    return ctx.interaction.editReply({
        files: [attachment],
        embeds: [{
            author: {
                name: ctx.client.user.tag,
                iconURL: ctx.client.user.displayAvatarURL()
            },
            fields: [{
                    name: ctx.translate("infos:USERS"),
                    value: localeNumber(members),
                    inline: true
                },
                {
                    name: ctx.translate("infos:SERVERS"),
                    value: localeNumber(guilds),
                    inline: true
                },
                {
                    name: ctx.translate("infos:UPTIME"),
                    value: ctx.convertMs(ctx.client.uptime),
                    inline: true

                },
                {
                    name: ctx.translate("infos:LIBRARY"),
                    value: "Discord.JS",
                    inline: true
                },
                {
                    name: ctx.translate("infos:PLAYERS") + " (RPG)",
                    value: localeNumber((await ctx.client.database.redis.client.keys("*jjba:user:*")).length),
                    inline: true
                },
                {
                    name: ctx.translate("infos:RAM_USAGE"),
                    value: `${(memory).toFixed(2)}mb / 7978.38mb (${((process.memoryUsage().heapUsed / 1024 / 1024)/7978.38*100).toFixed(2)}%)`,
                    inline: true
                },
                {
                    name: ctx.translate("infos:CREATOR"),
                    value: "Mizuki#2477",
                    inline: true
                },
                {
                    name: ctx.translate("infos:SUPPORT_INVITE"),
                    value: "[discord.gg/9a2HYsum2v](https://discord.gg/9a2HYsum2v)",
                    inline: true
                },
                {
                    name: ctx.translate("infos:NEW_PLAYERS"),
                    value: ctx.translate("infos:NEW_PLAYERS_VALUE", {
                        new: user.filter(r => new Date(r.adventureat).getUTCDate() === new Date().getUTCDate()).length,
                    })
                }

            ],
            footer: {
                text: `Cluster #${ctx.client.cluster.id} | Shard #${ctx.interaction.guild.shardId}`
            },
            color: "#70926c",
            image: {
                url: 'attachment://image.png',
            },
        }]
    });


};

