import Database from "./sqlite/Database";
import MetaTables from "./MetaTables";

export default class MetaDatabase {

    constructor(options = {}) {
        this.sqlite = options.sqlite;
        this.sqliteFile = options.sqliteFile;
        this.edm = options.edm;
        this.sqliteDatabase = null;
        this.initializedPromise = null;
        this.tables = [];
    }

    _assertIsInitialized() {
        if (this.sqliteDatabase === null) {
            throw new Error("MetaDatabase needs to be initilaized before anything else.");
        }
    }


    getTable(name) {
        this._assertIsInitialized();
    }

    initializeAsync() {
        if (this.initializedPromise == null) {
            this.initializedPromise = this.sqlite.open(this.sqliteFile).then((sqliteDatabase) => {

                this.sqliteDatabase = new Database({
                    edm: this.edm,
                    sqliteDatabase: sqliteDatabase
                });

                

            });
        }

        return this.initializedPromise;

    }


}