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

    _createMetaDatabasesAsync(edm) {
        return this.getAllEdmsAsync().then((edms) => {
            return edms.reduce((promise, edm) => {
                return promise.then(() => {
                    let metaDatabase = new MetaDatabase({
                        edm: edm,
                        sqlite: this.sqlite,
                        databasePath: this._getPathForDatabase(edm.name, edm.version),
                        decorators: this.decorators
                    });

                    return metaDatabase.initializeAsync();
                })
            }, Promise.resolve());
        });
    }

    _getPathForDatabase(name, version) {
        return `${name}_${version}`;
    }

    addDatabaseAsync(user, edm) {
        let path = this._getPathForDatabase(edm.name, edm.version);

        this.fileSystem.access(path, this.fileSystem.constants.F_OK).then(() => {
            throw new Error("Database already exists.");
        }).then(() => {
            let metaDatabase = new MetaDatabase({
                database: database,
                decorators: this.decorators
            });

            this.metaDatabases.push(metaDatabase);

            return metaDatabase.initializeAsync().then(() => {
                return metaDatabase;
            });
        }).then((metaDatabase) => {
            return this.edmDatabase.getTable("Edm").addEntityAsync({
                name: edm.name,
                version: edm.version,
                edm: edm,
                decoratedEdm: metaDatabase.edm,
                createdBy: user.id
            });
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

    removeDatabaseAsync(user, name, version) {
        return this.readyPromise.then(() => {
            return this.edmDatabase.getTable("Edm").asQueryable().where((expBuilder) => {
                return expBuilder.and(
                    expBuilder.property("name").isEqualTo(name),
                    expBuilder.property("version").isEqualTo(version)
                );
            }).toArrayAsync().then((results) => {
                var information = results[0];

                if (information == 0) {
                    throw new Error(`Couldn't find database information for ${name}:${version}.`);
                }

                if (information.createdBy !== user.id) {
                    throw new Error("You do not have permission to delete this database.");
                }

                return Promise.all([
                    this.edmDatabase.removeEntityAsync(information),
                    this.fileSystem.unlink(this._getPathForDatabase(name, version))
                ]);
            });

        });
    }

}