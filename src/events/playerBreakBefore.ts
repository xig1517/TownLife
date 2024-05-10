import { Block, world } from "@minecraft/server";
import { Player, PlayerBreakBlockBeforeEvent } from "@minecraft/server";

abstract class playerBreakBefore {
    static subscribe = (player: Player) =>
        world.beforeEvents.playerBreakBlock.subscribe(ev => {
            if (ev.player.name != player.name) return;
            return setting(player, ev.block);
        });
    static unsubscribe = (ev: (args: PlayerBreakBlockBeforeEvent) => void) =>
        world.beforeEvents.playerBreakBlock.unsubscribe(ev);
}
export default playerBreakBefore;

const setting = (player: Player, block: Block) => {
    const status = player.getDynamicProperty("translator:setting.status");
    switch (status) {
        case 1:
            player.setDynamicProperty("translator:pos1", block.location);
            player.sendMessage(`你設置的第一個點 = (${block.x},${block.y},${block.z})`);
            player.setDynamicProperty("translator:status", 2);
            break;

        case 2:
            player.setDynamicProperty("translator:pos2", block.location);
            player.sendMessage(`你設置的第二個點 = (${block.x},${block.y},${block.z})`);
            player.sendMessage("確認無誤後，請輸入: -build start 來儲存建築")
            player.sendMessage("如果要重新設定，請輸入: -build exit 退出後重新創建")

            player.setDynamicProperty("translator:status", 3);
            break;
    }
    return true;
}