import Table from "./Table";

export default class Database {
    constructor(options = {}) {
        let sqlite = options.sqlite;
        let edm = options.edm;

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

    _getTableFromEdm(name) {
        return this.edm.tables.find((table) => {
            return table.name = name;
        });
    }

    _getTableBuildOrder() {
        let walkedTables = [];

        this.edm.tables.forEach((table) => {
            this._walkRelationships(table, walkedTables);
        });

        return walkedTables;
    }

    _walkRelationships(table, tablesWalked) {
        if (tablesWalked.indexOf(table) > -1) {
            return;
        }

        let forEachRelationship = (relationship) => {
            let sourceTable = this._getTableFromEdm(relationship.type);
            this._walkRelationships(sourceTable, tablesWalked);
        }

        this.edm.relationships.oneToOne.filter((relationship) => {
            relationship.ofType === table.name;
        }).forEach(forEachRelationship);

        this.edm.relationships.oneToMany.filter((relationship) => {
            relationship.ofType === table.name;
        }).forEach(forEachRelationship);

        tablesWalked.push(table);
    }

    createAsync() {
        let buildOrder = this._getTableBuildOrder();

        return buildOrder.reduce((promise, table) => {
            return promise.then(() => {
                let sqliteTable = this.tables[table.name];
                return sqliteTable.createAsync();
            });
        }, Promise.resolve());
    }

    dropAsync() {
        let buildOrder = this._getTableBuildOrder().reverse();

        return buildOrder.reduce((promise, table) => {
            return promise.then(() => {
                let sqliteTable = this.tables[table.name];
                return sqliteTable.dropAsync();
            });
        }, Promise.resolve());
    }

    getTable(name) {
        return this.tables[name];
    }

}