import { Entity } from "@minecraft/server";
import { DataBase } from "../_database";
import { EconomicDatabase } from "./economyDB";

type DebtTable = Array<[string, number]>

class Debt extends DataBase {

    readonly propertyId = "economic_debt";

    constructor() { super(EconomicDatabase.databaseId) }

    getAll(debtor: Entity) {
        return JSON.parse(this.read(this.propertyId, debtor) as string) ?? []
    }

    add(debtor: Entity, creditor: Entity, value: number) {
        this.create(this.propertyId, debtor)

        if (this.read(this.propertyId) == undefined) this.update(this.propertyId, "[]")

        const debtTable: DebtTable = JSON.parse(this.read(this.propertyId) as string)
        debtTable.push([creditor.id, value])
        this.update(this.propertyId, JSON.stringify(debtTable))
    }

    remove(debtor: Entity, creditor: Entity) {
        if (this.read(this.propertyId) == undefined) return;

        const debtTable: DebtTable = JSON.parse(this.read(this.propertyId, debtor) as string);

        const index = debtTable.findIndex(([creditorId, _]) => creditorId == creditor.id)
        if (index == -1) return;
        debtTable.splice(index);
        this.update(this.propertyId, JSON.stringify(debtTable), debtor);
    }

}
export { Debt };