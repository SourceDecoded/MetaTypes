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

exports["MetaDatabase: prepareEntityToBeUpdatedAsync, entityUpdatedAsync, validateEntityToBeUpdatedAsync."] = () => {
    let prepareEntityToBeUpdatedAsyncCount = 0;
    let entityUpdatedAsyncCount = 0;
    let validateEntityToBeUpdatedAsyncCount = 0;

    let decorator = {
        name: "Test",
        prepareEntityToBeUpdatedAsync(user, entity, delta, options) {
            assert.equal(options.option1, true);
            prepareEntityToBeUpdatedAsyncCount++;
            return Promise.resolve();
        },
        entityUpdatedAsync(user, entity, delta, options) {
            assert.equal(options.option1, true);
            entityUpdatedAsyncCount++;
        },
        validateEntityToBeUpdatedAsync(user, entity, delta, options) {
            assert.equal(options.option1, true);
            validateEntityToBeUpdatedAsyncCount++;
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
    }).then((entity) => {
        return table.updateEntityAsync(entity, { string: "Hello World 2" });
    }).then(() => {
        assert.equal(prepareEntityToBeUpdatedAsyncCount, 1);
        assert.equal(entityUpdatedAsyncCount, 1);
        assert.equal(validateEntityToBeUpdatedAsyncCount, 1);
    });

}

exports["MetaDatabase: prepareEntityToBeUpdatedAsync, entityUpdatedAsync, validateEntityToBeUpdatedAsync."] = () => {
    let prepareEntityToBeUpdatedAsyncCount = 0;
    let entityUpdatedAsyncCount = 0;
    let validateEntityToBeUpdatedAsyncCount = 0;

    let decorator = {
        name: "Test",
        prepareEntityToBeUpdatedAsync(user, entity, delta, options) {
            assert.equal(options.option1, true);
            prepareEntityToBeUpdatedAsyncCount++;
            return Promise.resolve();
        },
        entityUpdatedAsync(user, entity, delta, options) {
            assert.equal(options.option1, true);
            entityUpdatedAsyncCount++;
        },
        validateEntityToBeUpdatedAsync(user, entity, delta, options) {
            assert.equal(options.option1, true);
            validateEntityToBeUpdatedAsyncCount++;
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
    }).then((entity) => {
        return table.updateEntityAsync(user, entity, { string: "Hello World 2" });
    }).then(() => {
        assert.equal(prepareEntityToBeUpdatedAsyncCount, 1);
        assert.equal(entityUpdatedAsyncCount, 1);
        assert.equal(validateEntityToBeUpdatedAsyncCount, 1);
    });

}

exports["MetaDatabase: approveEntityToBeRemovedAsync, entityRemovedAsync."] = () => {
    let approveEntityToBeRemovedAsyncCount = 0;
    let entityRemovedAsyncCount = 0;

    let decorator = {
        name: "Test",
        approveEntityToBeRemovedAsync(user, entity, options) {
            assert.equal(options.option1, true);
            approveEntityToBeRemovedAsyncCount++;
            return Promise.resolve();
        },
        entityRemovedAsync(user, entity, options) {
            assert.equal(options.option1, true);
            entityRemovedAsyncCount++;
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
    }).then((entity) => {
        return table.removeEntityAsync(user, entity);
    }).then(() => {
        assert.equal(approveEntityToBeRemovedAsyncCount, 1);
        assert.equal(entityRemovedAsyncCount, 1);
    });

}

exports["MetaDatabase: refineQueryableAsync."] = () => {
    let decorator = {
        name: "Test",
        refineQueryableAsync(user, queryable, options) {
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