// SqliteDriver.js
import sqlite from "sqlite";
import path from "path";
import SqliteDatabase from "../sqlite/Database";

let generateCreateSql = function(){
    return `CREATE TABLE IF NOT EXISTS edm 
    ("id" INTEGER PRIMARY KEY AUTOINCREMENT,
     "json" TEXT,
     "name" TEXT,
     "version" INTEGER)`
};

/*
{
    storageMode: ["file" || "memory"]
    path: "path/to/data/dir/if/file",
    edmDb: "filenameIfFileMode.sqlite",
    dataDb: "filenameIfFileMode.sqlite"
}
*/

export default class {

    constructor(options = {}) {

        if (options.storageMode === "file" && typeof options.path !== "string") {
            throw new Error("SqliteDriver needs a path to the data folder");
        }

        options.edmDb = options.edmDb || "glassEDM.sqlite3";
        options.dataDb = options.dataDb || "data.sqlite3";
        options.storageMode = options.storageMode || "memory";

        this._edmDbPromise = null;
        this._dataDbPromise = null;

        this._storageMode = options.storageMode;
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

    getEdmAsync(name, version) {};

    addEdmAsync(name, version) {};

    deleteEdmAsync(name, version) {};

    getDatabaseForEdmAsync(edm){
        return this.getDataDbAsync().then((db) => {
            return new SqliteDatabase({
                edm: edm,
                sqliteDatabase: db
            });
        });
    }

    getEdmListAsync() {
        return this._verifyEdmTableAsync().then((db) => {
            return db.all(`SELECT * FROM edm`);
        });
    }

    dispose() {
        this.getEdmDbAsync().then((db) => {
            db.close();
        });
        this.getDataDbAsync().then((db) => {
            db.close();
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