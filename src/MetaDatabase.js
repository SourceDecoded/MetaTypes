import Database from "./sqlite/Database";
import MetaTable from "./MetaTable";
import path from "path";
import fileSystem from "fs";

export default class MetaDatabase {

    constructor({ decorators = [], sqlite = null, databasePath = null, edm = null } = {}) {
        if (!Array.isArray(decorators)) {
            throw new Error("Invalid Argument: decorators needs to be an array.");
        }

        if (sqlite == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a sqlite.");
        }

        if (databasePath == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a databasePath.");
        }

        if (edm == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a edm.");
        }

        this.decorators = decorators;
        this.databasePath = databasePath;
        this.sqlite = sqlite;
        this.edm = edm;
        this.name = this.edm.name;
        this.version = this.edm.version;
        this.tables = {};
        this.readyPromise = null;

        this._initializeAsync();
    }

    _createDatabaseAsync(edm) {
        let path = this.databasePath;

        return this.sqlite.open(path).then((sqliteDatabase) => {
            var database = new Database({
                edm: edm,
                sqliteDatabase: sqliteDatabase
            });

            return database;
        });
    }

    _initializeEdmAsync(edm) {
        let decoratedEdm = JSON.parse(JSON.stringify(edm));

        if (edm.isDecorated) {
            this.edm = this.decoratedEdm;
            return Promise.resolve(decoratedEdm);
        } else {
            return this._invokeOnDecoratorsAsync("prepareEdmAsync", [decoratedEdm]).then(() => decoratedEdm);
        }
    }

    _initializeAsync() {
        if (this.readyPromise == null) {
            let database = null;

            return this.readyPromise = this._initializeEdmAsync(this.edm).then((edm) => {
                this.edm = edm;
                let databasePromise = this._createDatabaseAsync(edm);

                if (!edm.isDecorated) {
                    databasePromise = databasePromise.then((newDatabase) => {
                        database = newDatabase;
                        return newDatabase.createAsync();
                    }).then(() => {
                        this.edm.isDecorated = true;
                    })
                }

                return databasePromise;
            }).then(() => {

                database.getTables().forEach((table) => {
                    this.tables[table.name] = new MetaTable({
                        table: table,
                        decorators: this.decorators
                    });
                });

            });
        }

        return this.readyPromise;
    }

    _invokeOnDecoratorsAsync(methodName, args) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then(() => {
                if (typeof decorator[methodName] === "function") {
                    let value = decorator[methodName].apply(decorator, args);
                    if (!(value instanceof Promise)) {
                        return Promise.resolve(value);
                    }
                    return value;
                }
            });

        }, Promise.resolve());
    }

    getTableAsync(name) {
        return this.readyPromise.then(() => {
            return this.tables[name] || null;
        })
    }

    getTablesAsync() {
        return this.readyPromise.then(() => {
            return Object.keys(this.tables).map((name) => {
                return this.tables[name];
            });
        });
    }

    initializeAsync() {
        return this.readyPromise;
    }

}