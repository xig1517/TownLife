import { Balance } from "./balance";
import { Debt } from "./debt";

class EconomicDatabase {

    static readonly databaseId = "Economic"

    static get properties() { return EconomicProperty; }

}

class EconomicProperty {
    static readonly balance = new Balance;
    static readonly debt = new Debt;
}

export { EconomicDatabase };