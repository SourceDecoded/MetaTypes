// SqliteDriver.js
import sqlite from "sqlite";
import path from "path";
import SqliteDatabase from "../sqlite/Database";

let generateCreateSql = function(){
    return `CREATE TABLE IF NOT EXISTS edm 
    ("id" INT PRIMARY KEY AUTOINCREMENT,
     "json" TEXT,
     "name" TEXT,
     "version" INT)`
};

export default class {

    constructor(options = {}) {
        if (typeof options.path !== "string") {
            throw new Error("SqliteDriver needs a path to the data folder");
        }

        options.edmDb = options.edmDb || "glassEDM.sqlite3";
        options.dataDb = options.dataDb || "data.sqlite3";

        this._edmDbPromise = null;
        this._dataDbPromise = null;

        this._storageMode = "file";
        this._storageModes = {
            "file": {
                getEdmDbAsync:() => {
                    return sqlite.open(path.resolve(options.path, options.edmDb));
                },
                getDataDbAsync:() => {
                    return sqlite.open(path.resolve(options.path, options.dataDb));
                }
            },
            "memory": {
                "getEdmDbAsync"(){
                    return sqlite.open(":memory:");
                },
                "getDataDbAsync"(){
                    return sqlite.open(":memory:");
                }
            }
        };

        if (options.path === ":memory:") {
            console.warn("SQLite using an in-memory databases, data will not persist");
        }

    }

    getEdmDbAsync() {
        if (!this._edmDbPromise) {
            this._edmDbPromise = this._storageModes[this._storageMode].getEdmDbAsync();
        }
        return this._edmDbPromise;
    }

    getDataDbAsync() {
        if (!this._dataDbPromise) {
            this._dataDbPromise = this._storageModes[this._storageMode].getDataDbAsync();
        }
        return this._dataDbPromise;
    }

    getDatabaseForEdmAsync(edm){
        return this.getDataDbAsync().then((db) => {
            return new SqliteDatabase({
                edm: edm,
                sqliteDatabase: db
            });
        });
    }

    getEdmListAsync() {
        return _verifyEdmTableAsync().then((db) => {
            return db.all(`SELECT * FROM edm`);
        });
    }

    _verifyEdmTableAsync() {
        return this.getEdmDbAsync().then((db) => {
            return db.run(generateCreateSql()).then(() => {
                return db;
            });
        });
    }

}