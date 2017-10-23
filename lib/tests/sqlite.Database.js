"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Database = require("./../sqlite/Database");

var _Database2 = _interopRequireDefault(_Database);

var _edm = require("./../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

var _sqlite = require("sqlite");

var _sqlite2 = _interopRequireDefault(_sqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["Database._getTableBuildOrder"] = function () {

    _sqlite2.default.open(":memory:").then(function (db) {
        var database = new _Database2.default({
            edm: _edm2.default,
            sqliteDatabase: db
        });

        var buildOrder = database._getTableBuildOrder();
    });
};

exports["Database.createAsync"] = function () {

    return _sqlite2.default.open(":memory:").then(function (db) {
        var database = new _Database2.default({
            edm: _edm2.default,
            sqliteDatabase: db
        });

        return database.createAsync();
    });
};

exports["Database.addEntityAsync"] = function () {

    return _sqlite2.default.open(":memory:").then(function (db) {
        var database = new _Database2.default({
            edm: _edm2.default,
            sqliteDatabase: db
        });

        var table = database.getTable("Source");
        return database.createAsync().then(function () {
            return table.addEntityAsync({
                string: "Hello World",
                integer: 1
            });
        }).then(function (entity) {
            _assert2.default.equal(entity.id, 1);
            return table.asQueryable().where(function (expBuilder) {
                return expBuilder.property("string").isEqualTo("Hello World");
            }).toArrayAsync();
        }).then(function (result) {
            _assert2.default.equal(result[0].string, "Hello World");
        });
    });
};

exports["Database.updateEntityAsync"] = function () {

    return _sqlite2.default.open(":memory:").then(function (db) {
        var database = new _Database2.default({
            edm: _edm2.default,
            sqliteDatabase: db
        });

        var table = database.getTable("Source");

        return database.createAsync().then(function () {
            return table.addEntityAsync({
                string: "Hello World",
                integer: 1
            });
        }).then(function (entity) {
            return table.updateEntityAsync(entity, {
                string: "Hello World 2"
            });
        }).then(function (entity) {
            _assert2.default.equal(entity.string, "Hello World 2");
            return table.asQueryable().where(function (expBuilder) {
                return expBuilder.property("string").endsWith("World 2");
            }).toArrayAsync();
        }).then(function (results) {
            _assert2.default.equal(results.length, 1);
        });
    });
};

exports["Database.removeEntityAsync"] = function () {

    return _sqlite2.default.open(":memory:").then(function (db) {
        var database = new _Database2.default({
            edm: _edm2.default,
            sqliteDatabase: db
        });

        var table = database.getTable("Source");

        return database.createAsync().then(function () {
            return table.addEntityAsync({
                string: "Hello World",
                integer: 1
            });
        }).then(function (entity) {
            return table.removeEntityAsync(entity);
        }).then(function (entity) {
            _assert2.default.equal(entity.id, 1);

            return table.asQueryable().toArrayAsync();
        }).then(function (result) {
            _assert2.default.equal(result, 0);
        });
    });
};
//# sourceMappingURL=sqlite.Database.js.map