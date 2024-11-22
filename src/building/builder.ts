import {
    world,

    Dimension,
    Vector3,

    Structure,
    StructurePlaceOptions,
    StructureAnimationMode,
    StructureMirrorAxis,
    StructureRotation,

} from "@minecraft/server";



class Builder {

    static readonly structurePrefix = "townlife";

    private structure: Structure;

    constructor(
        private structureId: string,
        private dimension: Dimension,
        private startPoint: Vector3,
        private facing: number,         // 0=[1,0], 1=[0,1], 2=[-1,0], 3=[0,-1]
    ) {
        this.structure = world.structureManager.get(Builder.structurePrefix + ':' + structureId) as Structure;
    }

    #getRotation() {
        switch (this.facing) {
            case 0: return StructureRotation.None;
            case 1: return StructureRotation.Rotate90;
            case 2: return StructureRotation.Rotate180;
            case 3: return StructureRotation.Rotate270;
        }
    }

    #offset_startPoint() {

        switch (this.facing) {
            case 0: return this.startPoint.x += 1;
            case 1: return [this.startPoint.x -= this.structure.size.z - 1, this.startPoint.z += 1]
            case 2: return [this.startPoint.z -= this.structure.size.z - 1, this.startPoint.x -= this.structure.size.x]
            case 3: return this.startPoint.z -= this.structure.size.x;
        }
    }

    #getOptions(totalTime: number): StructurePlaceOptions {

        const options: StructurePlaceOptions = {
            animationMode: StructureAnimationMode.Blocks,
            animationSeconds: totalTime,
            includeBlocks: true,
            includeEntities: false,
            mirror: StructureMirrorAxis.None,
            rotation: this.#getRotation(),
            waterlogged: true
        }
        return options;
    }

    begin(totalTime: number = 10) {

        const options = this.#getOptions(totalTime);
        this.#offset_startPoint();

        world.structureManager.place(
            Builder.structurePrefix + ':' + this.structureId,
            this.dimension,
            this.startPoint,
            options
        );
    }


}
export { Builder };