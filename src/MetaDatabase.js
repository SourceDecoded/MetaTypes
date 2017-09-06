import Database from "./sqlite/Database";
import MetaTable from "./MetaTable";
import path from "path";
import fileSystem from "fs";

export default class MetaDatabase {

    constructor({ decorators = [], database = null } = {}) {
        if (!Array.isArray(decorators)) {
            throw new Error("Invalid argument: decorators needs to be an array.");
        }

        if (database == null) {
            throw new Error();
        }

        this.database = database;
        this.edm = database.edm;
        this.decorators = decorators;
        this.tables = {};
        this.name = this.edm.name;
        this.version = this.edm.version;

        database.getTables().forEach((table) => {
            this.tables[table.name] = new MetaTable({
                table: table,
                decorators: decorators
            });
        });
    }

    getTable(name) {
        return this.tables[name] || null;
    }

    getTables() {
        return Object.keys(this.tables).map((name) => {
            return this.tables[name];
        });
    }
}