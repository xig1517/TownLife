import { ChatSendBeforeEvent, Player, world } from "@minecraft/server";
import { command_handler } from "../commands/_handler";

abstract class chatSendBefore {
    static subscribe = (player: Player) => {
        return world.beforeEvents.chatSend.subscribe(ev => {
            if (ev.sender.name != player.name) return;
            if (command_handler(ev.sender, ev.message)) ev.cancel = true;
        });
    }
    static unsubscribe = (ev: (args: ChatSendBeforeEvent) => void) =>
        world.beforeEvents.chatSend.unsubscribe(ev);
}
export default chatSendBefore;