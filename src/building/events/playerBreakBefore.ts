import { world } from "@minecraft/server";
import { Player, PlayerBreakBlockBeforeEvent } from "@minecraft/server";

abstract class playerBreakBefore {

    static subscribe = (player: Player) =>
        world.beforeEvents.playerBreakBlock.subscribe(ev => {
            if (ev.player.name != player.name) return;

            const status = player.getDynamicProperty("translator:setting.status");
            switch (status) {
                case 1:
                    player.setDynamicProperty("translator:setting.pos1", ev.block.location);
                    player.sendMessage(`你設置的第一個點 = (${ev.block.x},${ev.block.y},${ev.block.z})`);
                    player.setDynamicProperty("translator:setting.status", 2);
                    break;

                case 2:
                    player.setDynamicProperty("translator:setting.pos2", ev.block.location);
                    player.sendMessage(`你設置的第二個點 = (${ev.block.x},${ev.block.y},${ev.block.z})`);
                    player.sendMessage("確認無誤後，請輸入: -build start 來儲存建築")
                    player.sendMessage("如果要重新設定，請輸入: -build exit 退出後重新創建")

                    player.setDynamicProperty("translator:setting.status", 3);
                    break;
            }
        })

    static unsubscribe = (ev: (args: PlayerBreakBlockBeforeEvent) => void) =>
        world.beforeEvents.playerBreakBlock.unsubscribe(ev);
}
export default playerBreakBefore;