import { NameTable } from "./nameTable";

class StructureDatabase {

    static readonly databaseId = "Structure";

    static get properties() { return StructureProperty }

}

class StructureProperty {
    static readonly nameTable = new NameTable
}

export { StructureDatabase };