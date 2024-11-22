import { Entity } from "@minecraft/server";
import { EconomicDatabase } from "./economyDB";
import { DataBase } from "../_database";

class Balance extends DataBase {

    readonly propertyId = "economic_balance";

    constructor() {
        super(EconomicDatabase.databaseId);
    }

    register(entity: Entity) {
        this.create(this.propertyId, entity);
        this.update(this.propertyId, 0, entity);
    }

    get(entity: Entity) {
        return this.read(this.propertyId, entity) as number;
    }

    add(entity: Entity, value: number) {
        const balance = this.get(entity);
        this.update(this.propertyId, balance + value)
    }

    cost(entity: Entity, value: number) {
        const balance = this.get(entity);
        if (balance < value) throw Error("Insufficient balance.");
        this.update(this.propertyId, balance - value)
        return true;
    }

    pay(sender: Entity, receiver: Entity, value: number) {
        try {
            this.cost(sender, value);
            this.add(receiver, value);
        } catch (err) {
            throw Error("Payment failied.");
        }
    }

}
export { Balance };