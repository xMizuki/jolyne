import chalk from "chalk";

const getDatePrefix = () => {
    const date = new Date();
    return "[" + (
    (date.getDate()).toString().padStart(2, "0") + "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getFullYear() + " " +
    date.getHours().toString().padStart(2, "0") + ":" +
    date.getMinutes().toString().padStart(2, "0") + ":" +
    date.getSeconds().toString().padStart(2, "0") + "." +
    date.getMilliseconds().toString().padStart(3, "0")) + "]:";
};

export default function log(content: string, type = "log") {
    const clusterID = process.env.TOTAL_SHARDS ? `Cluster ${process.env.CLUSTER}/${parseInt(process.env.CLUSTER_COUNT) - 1} ` : "";

    switch (type) {
    case "warn":
        console.log(`${clusterID}${getDatePrefix()} ${chalk.black.bgYellow("[WARN]")} ${content}`);
        break;
    case "error":
        console.log(`${clusterID}${getDatePrefix()} ${chalk.black.bgRed("[ERROR]")} ${content}`);
        break;
    case "debug":
        console.log(`${clusterID}${getDatePrefix()} ${chalk.greenBright("[DEBUG]")} ${content}`);
        break;
    case "cmd":
        console.log(`${clusterID}${getDatePrefix()} ${chalk.blueBright("[CMD]")} ${content}`);
        break;
    case "redis": 
        console.log(`${clusterID}${getDatePrefix()} ${chalk.black.bgRedBright("[REDIS]")} ${content}`);
        break;
    case "postgres":
        console.log(`${clusterID}${getDatePrefix()} ${chalk.black.bgBlueBright("[POSTGRES]")} ${content}`);
        break;
    case "event":
        console.log(`${clusterID}${getDatePrefix()} ${chalk.yellow("[EVENT]")} ${content}`);
        break;
    default:
        console.log(`${clusterID}${getDatePrefix()} ${chalk.hex("#70926c")("[LOG]")} ${content}`);
    }
}