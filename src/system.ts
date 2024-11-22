import { system } from "@minecraft/server";
import { StructureDatabase } from "./database/structure/structureDB";

class GameSystem {

    static readonly structurePrefix = "townlife";

    static readonly structureDb = StructureDatabase;

    constructor() {
        this.#init();
        system.runInterval(() => this.running(), 1);
    }

    #init() {

    }

    running() {

    }

}
export default GameSystem;