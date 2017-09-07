import assert from "assert";
import MetaDatabase from "./../MetaDatabase";
import Database from "./../sqlite/Database";
import edm from "./../mock/edm";
import sqlite from "sqlite";
import GuestUser from "./../GuestUser";
import AdminUser from "./../AdminUser";

let path = ":memory:";
let user = new GuestUser();
let admin = new AdminUser();

exports["MetaDatabase: prepareEdmAsync"] = () => {
    let hasCalledPrepareEdmAsync = false;

    let metaDatabase = new MetaDatabase({
        sqlite: sqlite,
        edm: edm,
        databasePath: path,
        decorators: [{
            prepareEdmAsync: () => {
                hasCalledPrepareEdmAsync = true;
            }
        }]
    });

    return metaDatabase.initializeAsync().then(() => {
        assert.equal(hasCalledPrepareEdmAsync, true);
    });

}

exports["MetaDatabase: prepareEntityToBeAddedAsync, entityAddedAsync, validateEntityToBeAddedAsync."] = () => {
    let prepareEntityToBeAddedAsyncCount = 0;
    let entityAddedAsyncCount = 0;
    let validateEntityToBeAddedAsyncCount = 0;

    let decorator = {
        name: "Test",
        prepareEntityToBeAddedAsync(user, entity, options) {
            assert.equal(options.option1, true);
            prepareEntityToBeAddedAsyncCount++;
            return Promise.resolve();
        },
        entityAddedAsync(user, entity, options) {
            assert.equal(options.option1, true);
            entityAddedAsyncCount++;
        },
        validateEntityToBeAddedAsync(user, entity, options) {
            assert.equal(options.option1, true);
            validateEntityToBeAddedAsyncCount++;
        }
    };

    let metaDatabase = new MetaDatabase({
        sqlite: sqlite,
        edm: edm,
        databasePath: path,
        decorators: [decorator]
    });

    return metaDatabase.getTableAsync("Source").then((table) => {
        return table.addEntityAsync(user, {
            string: "Hello World!",
            integer: 10
        });
    }).then(() => {
        return metaDatabase.getTableAsync("Foreign");
    }).then((table) => {
        return table.addEntityAsync(user, {
            integer: 10
        });
    }).then(() => {
        assert.equal(prepareEntityToBeAddedAsyncCount, 1);
        assert.equal(entityAddedAsyncCount, 1);
        assert.equal(validateEntityToBeAddedAsyncCount, 1);
    });

}

exports["MetaDatabase: refineQueryable."] = () => {
    let decorator = {
        name: "Test",
        refineQueryableAsync(user, queryable) {
            if (user.isAdmin) {
                return queryable;
            } else {
                return queryable.where((expBuilder) => {
                    return expBuilder.property("number").isEqualTo(2);
                });
            }
        }
    };

    let metaDatabase = new MetaDatabase({
        sqlite: sqlite,
        edm: edm,
        databasePath: path,
        decorators: [decorator]
    });

    let table = null;

    return metaDatabase.getTableAsync("Source").then((t) => {
        table = t;

        return table.addEntityAsync(user, {
            string: "Hello World!",
            integer: 10
        });
    }).then(() => {
        return table.asQueryable(user).where((expBuilder) => {
            return expBuilder.property("string").isEqualTo("Hello World!");
        }).toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 0);
    }).then(() => {
        return table.asQueryable(admin).where((expBuilder) => {
            return expBuilder.property("string").isEqualTo("Hello World!");
        }).toArrayAsync();
    }).then((results) => {
        assert.equal(results.length, 1);
    });

}