import { world, Vector3, Entity, Player } from "@minecraft/server";

type ValueType = string | number | boolean | Vector3 | undefined;

export class DataBase {

    constructor(private _identifier: string) { }

    protected create(
        propertyName: string,
        entity?: Entity | Player
    ) {
        const nameWithId = this._identifier + ":" + propertyName;
        (entity == undefined) ?
            world.setDynamicProperty(nameWithId) :
            entity.setDynamicProperty(nameWithId)
    }

    protected read(
        propertyName: string,
        entity?: Entity | Player
    ) {
        const nameWithId = this._identifier + ":" + propertyName;
        try {
            return (entity == undefined) ?
                world.getDynamicProperty(nameWithId) :
                entity.getDynamicProperty(nameWithId)
        }
        catch {
            console.warn("You must create the property before read it.")
            return undefined;
        }
    }

    protected update(
        propertyName: string,
        value: ValueType,
        entity?: Entity | Player
    ) {
        const nameWithId = this._identifier + ":" + propertyName;
        (entity == undefined) ?
            world.setDynamicProperty(nameWithId, value) :
            entity.setDynamicProperty(nameWithId, value)
    }

    protected delete(
        propertyName: string,
        entity?: Entity | Player
    ) {
        const nameWithId = this._identifier + ":" + propertyName;
        (entity == undefined) ?
            world.setDynamicProperty(nameWithId, undefined) :
            entity.setDynamicProperty(nameWithId, undefined)
    }

}