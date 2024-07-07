import { Player, Vector3, system } from "@minecraft/server";
import { Translator } from "../building/translator";
import { eventBuffer } from "./_handler";

export let testCode: string;

function start(sender: Player) {
    const status = sender.getDynamicProperty("translator:status");
    if (status != 3) throw "你要先完成設定才能夠開始建構";

    sender.setDynamicProperty("translator:status", 0)
    const [pos1, pos2] = [
        sender.getDynamicProperty("translator:pos1") as Vector3,
        sender.getDynamicProperty("translator:pos2") as Vector3
    ]

    const taskId = system.run(() => console.warn((new Translator).Encoding(sender.dimension, pos1, pos2)));

    system.clearRun(eventBuffer[sender.name])
    delete eventBuffer[sender.name];

    sender.sendMessage("--成功--")

    return true;
}
export { start };