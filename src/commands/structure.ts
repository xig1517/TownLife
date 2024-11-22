import { Player } from "@minecraft/server";
import GameSystem from "../system";

export function structure(sender: Player, args: string[]) {
    const db = GameSystem.structureDb;
    switch (args[0]) {
        case "register":
        case "reg":
            if (args[1] == undefined || args[2] == undefined)
                throw Error("Please enter the correct command format: -townlife structure register <register_name> <structure_Id>");

            const [_, regName, structureId] = args;
            if (db.properties.nameTable.register(regName, structureId))
                sender.sendMessage(`Registered structure '${regName}' with structure id '${structureId}'`)

            break;
        case "remove":
            if (args[1] == undefined)
                throw Error("Please enter the correct command format: -townlife structure remove <structure name>");

            if (db.properties.nameTable.remove(args[1]))
                sender.sendMessage("Remove structure: " + args[1])
            break;
        default:
            throw Error("");
    }
}
