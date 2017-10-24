import Table from "./Table";
import Validator from "./../edm/Validator";
import dataTypeMapping from "./dataTypeMapping";

const edmValidator = new Validator(dataTypeMapping);

export default class Database {
    constructor(options = {}) {
        let connectionPool = options.connectionPool;
        let edm = options.edm;
        let schema = options.schema;

        if (connectionPool == null) {
            throw new Error("Database needs to have a connectionPool.");
        }
        if (edm == null) {
            throw new Error("Database needs to have an edm.");
        }

        this.schema = schema;
        this.name = edm.name;
        this.edm = edm;
        this.connectionPool = connectionPool;
        this.tables = {};

        edmValidator.validate(edm);
        this._createTables();
    }

    _createTables() {
        let options = {
            connectionPool: this.connectionPool,
            edm: this.edm,
            schema: this.schema
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
                let mssqlTable = this.tables[table.name];
                return mssqlTable.createAsync();
            });
        }, Promise.resolve());
    }

    dropAsync() {
        let buildOrder = this._getTableBuildOrder().reverse();

        return buildOrder.reduce((promise, table) => {
            return promise.then(() => {
                let mssqlTable = this.tables[table.name];
                return mssqlTable.dropAsync();
            });
        }, Promise.resolve());
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