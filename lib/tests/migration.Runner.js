"use strict";

var _Runner = require("./../migration/Runner");

var _Runner2 = _interopRequireDefault(_Runner);

var _Edm = require("./../edm/Edm");

var _Edm2 = _interopRequireDefault(_Edm);

var _Migrator = require("./../edm/Migrator");

var _Migrator2 = _interopRequireDefault(_Migrator);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Command = require("./../migration/Command");

var _Command2 = _interopRequireDefault(_Command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["migration.Runner.constructor: empty options"] = function () {
    _assert2.default.throws(function () {
        var runner = new _Runner2.default();
    });
};

exports["migration.Runner.constructor: null edm."] = function () {
    _assert2.default.throws(function () {
        var runner = new _Runner2.default({
            edm: null
        });
    });
};

exports["migration.Runner.constructor: Invalid Migrator."] = function () {
    var edm = new _Edm2.default();
    edm.name = "Test";
    edm.version = "0.0.1";

    _assert2.default.throws(function () {
        var runner = new _Runner2.default({
            edm: edm,
            migrator: {
                name: null
            }
        });
    });
};

exports["migration.Runner.migrateAction: addTableAsync"] = function () {
    var addTableAsyncCount = 0;

    var edm = new _Edm2.default();
    edm.name = "Test";
    edm.label = "Test";
    edm.version = "0.0.1";

    var migrator = {
        name: "mockMigrator",
        addTableAsync: function addTableAsync() {
            addTableAsyncCount++;
        }
    };

    var runner = new _Runner2.default({
        edm: edm,
        migrator: migrator
    });

    var command = new _Command2.default();
    command.execute.action = "addTable";
    command.execute.options = {
        name: "TestTable",
        label: "Test Table",
        pluralLabel: "Test Tables"
    };

    command.revert.action = "removeTable";
    command.revert.options = {
        name: "TestTable",
        label: "Test Table",
        pluralLabel: "Test Tables"
    };

    return runner.migrateAsync([command]).then(function () {
        _assert2.default.equal(edm.tables.length, 1);
        _assert2.default.equal(edm.tables[0].name, "TestTable");
        _assert2.default.equal(addTableAsyncCount, 1);
    });
};
//# sourceMappingURL=migration.Runner.js.map