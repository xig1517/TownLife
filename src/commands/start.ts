import { Player, Vector3, system } from "@minecraft/server";
import { Translator } from "../building/translator";
import { eventBuffer } from "./_handler";

function start(sender: Player) {
    const status = sender.getDynamicProperty("translator:status");
    if (status != 3) throw "你要先完成設定才能夠開始建構";

    sender.setDynamicProperty("translator:setting.status", 4)
    const [pos1, pos2] = [
        sender.getDynamicProperty("translator:setting.pos1") as Vector3,
        sender.getDynamicProperty("translator:setting.pos2") as Vector3
    ]

    console.warn(Translator.Model2Code(sender.dimension, pos1, pos2));
    system.clearRun(eventBuffer[sender.name])
    delete eventBuffer[sender.name];

    return true;
}
export { start };