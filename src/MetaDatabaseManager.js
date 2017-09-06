import Database from "./sqlite/Database";
import MetaDatabase from "./MetaDatabase";

export default class MetaDatabaseManager {
    constructor({ decorators = [], edmDatabase = null, fileSystem = null, sqlite = null } = {}) {

        if (edmDatabase == null) {
            throw new Error("Null Argument exception: edmDatabase is needed to run MetaDatabaseManager.");
        }

        if (fileSystem == null) {
            throw new Error("Null Argument Excepetion: fileSystem is needed to run MetaDatabaseManager.");
        }

        this.edmDatabase = edmDatabase;
        this.decorators = decorators;
        this.fileSystem = fileSystem;
        this.sqlite = sqlite;
        this.metaDatabases = [];
        this.readyPromise = this._createMetaDatabasesAsync();
    }

    _createDatabaseAsync(edm) {
        let path = this._getPathForDatabase(edm.name, edm.version);

        this.sqlite.open(path).then((sqliteDatabase) => {
            var database = new Database({
                edm: edm,
                sqliteDatabase: sqliteDatabase
            });

            return database;
        });
    }

    _createMetaDatabasesAsync(edm) {
        return this.getAllEdmsAsync().then((edms) => {
            return edms.forEach((edm) => {
                this._createDatabaseAsync(edm).then((database) => {
                    let metaDatabase = new MetaDatabase({
                        database: database,
                        decorators: this.decorators
                    });

                    this.metaDatabases.push(metaDatabase);
                });
            });
        });
    }

    _decorateEdmAsync(edm) {
        this._invokeOnDecoratorsAsync("prepareEdmAsync", [edm]);
    }

    _getPathForDatabase(name, version) {
        return `${name}_${version}`;
    }

    _invokeOnDecoratorsAsync(methodName, args) {
        return this.decorators.reduce((promise, decorator) => {
            promise.then(() => {
                if (typeof decorator[methodName] === "function") {
                    return decorator[methodName].apply(decorator, args);
                }
            });

        }, Promise.resolve());
    }

    addDatabaseAsync(edm) {
        let path = this._getPathForDatabase(edm);

        this.fileSystem.access(path, this.fileSystem.constants.F_OK).then(() => {
            throw new Error("Database already exists.");
        }).then(() => {
            let originalEdm = JSON.stringify(edm);
            return this._decorateEdmAsync(edm);
        }).then(() => {
            return this._createDatabaseAsync(edm);
        }).then((database) => {
            return database.createAsync().then(() => database);
        }).then((database) => {
            let metaDatabase = new MetaDatabase({
                database: database,
                decorators: this.decorators
            });

            this.metaDatabases.push(metaDatabase);
        });
    }

    getAllEdmsAsync() {
        return this.getAllDatabaseInformationAsync().then((results) => {
            return results.map((information) => {
                return JSON.parse(information.decoratedEdm);
            });
        });
    }

    getDatabaseAsync(name, version) {
        return this.readyPromise.then(() => {
            return this.metaDatabases.find((metaDatabase) => {
                return metaDatabase.name === name && metaDatabase.version === version;
            });
        });
    }

    getEdmAsync(name, version) {
        return this.getDatabaseInformationAsync(name, version).toArrayAsync((result) => {
            if (result == null) {
                return null;
            } else {
                return JSON.parse(result.decoratedEdm);
            }
        });
    }

    getAllDatabaseInformationAsync() {
        return this.edmDatabase.getTable("Edm").asQueryable().toArrayAsync();
    }

    getDatabaseInformationAsync(name, version) {
        return this.edmDatabase.getTable("Edm").asQueryable().where((expBuilder) => {
            return expBuilder.and(
                expBuilder.property("name").isEqualTo(name),
                expBuilder.property("version").isEqualTo(version)
            );
        }).toArrayAsync((results) => {
            return results[0] || null;
        });
    }

    removeDatabaseAsync(name, version) {
        return this.readyPromise.then(() => {
            let removeInformationPromise = this.edmDatabase.getTable("Edm").asQueryable().where((expBuilder) => {
                return expBuilder.and(
                    expBuilder.property("name").isEqualTo(name),
                    expBuilder.property("version").isEqualTo(version)
                );
            }).toArrayAsync().then((results) => {
                if (results.length === 0) {
                    throw new Error(`Couldn't find database information for ${name}:${version}.`);
                }
                return this.edmDatabase.removeEntity(results[0]);
            });

            let removeDatabaseFilePromise = this.fileSystem.unlink(this._getPathForDatabase(name, version));

            return Promise.all([removeInformationPromise, removeDatabaseFilePromise]);
        });
    }

}