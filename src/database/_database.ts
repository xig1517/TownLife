import { world, Vector3, Entity, Player } from "@minecraft/server";

type ValueType = string | number | boolean | Vector3 | undefined;

export class DataBase {

    constructor(
        private _identifier: string,
        protected _target: Entity | Player | undefined = undefined
    ) { }

    create(propertyName: string, value: ValueType = undefined) {
        const fullId = this._identifier + ":" + propertyName;

        (typeof this._target === "undefined") ?
            world.setDynamicProperty(fullId, value) :
            this._target?.setDynamicProperty(fullId, value)
    }

    read(propertyName: string) {
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

    update(propertyName: string, value: ValueType) {
        const fullId = this._identifier + ":" + propertyName;
        (typeof this._target === "undefined") ?
            world.setDynamicProperty(fullId, value) :
            this._target?.setDynamicProperty(fullId, value)
    }

    delete(propertyName: string) {
        const fullId = this._identifier + ":" + propertyName;
        (typeof this._target === "undefined") ?
            world.setDynamicProperty(fullId, undefined) :
            this._target?.setDynamicProperty(fullId, undefined)
    }

}