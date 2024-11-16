import { Vector3, BlockPermutation } from "@minecraft/server";

type BlockTypeTable = string[]

type BlockTypeIndex = number
type PermutationData = [string, string | number | boolean]

type BlockDetail = [
    [number, number, number],   // offset
    BlockTypeIndex,             // index of blockType Table
    PermutationData[]           // permutation data
]

type BuildingCodeType = {
    size: [number, number],                 // Size: the length of Row and Column
    blockTypeTable: BlockTypeTable,         // blockType table
    details: BlockDetail[]                  // blocks detail
}

type Position = {
    pivot: Vector3,
    size: [number, number]
}

interface BuildingInfo {
    position: Position,                 // Size: the length of Row and Column
    structure: Array<{
        offset: Vector3,                    // can use Block.offset(Vector3)
        permutation: BlockPermutation
    }>
}