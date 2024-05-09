import { Block, BlockPermutation, Dimension, Direction, Vector3, system } from "@minecraft/server";

type OffsetType = [number, number, number];
type BlockIdTableType = string[]
type PermutationDataType = [string, string | number | boolean]

type BlockInfo = [OffsetType, number, PermutationDataType[]] // offset, blockIdTable index, permutation data
type ExpansionDirection = [boolean, boolean] // positive expansion = true, negative expansion = false
type ModelCode = [BlockIdTableType, ExpansionDirection, BlockInfo[]]

type StructureInfo = {
    offset: Vector3, // can use Block.offset(Vector3)
    permutation: BlockPermutation
}
type ModelFile = {
    benchmarkOffset: [number, number],
    facing: ExpansionDirection,
    info: StructureInfo[]
}

class Translator {

    static Model2Code(dimension: Dimension, pos1: Vector3, pos2: Vector3) {

        let blockIdTable = new Array<string>;
        let structure = new Array<BlockInfo>;

        let ExpansionDirection = [pos2.x - pos1.x >= 0, pos2.z - pos1.z >= 0];
        const [offsetX, offsetY, offsetZ] = [
            Math.abs(pos2.x - pos1.x) + 1,
            Math.abs(pos2.y - pos1.y) + 1,
            Math.abs(pos2.z - pos1.z) + 1
        ];

        for (let xi = 0; xi < offsetX; xi++) {
            for (let zi = 0; zi < offsetZ; zi++) {
                for (let yi = 0; yi < offsetY; yi++) {

                    const location = {
                        x: pos1.x + (ExpansionDirection[0] ? xi : -xi),
                        y: pos1.y + yi,
                        z: pos1.z + (ExpansionDirection[1] ? zi : -zi),
                    }
                    const block = dimension.getBlock(location) as Block;
                    const blockId = block.typeId.replace("minecraft:", "")
                    const permutationStates = block.permutation.getAllStates();

                    let index = blockIdTable.findIndex(id => id == blockId)
                    if (index == -1) {
                        blockIdTable.push(blockId);
                        index = blockIdTable.length - 1;
                    }

                    structure.push([
                        [xi, yi, zi],
                        index,
                        Object.entries(permutationStates)
                    ]);
                }
            }
        }
        return JSON.stringify([blockIdTable, ExpansionDirection, structure]);
    }

    /** Translate ModelCode to ModelFile */
    static #code2File(modelCode: ModelCode): ModelFile {
        const blockIdTable = modelCode[0];
        const structure = modelCode[2];

        let modelFile: ModelFile = {
            benchmarkOffset: [0, 0],
            facing: modelCode[1],
            info: []
        };
        for (const [offset, tableIndex, permutationData] of structure) {
            let states: Record<string, string | number | boolean> = {};
            permutationData.map(data => states[data[0]] = data[1]);

            modelFile.info.push({
                offset: { x: offset[0], y: offset[1], z: offset[2] },
                permutation: BlockPermutation.resolve("minecraft:" + blockIdTable[tableIndex], states)
            });
        }
        return modelFile;
    }

    static Code2Model(dimension: Dimension, startPoint: Vector3, facing: Direction, timer: number, modelCode_str: string) {
        const modelFile = this.#code2File(JSON.parse(modelCode_str));
        const generator = this.#build(dimension, startPoint, facing, modelFile);

        const jobId = system.runInterval(() => {
            if (generator.next().done) removeTask();
        }, timer * 20);
        const removeTask = () => {
            console.warn("stop")
            system.clearRun(jobId);
        }
    }

    static * #build(dimension: Dimension, startPoint: Vector3, facing: Direction, modelFile: ModelFile) {
        const firstBlock = dimension.getBlock(startPoint) as Block;
        modelFile = new Rotation(modelFile).rotateBuilding(facing).modelFile;

        for (const info of modelFile.info) {

            info.offset.x *= (modelFile.facing[0] ? 1 : -1);
            info.offset.z *= (modelFile.facing[1] ? 1 : -1);
            info.offset.x += modelFile.benchmarkOffset[0]
            info.offset.z += modelFile.benchmarkOffset[1]

            const offsetBlock = firstBlock.offset(info.offset) as Block;
            dimension.setBlockPermutation(offsetBlock.location, info.permutation);
            // yield;
        }
        return;
    }

}

