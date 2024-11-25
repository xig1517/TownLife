import { world } from "@minecraft/server";
import GameSystem from "../../system";
import { DataBase } from "../_database";
import { BuildingDatabase } from "./buildingDB";

/*
Please ensure the direction of the structure you want to store is x->+, z->+

structure files in folder "structures" showing structure id, and you
should register the structure into database and read it by its structure name 
*/

class NameTable extends DataBase {

    readonly propertyId = "building_nameTable";

    constructor() {
        super(BuildingDatabase.databaseId);

        if (this.create(this.propertyId))
            this.update(this.propertyId, "[]");
    }

    getAll(): Array<string> {
        return JSON.parse(this.read(this.propertyId) as string)
    }

    register(structureName: string, structureId: string) {
        const structure = world.structureManager.get(structureId);

        if (!structure?.isValid())
            throw Error("This structure id is invalid: " + structureId)

        this.#add(structureName);
        structure.saveAs(GameSystem.structurePrefix + ':' + structureName);

        return true;
    }

    #add(structureName: string) {
        const nameTable = this.getAll();
        nameTable.push(structureName);
        this.update(this.propertyId, JSON.stringify(nameTable))
    }

    remove(structureName: string) {
        const nameWithPrefix = GameSystem.structurePrefix + ':' + structureName;

        if (!world.structureManager.delete(nameWithPrefix))
            throw Error("This structure id is invalid: " + nameWithPrefix);

        const nameTable = this.getAll()
        const index = nameTable.findIndex(id => id == structureName)
        if (index == -1) throw Error(`Cannot find structure name '${structureName}' in database.`);

        nameTable.slice(index);
        this.update(this.propertyId, JSON.stringify(nameTable))

        return true;
    }

}
export { NameTable };