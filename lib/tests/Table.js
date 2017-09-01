"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Table = require("./../sqlite/Table");

var _Table2 = _interopRequireDefault(_Table);

var _edm = require("./../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["Table: addEntityAsync"] = function () {
    var table = new _Table2.default("Source", {
        edm: _edm2.default,
        sqlite: {
            run: function run(statement, values) {
                _assert2.default.equal(statement, 'INSERT INTO "Source" ("string") VALUES (?)');
                _assert2.default.equal(values[0], "Hello World");

                return Promise.resolve({ lastID: 1 });
            }
        }
    });

    table.addEntityAsync({ string: "Hello World" });
};

exports["Table.createAsync: Create a Source Table."] = function () {
    var table = new _Table2.default("Source", {
        edm: _edm2.default,
        sqlite: {
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
        sqlite: {
            exec: function exec(statement, values) {
                _assert2.default.equal(statement, 'CREATE TABLE IF NOT EXISTS "Foreign" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "foreignKey" INTEGER, FOREIGN KEY ("foreignKey") REFERENCES "Source" ("id"));CREATE INDEX IF NOT EXISTS "id" ON "Foreign" ("id");CREATE INDEX IF NOT EXISTS "foreignKey" ON "Foreign" ("foreignKey")');
                return Promise.resolve(null);
            }
        }
    });

    table.createAsync();
};
//# sourceMappingURL=Table.js.map