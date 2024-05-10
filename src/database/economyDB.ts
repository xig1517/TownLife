import { Entity, Player } from "@minecraft/server";
import { DataBase } from "./_database";

class EconomyDatabase extends DataBase {

    constructor() {
        super("Economy");
    }

    setTarget(target: Entity | Player | undefined) {
        this._target = target;
        return this;
    }

}
export { EconomyDatabase };