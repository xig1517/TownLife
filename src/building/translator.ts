import { Block, BlockPermutation, BlockVolume, Dimension, Vector3 } from "@minecraft/server";

import type { BlockDetail, BlockTypeTable, BuildingCodeType, BuildingInfo } from "./declare/_types";

class Translator {

    static Encoding(dimension: Dimension, from: Vector3, to: Vector3) {

        const blockTypeTable: BlockTypeTable = [];
        const blockDetail: BlockDetail[] = [];

        const blocks = dimension.getBlocks(new BlockVolume(from, to), {});

        [from, to] = [blocks.getMin(), blocks.getMax()];

        for (const location of blocks.getBlockLocationIterator()) {
            const block = dimension.getBlock(location) as Block;
            const typeId = block.typeId.replace("minecraft:", "");

            let index = blockTypeTable.findIndex((id: string) => id == typeId);
            if (index == -1) {
                blockTypeTable.push(typeId);
                index = blockTypeTable.length - 1;
            }

            blockDetail.push([
                [
                    location.x - from.x,
                    location.y - from.y,
                    location.z - from.z
                ],
                index,
                Object.entries(block.permutation.getAllStates())
            ])
        }

        const buildingCode: BuildingCodeType = {
            size: [blocks.getMax().x - blocks.getMin().x, blocks.getMax().z - blocks.getMin().z],
            blockTypeTable: blockTypeTable,
            details: blockDetail
        };

        return JSON.stringify(buildingCode);
    }

    static Decoding(rawBuildingCode: string) {
        const buildingCode = JSON.parse(rawBuildingCode) as BuildingCodeType;

        const [blockTypeTable, details] = [buildingCode.blockTypeTable, buildingCode.details];

        let buildingInfo: BuildingInfo = {
            position: {
                pivot: { x: 0, y: 0, z: -1 },
                size: buildingCode.size,
            },
            structure: []
        };

        for (const [offset, tableIndex, permutationData] of details) {
            let states: Record<string, string | number | boolean> = {};
            permutationData.map(data => states[data[0]] = data[1]);

            buildingInfo.structure.push({
                offset: { x: offset[0], y: offset[1], z: offset[2] },
                permutation: BlockPermutation.resolve("minecraft:" + blockTypeTable[tableIndex], states)
            });
        }
        return buildingInfo;
    }
}
export { Translator };