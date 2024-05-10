import { Player } from "@minecraft/server";
import { create } from "./create";
import { start } from "./start";
import { exit } from "./exit";
import { test } from "./test";

export let eventBuffer: Record<string, number> = {};

function command_handler(sender: Player, cmd: string) {
    try {
        if (!cmd.startsWith("-build")) return false;

        const args = cmd.split(' '); args.splice(0, 1);
        switch (args[0]) {
            case "create": return create(sender, args);
            case "start": return start(sender);
            case "exit": return exit(sender);
            case "test": return test(sender, args);
            default: throw "請輸入正確的指令";
        }

    } catch (errMsg: any) {
        sender.sendMessage(errMsg);
        console.warn(errMsg);
        return false;
    }
}
export { command_handler };