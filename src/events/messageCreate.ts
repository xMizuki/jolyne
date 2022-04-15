import type { Event } from '../@types';
import { Message } from 'discord.js'

export const name: Event["name"] = "messageCreate";
export const execute: Event["execute"] = async (message: Message) => {
    const { client } = message;
    const ownerIds = process.env.OWNER_IDS.split(',');
    const args = message.content.slice("j!".length).split(/ +/);
    let commandName = args.shift().toLowerCase();

    if (ownerIds.includes(message.author.id)) {
        if (commandName === "eval") {
            let content = args.join(" ");
            const result = new Promise((resolve) => resolve(eval(content)));
    
            return result.then((output: any) => {
                if (typeof output !== `string`) {
                    output = require(`util`).inspect(output, {
                        depth: 0
                    });
                }
                if (output.includes(client.token)) {
                    output = output.replace(new RegExp(client.token, "gi"), `T0K3N`);
                }
                try {
                    message.channel.send(`\`\`\`\js\n${output}\n\`\`\``);
                } catch (e) {
                    console.error(e)
                }
            }).catch((err) => {
                console.error(err)
                err = err.toString();
                if (err.includes(client.token)) {
                    err = err.replace(new RegExp(client.token, "gi"), `T0K3N`);
                }
                try {
                    message.channel.send(`\`\`\`\js\n${err}\n\`\`\``);
                } catch (e) {
                    console.error(e)
                }
    
            }); 
        } 
    }
    
}