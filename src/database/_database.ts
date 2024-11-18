import { world, Vector3, Entity, Player } from "@minecraft/server";

type ValueType = string | number | boolean | Vector3 | undefined;

export abstract class DataBase {

    private _target: Entity | Player | undefined = undefined

    constructor(private _identifier: string) { }

    setTarget(t: Entity | Player | undefined) {
        this._target = t;
        return this;
    }

    protected create(propertyName: string, value: ValueType = undefined) {
        const fullId = this._identifier + ":" + propertyName;

        (typeof this._target === "undefined") ?
            world.setDynamicProperty(fullId, value) :
            this._target?.setDynamicProperty(fullId, value)
    }

    protected read(propertyName: string) {
        try {
            const fullId = this._identifier + ":" + propertyName;
            return (typeof this._target === "undefined") ?
                world.getDynamicProperty(fullId) :
                this._target?.getDynamicProperty(fullId);
        }
        catch {
            console.warn("You must create the property before read it.")
            return undefined;
        }
    }

    protected update(propertyName: string, value: ValueType) {
        const fullId = this._identifier + ":" + propertyName;
        (typeof this._target === "undefined") ?
            world.setDynamicProperty(fullId, value) :
            this._target?.setDynamicProperty(fullId, value)
    }

    protected delete(propertyName: string) {
        const fullId = this._identifier + ":" + propertyName;
        (typeof this._target === "undefined") ?
            world.setDynamicProperty(fullId, undefined) :
            this._target?.setDynamicProperty(fullId, undefined)
    }

}