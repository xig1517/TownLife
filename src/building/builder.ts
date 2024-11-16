import { Block, Dimension, system, Vector3 } from "@minecraft/server";
import { BuildingInfo } from "./declare/_types";
import { DirectionType } from "./declare/enum";
import { Rotater } from "./rotation";

class Builder {

    constructor(
        private dimension: Dimension,
        private facing: DirectionType,
        private startPoint: Vector3,
        private buildingInfo: BuildingInfo
    ) { }

    *#taskGenerator() {
        const pivot = this.buildingInfo.position.pivot;

        this.startPoint.x -= pivot.x;
        this.startPoint.z -= pivot.z;
        const startBlock = this.dimension.getBlock(this.startPoint) as Block;

        for (const structure of this.buildingInfo.structure) {
            const offsetBlock = startBlock.offset(structure.offset) as Block;
            this.dimension.setBlockPermutation(offsetBlock.location, structure.permutation);
            // yield;
        }
    }

    startBuilding(timer: number = 0.05) {

        this.buildingInfo = Rotater.rotate(this.facing, this.buildingInfo);
        const generator = this.#taskGenerator();

        const taskId = system.runInterval(() => {
            if (generator.next().done) removeTask();
        }, timer * 20);
        const removeTask = () => {
            system.clearRun(taskId);
        }
    }
}
export { Builder };