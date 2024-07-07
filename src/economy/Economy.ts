import { Entity, Player } from "@minecraft/server";
import { EconomyDatabase } from "../database/economyDB";

type TargetType = Player | Entity

abstract class Economy {
    protected static db = new EconomyDatabase();
}

abstract class Money extends Economy {

    static readonly #identifier = "money";

    static create(target: TargetType, balance: number) {
        const money = this.db.setTarget(target).read(this.#identifier) as number | undefined;
        if (typeof money !== "undefined") return false;

        this.db.create(this.#identifier, balance);
        return true;
    }

    static modify(target: TargetType, value: number) {
        const money = this.db.setTarget(target).read(this.#identifier) as number | undefined;
        if (typeof money === "undefined") return false;
        this.db.update(this.#identifier, money + value);

        return true;
    }

    static set(target: TargetType, value: number) {
        this.db.setTarget(target).update(this.#identifier, value);

        return true;
    }

    static transfer(from: TargetType, to: TargetType, balance: number) {
        const sender = this.db.setTarget(from).read(this.#identifier) as number | undefined;
        if (typeof sender === "undefined") return false;
        if (sender < balance) return false;

        return this.modify(from, -balance) && this.modify(to, balance);
    }

}