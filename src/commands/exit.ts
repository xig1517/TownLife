import { Player, system } from "@minecraft/server";
import { eventBuffer } from "./_handler";

function exit(sender: Player) {
    sender.setDynamicProperty("translator:setting.status", 0);
    sender.sendMessage("你已經退出設定模式");

    system.clearRun(eventBuffer[sender.name])
    delete eventBuffer[sender.name];

    return true;
}
export { exit };