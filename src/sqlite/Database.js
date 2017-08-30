import Table from "./Table";

export default class Database {
    constructor(sqlite, edm) {
        if (sqlite == null) {
            throw new Error("Database needs to have a sqlite.");
        }
        if (edm == null) {
            throw new Error("Database needs to have a edm.");
        }

        this.name = edm.name;
        this.edm = edm;
        this.sqlite = sqlite;
        this.tables = {};

        this._createTables();
    }

    _createTables() {
        let options = {
            sqlite: this.sqlite,
            edm: this.edm
        };

        this.edm.tables.forEach((table) => {
            this.tables[table.name] = new Table(table.name, options);
        });
    }

    createAsync() {
        return this.tables.reduce((promise, table) => {
            return promise.then(() => {
                return table.createAsync();
            });
        }, Promise.resolve());
    }

    dropAsync() {
        return his.tables.reduce((promise, table) => {
            return promise.then(() => {
                return table.dropAsync();
            });
        }, Promise.resolve());
    }

    getTable(name) {
        return this.tables[name];
    }

}