import { NameTable } from "./nameTable";
import { ConstructionTasks } from "./constructionTasks";

class BuildingDatabase {

    static readonly databaseId = "Building";

    static get properties() { return BuildingProperty }

}

class BuildingProperty {
    static readonly nameTable = new NameTable
    static readonly storageLocations = new ConstructionTasks
}

export { BuildingDatabase };