import { world, Vector3, Entity } from "@minecraft/server";

type ValueType = string | number | boolean | Vector3 | undefined;

class DataBase {

    constructor(private _identifier: string) { }

    protected create(
        propertyName: string,
        entity?: Entity
    ) {
        const nameWithId = this._identifier + ":" + propertyName;
        if (this.read(nameWithId) != undefined) return false;
        (entity == undefined) ?
            world.setDynamicProperty(nameWithId) :
            entity.setDynamicProperty(nameWithId)
        return true;
    }

    protected read(
        propertyName: string,
        entity?: Entity
    ) {
        const nameWithId = this._identifier + ":" + propertyName;
        return (entity == undefined) ?
            world.getDynamicProperty(nameWithId) :
            entity.getDynamicProperty(nameWithId)
    }

    protected update(
        propertyName: string,
        value: ValueType,
        entity?: Entity
    ) {
        const nameWithId = this._identifier + ":" + propertyName;
        (entity == undefined) ?
            world.setDynamicProperty(nameWithId, value) :
            entity.setDynamicProperty(nameWithId, value)

        return true;
    }

    protected delete(
        propertyName: string,
        entity?: Entity
    ) {
        return this.update(propertyName, undefined, entity);
    }

}
export { DataBase }