"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Table = require("./../sqlite/Table");

var _Table2 = _interopRequireDefault(_Table);

var _edm = require("./../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

var _sqlite = require("sqlite");

var _sqlite2 = _interopRequireDefault(_sqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var databaseFile = ":memory:";

exports["Table: addEntityAsync"] = function () {
    var table = new _Table2.default("Source", {
        edm: _edm2.default,
        sqliteDatabase: {
            run: function run(statement, values) {
                _assert2.default.equal(statement, 'INSERT INTO "Source" ("string") VALUES (?)');
                _assert2.default.equal(values[0], "Hello World");

                return Promise.resolve({ stmt: { lastID: 1 } });
            }
        }
    });

    table.addEntityAsync({ string: "Hello World" });
};

exports["Table.createAsync: Create a Source Table."] = function () {
    var table = new _Table2.default("Source", {
        edm: _edm2.default,
        sqliteDatabase: {
            exec: function exec(statement, values) {
                _assert2.default.equal(statement, 'CREATE TABLE IF NOT EXISTS "Source" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "string" TEXT, "number" NUMERIC, "date" NUMERIC, "boolean" NUMERIC, "float" REAL);CREATE INDEX IF NOT EXISTS "id" ON "Source" ("id")');
                return Promise.resolve(null);
            }
        }
    });

    table.createAsync();
};

exports["Table.createAsync: Create a Target Table."] = function () {
    var table = new _Table2.default("Foreign", {
        edm: _edm2.default,
        sqliteDatabase: {
            exec: function exec(statement, values) {
                _assert2.default.equal(statement, 'CREATE TABLE IF NOT EXISTS "Foreign" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "foreignKey" INTEGER, FOREIGN KEY ("foreignKey") REFERENCES "Source" ("id"));CREATE INDEX IF NOT EXISTS "foreignKey" ON "Foreign" ("foreignKey");CREATE INDEX IF NOT EXISTS "id" ON "Foreign" ("id")');
                return Promise.resolve(null);
            }
        }
    });

    table.createAsync();
};

exports["Table.asQueryable: Query off nested one to one."] = function () {

    return _sqlite2.default.open(":memory:").then(function (db) {

        var table = new _Table2.default("Source", {
            edm: _edm2.default,
            sqliteDatabase: db
        });

        return table.asQueryable().where(function (expBuilder) {
            return expBuilder.property("foreigner").property("string").isEqualTo("Hello World");
        }).toArrayAsync(function (results) {});
    });
};
//# sourceMappingURL=Table.js.map