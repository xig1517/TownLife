import { world } from "@minecraft/server";
import EventHandler from "./events/_handler";

world.getPlayers().forEach(player => {
    EventHandler.chatSendBefore.subscribe(player);
})