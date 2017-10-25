import Table from "./Table";
import path from "path";
import fileSystem from "fs";

export default class {

    constructor({
        decorators = [],
        database = null,
        fileSystem = null
         } = {}) {

        if (!Array.isArray(decorators)) {
            throw new Error("Invalid Argument: decorators needs to be an array.");
        }

        if (database == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a database.");
        }

        if (fileSystem == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a fileSystem.");
        }

        this.database = database;
        this.decorators = decorators;
        this.edm = database.edm;
        this.name = this.edm.name;
        this.version = this.edm.version;
        this.fileSystem = fileSystem;
        this.tables = {};

        database.getTables().forEach((table) => {
            this.tables[table.name] = new Table({
                table: table,
                decorators: this.decorators,
                fileSystem: this.fileSystem
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