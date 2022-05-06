import InteractionCommandContext from '../../structures/Interaction';
import * as Quests from './Quests';
import * as Util from '../../utils/functions';
import type { UserData, Quest } from '../../@types';

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

export const remove_thing_kakyoin = async (ctx: InteractionCommandContext, userData: UserData) => {
    const baseText = ctx.translate("action:REMOVE_THING_KAKYOIN");
    const failedText = ctx.translate("action:REMOVE_THING_KAKYOIN_FAILED");
    const successText = ctx.translate("action:REMOVE_THING_KAKYOIN_SUCCESS");

    ctx.client.database.setCooldownCache("cooldown", userData.id);

    await ctx.makeMessage({
        content: baseText,
        components: []
    });
    await wait(3000);

    if (Util.getRandomInt(1, 3) === 2) {
        await ctx.makeMessage({
            content: baseText + " " + failedText,
            components: []
        });
        userData.chapter_quests.forEach(v => {
            if (v.id === "action:remove_thing_kakyoin") {
                v = Quests.bring_kakyoin_hospital;
            }
        });
    } else {
        await ctx.makeMessage({
            content: baseText + " " + successText,
            components: []
        });
        userData.chapter_quests.find(q => q.id === "action:remove_thing_kakyoin").completed = true;
    }
    ctx.client.database.delCooldownCache("cooldown", userData.id);
    ctx.client.database.saveUserData(userData);    
};