"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Database = require("./../meta/Database");

var _Database2 = _interopRequireDefault(_Database);

var _Database3 = require("./../sqlite/Database");

var _Database4 = _interopRequireDefault(_Database3);

var _edm = require("./../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

var _sqlite = require("sqlite");

var _sqlite2 = _interopRequireDefault(_sqlite);

var _Guest = require("./../user/Guest");

var _Guest2 = _interopRequireDefault(_Guest);

var _Admin = require("./../user/Admin");

var _Admin2 = _interopRequireDefault(_Admin);

var _FileSystem = require("./../mock/FileSystem");

var _FileSystem2 = _interopRequireDefault(_FileSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = ":memory:";
var user = new _Guest2.default();
var admin = new _Admin2.default();

exports["MetaDatabase: prepareEntityToBeAddedAsync, entityAddedAsync, validateEntityToBeAddedAsync."] = function () {
    var prepareEntityToBeAddedAsyncCount = 0;
    var entityAddedAsyncCount = 0;
    var validateEntityToBeAddedAsyncCount = 0;
    var fileSystem = new _FileSystem2.default();

    var decorator = {
        name: "Test",
        prepareEntityToBeAddedAsync: function prepareEntityToBeAddedAsync(user, entity, options) {
            _assert2.default.equal(options.option1, true);
            prepareEntityToBeAddedAsyncCount++;
            return Promise.resolve();
        },
        entityAddedAsync: function entityAddedAsync(user, entity, options) {
            _assert2.default.equal(options.option1, true);
            entityAddedAsyncCount++;
        },
        validateEntityToBeAddedAsync: function validateEntityToBeAddedAsync(user, entity, options) {
            _assert2.default.equal(options.option1, true);
            validateEntityToBeAddedAsyncCount++;
        }
    };

    return _sqlite2.default.open(path).then(function (sqliteDatabase) {
        var database = new _Database4.default({
            edm: _edm2.default,
            sqliteDatabase: sqliteDatabase
        });

        var metaDatabase = new _Database2.default({
            fileSystem: fileSystem,
            database: database,
            decorators: [decorator]
        });

        var table = metaDatabase.getTable("Source");

        return table.addEntityAsync(user, {
            string: "Hello World!",
            integer: 10
        }).then(function () {
            var table = metaDatabase.getTable("Foreign");
            return table.addEntityAsync(user, {
                integer: 10
            });
        }).then(function () {
            _assert2.default.equal(prepareEntityToBeAddedAsyncCount, 1);
            _assert2.default.equal(entityAddedAsyncCount, 1);
            _assert2.default.equal(validateEntityToBeAddedAsyncCount, 1);
        });
    });
};

exports["MetaDatabase: prepareEntityToBeUpdatedAsync, entityUpdatedAsync, validateEntityToBeUpdatedAsync."] = function () {
    var prepareEntityToBeUpdatedAsyncCount = 0;
    var entityUpdatedAsyncCount = 0;
    var validateEntityToBeUpdatedAsyncCount = 0;
    var fileSystem = new _FileSystem2.default();

    var decorator = {
        name: "Test",
        prepareEntityToBeUpdatedAsync: function prepareEntityToBeUpdatedAsync(user, entity, delta, options) {
            _assert2.default.equal(options.option1, true);
            prepareEntityToBeUpdatedAsyncCount++;
            return Promise.resolve();
        },
        entityUpdatedAsync: function entityUpdatedAsync(user, entity, delta, options) {
            _assert2.default.equal(options.option1, true);
            entityUpdatedAsyncCount++;
        },
        validateEntityToBeUpdatedAsync: function validateEntityToBeUpdatedAsync(user, entity, delta, options) {
            _assert2.default.equal(options.option1, true);
            validateEntityToBeUpdatedAsyncCount++;
        }
    };

    var metaDatabase = new _Database2.default({
        fileSystem: fileSystem,
        sqlite: _sqlite2.default,
        edm: _edm2.default,
        databasePath: path,
        decorators: [decorator]
    });

    var table = null;

    return metaDatabase.initializeAsync().then(function () {
        return metaDatabase.getTableAsync("Source");
    }).then(function (t) {
        table = t;
        return table.addEntityAsync(user, {
            string: "Hello World!",
            integer: 10
        });
    }).then(function (entity) {
        return table.updateEntityAsync(entity, { string: "Hello World 2" });
    }).then(function () {
        _assert2.default.equal(prepareEntityToBeUpdatedAsyncCount, 1);
        _assert2.default.equal(entityUpdatedAsyncCount, 1);
        _assert2.default.equal(validateEntityToBeUpdatedAsyncCount, 1);
    });
};

exports["MetaDatabase: prepareEntityToBeUpdatedAsync, entityUpdatedAsync, validateEntityToBeUpdatedAsync."] = function () {
    var prepareEntityToBeUpdatedAsyncCount = 0;
    var entityUpdatedAsyncCount = 0;
    var validateEntityToBeUpdatedAsyncCount = 0;
    var fileSystem = new _FileSystem2.default();

    var decorator = {
        name: "Test",
        prepareEntityToBeUpdatedAsync: function prepareEntityToBeUpdatedAsync(type, entity, delta, options) {
            _assert2.default.equal(options.option1, true);
            prepareEntityToBeUpdatedAsyncCount++;
            return Promise.resolve();
        },
        entityUpdatedAsync: function entityUpdatedAsync(type, entity, delta, options) {
            _assert2.default.equal(options.option1, true);
            entityUpdatedAsyncCount++;
        },
        validateEntityToBeUpdatedAsync: function validateEntityToBeUpdatedAsync(type, entity, delta, options) {
            _assert2.default.equal(options.option1, true);
            validateEntityToBeUpdatedAsyncCount++;
        }
    };

    var metaDatabase = new _Database2.default({
        fileSystem: fileSystem,
        sqlite: _sqlite2.default,
        edm: _edm2.default,
        databasePath: path,
        decorators: [decorator]
    });

    var table = null;

    return metaDatabase.initializeAsync().then(function () {
        return metaDatabase.getTableAsync("Source");
    }).then(function (t) {
        table = t;
        return table.addEntityAsync(user, {
            string: "Hello World!",
            integer: 10
        });
    }).then(function (entity) {
        return table.updateEntityAsync(user, entity, { string: "Hello World 2" });
    }).then(function () {
        _assert2.default.equal(prepareEntityToBeUpdatedAsyncCount, 1);
        _assert2.default.equal(entityUpdatedAsyncCount, 1);
        _assert2.default.equal(validateEntityToBeUpdatedAsyncCount, 1);
    });
};

exports["MetaDatabase: approveEntityToBeRemovedAsync, entityRemovedAsync."] = function () {
    var approveEntityToBeRemovedAsyncCount = 0;
    var entityRemovedAsyncCount = 0;
    var fileSystem = new _FileSystem2.default();

    var decorator = {
        name: "Test",
        approveEntityToBeRemovedAsync: function approveEntityToBeRemovedAsync(user, entity, options) {
            _assert2.default.equal(options.option1, true);
            approveEntityToBeRemovedAsyncCount++;
            return Promise.resolve();
        },
        entityRemovedAsync: function entityRemovedAsync(user, entity, options) {
            _assert2.default.equal(options.option1, true);
            entityRemovedAsyncCount++;
        }
    };

    var metaDatabase = new _Database2.default({
        fileSystem: fileSystem,
        sqlite: _sqlite2.default,
        edm: _edm2.default,
        databasePath: path,
        decorators: [decorator]
    });

    var table = null;

    return metaDatabase.initializeAsync().then(function () {
        return metaDatabase.getTableAsync("Source");
    }).then(function (t) {
        table = t;
        return table.addEntityAsync(user, {
            string: "Hello World!",
            integer: 10
        });
    }).then(function (entity) {
        return table.removeEntityAsync(user, entity);
    }).then(function () {
        _assert2.default.equal(approveEntityToBeRemovedAsyncCount, 1);
        _assert2.default.equal(entityRemovedAsyncCount, 1);
    });
};

exports["MetaDatabase: activatedAsync."] = function () {
    var activatedAsyncCount = 0;
    var fileSystem = new _FileSystem2.default();

    var decorator = {
        name: "Test",
        activatedAsync: function activatedAsync(metaDatabase) {
            _assert2.default.equal(metaDatabase != null, true);
            activatedAsyncCount++;
        }
    };

    var metaDatabase = new _Database2.default({
        fileSystem: fileSystem,
        sqlite: _sqlite2.default,
        edm: _edm2.default,
        databasePath: path,
        decorators: [decorator]
    });

    var table = null;

    return metaDatabase.initializeAsync().then(function () {
        return metaDatabase.getTableAsync("Source");
    }).then(function () {
        _assert2.default.equal(activatedAsyncCount, 1);
    });
};

exports["MetaDatabase: file life cycle."] = function () {
    var fileSystem = new _FileSystem2.default();
    var fileUpdatedAsyncCount = 0;
    var fileRemovedAsyncCount = 0;
    var fileContent = "This is a file.";
    var table = void 0;
    var id = void 0;

    var decorator = {
        name: "Test",
        fileUpdatedAsync: function fileUpdatedAsync(id, filePath) {
            fileUpdatedAsyncCount++;
        },
        fileRemovedAsync: function fileRemovedAsync(id, filePath) {
            fileRemovedAsyncCount++;
        }
    };

    var metaDatabase = new _Database2.default({
        fileSystem: fileSystem,
        sqlite: _sqlite2.default,
        edm: _edm2.default,
        databasePath: path,
        decorators: [decorator]
    });

    return metaDatabase.initializeAsync().then(function () {
        return metaDatabase.getTableAsync("Source");
    }).then(function (t) {
        table = t;
        return table.addEntityAsync(user, {
            string: "Hello World!"
        });
    }).then(function (entity) {
        id = entity.id;
        return table.getFileWriteStreamByIdAsync(user, id);
    }).then(function (stream) {
        stream.write(fileContent);
        stream.end();
    }).then(function () {
        return table.getFileReadStreamByIdAsync(user, id);
    }).then(function (stream) {
        return new Promise(function (resolve, reject) {
            var data = "";

            stream.on("data", function (d) {
                data += d;
            });
            stream.on("end", function () {
                resolve(data);
            });
        });
    }).then(function (data) {
        _assert2.default.equal(fileUpdatedAsyncCount, 1);
        _assert2.default.equal(data, fileContent);
    }).then(function () {
        return table.removeFileByIdAsync(user, id);
    }).then(function () {
        _assert2.default.equal(fileRemovedAsyncCount, 1);
    });
};

exports["MetaDatabase: refineQueryableAsync."] = function () {
    var fileSystem = new _FileSystem2.default();
    var decorator = {
        name: "Test",
        refineQueryableAsync: function refineQueryableAsync(user, queryable, options) {
            if (user.isAdmin) {
                return queryable;
            } else {
                return queryable.where(function (expBuilder) {
                    return expBuilder.property("number").isEqualTo(2);
                });
            }
        }
    };

    var metaDatabase = new _Database2.default({
        fileSystem: fileSystem,
        sqlite: _sqlite2.default,
        edm: _edm2.default,
        databasePath: path,
        decorators: [decorator]
    });

    var table = null;

    return metaDatabase.initializeAsync().then(function () {
        return metaDatabase.getTableAsync("Source");
    }).then(function (t) {
        table = t;

        return table.addEntityAsync(user, {
            string: "Hello World!",
            integer: 10
        });
    }).then(function () {
        return table.asQueryable(user).where(function (expBuilder) {
            return expBuilder.property("string").isEqualTo("Hello World!");
        }).toArrayAsync();
    }).then(function (results) {
        _assert2.default.equal(results.length, 0);
    }).then(function () {
        return table.asQueryable(admin).where(function (expBuilder) {
            return expBuilder.property("string").isEqualTo("Hello World!");
        }).toArrayAsync();
    }).then(function (results) {
        _assert2.default.equal(results.length, 1);
    });
};
//# sourceMappingURL=meta.Database.js.map