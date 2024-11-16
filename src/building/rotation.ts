import { BuildingInfo } from "./declare/_types";
import { DirectionType } from "./declare/enum";

abstract class Rotater {

    // 傳入buildingInfo，指示旋轉方向
    // 回傳轉向過後的buildingInfo

    static rotate(to: DirectionType, buildingInfo: BuildingInfo) {
        switch (to) {
            case DirectionType.East: return this.#toLeft(buildingInfo);
            case DirectionType.West: return this.#toRight(buildingInfo);
            case DirectionType.North: return this.#toFlip(buildingInfo);
            default: return buildingInfo;
        }
    }

    // 向右(順時針)翻轉
    static #toRight(buildingInfo: BuildingInfo) {
        const size = buildingInfo.position.size;
        for (const data of buildingInfo.structure) {
            const [x, z] = [data.offset.x, data.offset.z];
            data.offset.z = x;
            data.offset.x = size[0] - 1 - z;
        }
        buildingInfo.position.pivot.x = -1;
        buildingInfo.position.pivot.z = size[0] - 1;
        console.warn("to right");
        return buildingInfo;
    }


    // 向左(逆時針)翻轉
    static #toLeft(buildingInfo: BuildingInfo) {
        const size = buildingInfo.position.size;
        for (const data of buildingInfo.structure) {
            const [x, z] = [data.offset.x, data.offset.z];
            data.offset.x = z;
            data.offset.z = size[1] - 1 - x;
        }
        buildingInfo.position.pivot.x = size[1] - 1;
        buildingInfo.position.pivot.z = 1;
        console.warn("to left");
        return buildingInfo;
    }

    // 翻轉
    static #toFlip(buildingInfo: BuildingInfo) {
        const size = buildingInfo.position.size;
        for (const data of buildingInfo.structure) {
            const [x, z] = [data.offset.x, data.offset.z];
            data.offset.x = size[0] - x - 1;
            data.offset.z = size[1] - z - 1;
        }
        buildingInfo.position.pivot.x = size[0] - 1;
        buildingInfo.position.pivot.z = size[1] + 1;
        console.warn("to flip");
        return buildingInfo;
    }

}
export { Rotater };