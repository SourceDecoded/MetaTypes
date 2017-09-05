import Database from "./sqlite/Database";
import MetaTable from "./MetaTable";
import path from "path";
import fileSystem from "fs";

export default class MetaDatabase {

    constructor(options = { decorators: [] }) {
        if (!Array.isArray(options.decorators)) {
            throw new Error();
        }

        if (options.database == null) {
            throw new Error();
        }

        this.database = options.database;
        this.edm = this.database.edm;
        this.decorators = options.decorators;
        this.tables = {};

        this.database.getTables().forEach((table) => {
            this.tables[table.name] = new MetaTable({
                table: table,
                decorators: this.decorators
            });
        });
    }

    getTable(name) {
        return this.tables[name];
    }

    getTables() {
        return Object.keys(this.tables).map((name) => {
            return this.tables[name];
        });
    }
}