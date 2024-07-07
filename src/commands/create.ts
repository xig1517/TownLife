import { Player, system } from "@minecraft/server";
import { eventBuffer } from "./_handler";
import EventHandler from "../events/_handler";

function create(sender: Player, args: string[]) {
    const status = sender.getDynamicProperty("translator:status");

    if (args[1] == undefined) throw "請輸入正確的指令";
    if (status != 0 && status != undefined) throw "你已經在設定模式裡面了";

    sender.setDynamicProperty("translator:status", 1);
    eventBuffer[sender.name] = system.run(() => EventHandler.playerBreakBefore.subscribe(sender));

    sender.sendMessage("--------------");
    sender.sendMessage("你已經進入設定模式");
    sender.sendMessage("請透過破壞方塊來設定第一個點");
    sender.sendMessage("輸入 - build exit 來退出設定模式");
    sender.sendMessage("--------------");

    return true;
}
export { create };