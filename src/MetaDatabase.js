import Database from "./sqlite/Database";
import MetaTable from "./MetaTable";
import path from "path";
import fileSystem from "fs";

export default class MetaDatabase {

    constructor({
        decorators = [],
        sqlite = null,
        databasePath = null,
        edm = null,
        fileSystem = null
         } = {}) {
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

        if (fileSystem == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a fileSystem.");
        }

        this.decorators = decorators;
        this.databasePath = databasePath;
        this.sqlite = sqlite;
        this.edm = edm;
        this.name = this.edm.name;
        this.version = this.edm.version;
        this.fileSystem = fileSystem;
        this.tables = {};
        this.readyPromise = null;

    }

    _assertInitialized() {
        if (this.readyPromise == null) {
            throw new Error("MetaDatabase isn't initialized yet. Invoke initializeAsync before invoking these methods.");
        }
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

        if (edm.isInitialized) {
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

                if (!edm.isInitialized) {
                    databasePromise = databasePromise.then((newDatabase) => {
                        database = newDatabase;
                        return newDatabase.createAsync();
                    }).then(() => {
                        this.edm.isInitialized = true;
                    })
                }

                return databasePromise;
            }).then(() => {

                return this.decorators.reduce((promise, decorator) => {
                    return promise.then(() => {
                        return this._invokeOnDecoratorsAsync("activatedAsync", [this]);
                    })
                }, Promise.resolve());

            }).then(() => {

                database.getTables().forEach((table) => {
                    this.tables[table.name] = new MetaTable({
                        table: table,
                        decorators: this.decorators,
                        fileSystem: this.fileSystem
                    });
                });

            });
        }

        return this.readyPromise;
    }

    _invokeMethodAsync(obj, methodName, args = []) {
        if (typeof obj[methodName] === "function") {
            let value = obj[methodName].apply(obj, args);
            if (!(value instanceof Promise)) {
                return Promise.resolve(value);
            }
            return value;
        }
        return Promise.resolve();
    }

    _invokeOnDecoratorsAsync(methodName, args) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then(() => {
                return this._invokeMethodAsync(decorator, methodName, args);
            });

        }, Promise.resolve());
    }

    addDecoratorAsync(decorator) {
        this.decorators.push(decorator);
        this._invokeMethodAsync(decorator, "activatedAsync", [this]);
    }

    removeDecoratorAsync(decorator) {
        let index = this.decorators.indexOf(decorator);

        if (index > -1) {
            this.decorators.splice(index, 1);

            this._invokeMethodAsync(decorator, "deactivatedAsync", [this]);
        }
    }

    getTableAsync(name) {
        this._assertInitialized();

        return this.readyPromise.then(() => {
            return this.tables[name] || null;
        });
    }

    getTablesAsync() {
        this._assertInitialized();

        return this.readyPromise.then(() => {
            return Object.keys(this.tables).map((name) => {
                return this.tables[name];
            });
        });
    }

    initializeAsync() {
        return this._initializeAsync();
    }

}