import { ChatSendBeforeEvent, Player, Vector3, world, system } from "@minecraft/server";
import Building_EventHandler from "./_handler";
import { Translator } from "../translator";

type EventBuffer = {
    [playerName: string]: number
}

abstract class chatSendBefore {

    static eventBuffer: EventBuffer = {}

    static subscribe = (player: Player) => {
        return world.beforeEvents.chatSend.subscribe(ev => {
            if (ev.sender.name != player.name) return;
            if (!ev.message.startsWith("-build")) return;

            ev.cancel = true;

            const args = ev.message.split(' '); args.splice(0, 1);
            const status = player.getDynamicProperty("translator:setting.status");

            try {
                switch (args[0]) {
                    case "create":
                        if (args[1] == undefined) throw "請輸入正確的指令";
                        if (status != 0 && status != undefined) throw "你已經在設定模式裡面了";

                        player.setDynamicProperty("translator:setting.status", 1)
                        this.eventBuffer[player.name] = system.run(() => Building_EventHandler.playerBreakBefore.subscribe(player));

                        player.sendMessage("你已經進入設定模式");
                        player.sendMessage("請透過破壞方塊來設定第一個點");
                        player.sendMessage("輸入 - build exit 來退出設定模式");
                        break;

                    case "start":
                        if (status != 3) throw "你要先完成設定才能夠開始建構";

                        player.setDynamicProperty("translator:setting.status", 4)
                        const [pos1, pos2] = [
                            player.getDynamicProperty("translator:setting.pos1") as Vector3,
                            player.getDynamicProperty("translator:setting.pos2") as Vector3
                        ]

                        console.warn(Translator.Model2Code(player.dimension, pos1, pos2));
                        system.clearRun(this.eventBuffer[player.name])
                        delete this.eventBuffer[player.name];

                        break;

                    case "exit":
                        player.setDynamicProperty("translator:setting.status", 0);
                        player.sendMessage("你已經退出設定模式");
                        break;

                    default:
                        throw "請輸入正確的指令";
                }
            } catch (err: any) {
                console.warn(err)
                player.sendMessage(err)
            }
        });

    }
    static unsubscribe = (ev: (args: ChatSendBeforeEvent) => void) =>
        world.beforeEvents.chatSend.unsubscribe(ev);
}
export default chatSendBefore;