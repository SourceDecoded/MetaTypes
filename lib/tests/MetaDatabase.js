"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _MetaDatabase = require("./../MetaDatabase");

var _MetaDatabase2 = _interopRequireDefault(_MetaDatabase);

var _Database = require("./../sqlite/Database");

var _Database2 = _interopRequireDefault(_Database);

var _edm = require("./../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

var _sqlite = require("sqlite");

var _sqlite2 = _interopRequireDefault(_sqlite);

var _GuestUser = require("./../GuestUser");

var _GuestUser2 = _interopRequireDefault(_GuestUser);

var _AdminUser = require("./../AdminUser");

var _AdminUser2 = _interopRequireDefault(_AdminUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = ":memory:";
var user = new _GuestUser2.default();
var admin = new _AdminUser2.default();

exports["MetaDatabase: prepareEdmAsync"] = function () {
    var hasCalledPrepareEdmAsync = false;

    var metaDatabase = new _MetaDatabase2.default({
        sqlite: _sqlite2.default,
        edm: _edm2.default,
        databasePath: path,
        decorators: [{
            prepareEdmAsync: function prepareEdmAsync() {
                hasCalledPrepareEdmAsync = true;
            }
        }]
    });

    return metaDatabase.initializeAsync().then(function () {
        _assert2.default.equal(hasCalledPrepareEdmAsync, true);
    });
};

exports["MetaDatabase: prepareEntityToBeAddedAsync, entityAddedAsync, validateEntityToBeAddedAsync."] = function () {
    var prepareEntityToBeAddedAsyncCount = 0;
    var entityAddedAsyncCount = 0;
    var validateEntityToBeAddedAsyncCount = 0;

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

    var metaDatabase = new _MetaDatabase2.default({
        sqlite: _sqlite2.default,
        edm: _edm2.default,
        databasePath: path,
        decorators: [decorator]
    });

    return metaDatabase.getTableAsync("Source").then(function (table) {
        return table.addEntityAsync(user, {
            string: "Hello World!",
            integer: 10
        });
    }).then(function () {
        return metaDatabase.getTableAsync("Foreign");
    }).then(function (table) {
        return table.addEntityAsync(user, {
            integer: 10
        });
    }).then(function () {
        _assert2.default.equal(prepareEntityToBeAddedAsyncCount, 1);
        _assert2.default.equal(entityAddedAsyncCount, 1);
        _assert2.default.equal(validateEntityToBeAddedAsyncCount, 1);
    });
};

exports["MetaDatabase: refineQueryable."] = function () {
    var decorator = {
        name: "Test",
        refineQueryableAsync: function refineQueryableAsync(user, queryable) {
            if (user.isAdmin) {
                return queryable;
            } else {
                return queryable.where(function (expBuilder) {
                    return expBuilder.property("number").isEqualTo(2);
                });
            }
        }
    };

    var metaDatabase = new _MetaDatabase2.default({
        sqlite: _sqlite2.default,
        edm: _edm2.default,
        databasePath: path,
        decorators: [decorator]
    });

    var table = null;

    return metaDatabase.getTableAsync("Source").then(function (t) {
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
//# sourceMappingURL=MetaDatabase.js.map