import { Dimension, Vector3 } from "@minecraft/server";
import { BuildingInfo } from "./_types";

interface ITranslator {

    /**
     * 將Building轉換成BuildingCode，並轉成純字串
     * @param dimension 建築所選世界
     * @param pos1 建築的第一個點
     * @param pos2 建築的第二個點
    */
    Encoding(dimension: Dimension, pos1: Vector3, pos2: Vector3): string;

    /**
     * 將所給的BuildingCode轉換成BuildingInfo
     * @param buildingCode  被轉成文字的建築，目前是字串型態
    */
    Decoding(buildingCode: string): BuildingInfo;
}