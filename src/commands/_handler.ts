import { Player } from "@minecraft/server";
import { structure } from "./structure";
import { test } from "./test";

export let eventBuffer: Record<string, number> = {};

function command_handler(sender: Player, cmd: string) {
    if (!cmd.startsWith("-tl") || cmd.startsWith("-townlife"))
        throw Error("Cannot find command: " + cmd);

    const args = cmd.split(' '); args.splice(0, 1);
    const cmdName = args[0]; args.splice(0, 1);

    switch (cmdName) {
        case "structure":
        case "st":
            return structure(sender, args);
        case "test":
            return test(sender, args);
        default: throw Error("請輸入正確的指令");
    }
}
export { command_handler }