export { Translator };

enum RotDirection {
    left = "left",
    right = "right",
    flip = "flip"
};

class Rotation {

    #modelFile: ModelFile;

    constructor(_modelFile: ModelFile) {
        this.#modelFile = _modelFile;
    }

    get modelFile() {
        return this.#modelFile;
    }

    rotateBuilding(to: Direction) {

        const facingDir = function (dir: ExpansionDirection) {
            switch (dir.toString()) {
                case [false, true].toString(): return Direction.East;
                case [false, false].toString(): return Direction.North;
                case [true, false].toString(): return Direction.West;
                case [true, true].toString(): return Direction.South;
                default: return Direction.East;
            }
        }

        const detectRotation = (from: Direction, to: Direction): RotDirection => {

            const dirTable = [Direction.West, Direction.South, Direction.East, Direction.North];

            const facingNumber = dirTable.findIndex(dir => dir == from);
            const toNumber = dirTable.findIndex(dir => dir == to);

            const detectCode = facingNumber - toNumber;
            console.warn(from, to)
            if (detectCode == -1 || detectCode == 3) return RotDirection.right;
            if (detectCode == 1 || detectCode == -3) return RotDirection.left;
            return RotDirection.flip;
        }

        const buildingFacing = facingDir(this.modelFile.facing);
        if (buildingFacing === to) return this;

        switch (detectRotation(buildingFacing, to)) {
            case RotDirection.left: this.#left(); break;
            case RotDirection.right: this.#right(); break;
            case RotDirection.flip: this.#flip(); break;
        }
        return this;
    }

    #rotateBlock(to: RotDirection, permutation: BlockPermutation) {

        function rot_direction(to: RotDirection, dir: number) {
            return (to == "left" ? ++dir % 4 : (to == "right" ? (dir - 1 < 0 ? 0 : --dir) : (dir + 2) % 4));
        }

        function rot_weirdo_direction(to: RotDirection, dir: number) {
            switch (dir) {
                default:
                case 0: return (to == "right" ? 2 : (to == "left" ? 3 : 1));
                case 2: return (to == "right" ? 1 : (to == "left" ? 0 : 3));
                case 1: return (to == "right" ? 3 : (to == "left" ? 2 : 0));
                case 3: return (to == "right" ? 0 : (to == "left" ? 1 : 2));
            }
        }

        const dir = permutation.getState("direction") as undefined | number;
        if (typeof dir !== "undefined") return permutation.withState("direction", rot_direction(to, dir));

        const weirdo_dir = permutation.getState("weirdo_direction") as undefined | number;
        if (typeof weirdo_dir !== "undefined") return permutation.withState("weirdo_direction", rot_weirdo_direction(to, weirdo_dir));

        return permutation;
    }

    #left() {
        console.warn("to left")
        const end = this.modelFile.info[this.modelFile.info.length - 1];
        this.modelFile.benchmarkOffset = [-end.offset.z, 0];

        for (const info of this.modelFile.info) {
            const [xi, zi] = [info.offset.x, info.offset.z];

            info.offset.x = end.offset.z - zi;
            info.offset.z = xi;

            info.permutation = this.#rotateBlock(RotDirection.left, info.permutation);
        }
    }

    #right() {
        console.warn("to right")
        const end = this.#modelFile.info[this.#modelFile.info.length - 1];
        this.modelFile.benchmarkOffset = [0, end.offset.x];

        for (const info of this.#modelFile.info) {
            const [xi, zi] = [info.offset.x, info.offset.z];

            info.offset.x = zi;
            info.offset.z = end.offset.x - xi;

            info.permutation = this.#rotateBlock(RotDirection.right, info.permutation);
        }
    }

    #flip() {
        console.warn("to flip")
        const end = this.#modelFile.info[this.#modelFile.info.length - 1];
        this.modelFile.benchmarkOffset = [-end.offset.x, end.offset.z];

        for (const info of this.#modelFile.info) {
            const [xi, zi] = [info.offset.x, info.offset.z];

            info.offset.x = end.offset.x - xi;
            info.offset.z = end.offset.z - zi;

            info.permutation = this.#rotateBlock(RotDirection.flip, info.permutation);
        }
    }
}