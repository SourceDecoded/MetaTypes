"use strict";

var _Runner = require("./../migration/Runner");

var _Runner2 = _interopRequireDefault(_Runner);

var _Edm = require("./../edm/Edm");

var _Edm2 = _interopRequireDefault(_Edm);

var _Migrator = require("./../edm/Migrator");

var _Migrator2 = _interopRequireDefault(_Migrator);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _CommandBuilder = require("./../migration/CommandBuilder");

var _CommandBuilder2 = _interopRequireDefault(_CommandBuilder);

var _Command = require("./../migration/Command");

var _Command2 = _interopRequireDefault(_Command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandBuilder = new _CommandBuilder2.default();

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

    var command = commandBuilder.createAddTableCommand({
        name: "Person",
        label: "Person",
        pluralLabel: "People"
    });

    return runner.migrateAsync([command]).then(function () {
        _assert2.default.equal(edm.tables.length, 1);
        _assert2.default.equal(edm.tables[0].name, "Person");
        _assert2.default.equal(edm.tables[0].label, "Person");
        _assert2.default.equal(edm.tables[0].pluralLabel, "People");
        _assert2.default.equal(addTableAsyncCount, 1);
    });
};

exports["migration.Runner.migrateAction: addTableAsync and addColumnAsync"] = function () {
    var addTableAsyncCount = 0;
    var addColumnAsyncCount = 0;

    var edm = new _Edm2.default();
    edm.name = "Test";
    edm.label = "Test";
    edm.version = "0.0.1";

    var migrator = {
        name: "mockMigrator",
        addTableAsync: function addTableAsync() {
            addTableAsyncCount++;
        },
        addColumnAsync: function addColumnAsync() {
            addColumnAsyncCount++;
        }
    };

    var runner = new _Runner2.default({
        edm: edm,
        migrator: migrator
    });

    var tableCommand = commandBuilder.createAddTableCommand({
        name: "Person",
        label: "Person",
        pluralLabel: "People"
    });

    var columnCommand = commandBuilder.createAddColumnCommand("Person", {
        type: "Integer",
        name: "id",
        label: "Identifier",
        isPrimaryKey: true
    });

    return runner.migrateAsync([tableCommand, columnCommand]).then(function () {
        _assert2.default.equal(edm.tables.length, 1);
        _assert2.default.equal(addTableAsyncCount, 1);
        _assert2.default.equal(addColumnAsyncCount, 1);

        var personTable = edm.tables[0];
        var idColumn = personTable.columns[0];

        _assert2.default.equal(personTable.name, "Person");
        _assert2.default.equal(personTable.label, "Person");
        _assert2.default.equal(personTable.pluralLabel, "People");
        _assert2.default.equal(idColumn.name, "id");
        _assert2.default.equal(idColumn.label, "Identifier");
    });
};

exports["migration.Runner.migrateAction: addTableAsync, addColumnAsync and with a invalid action and successfully rollback."] = function () {
    var addTableAsyncCount = 0;
    var addColumnAsyncCount = 0;

    var edm = new _Edm2.default();
    edm.name = "Test";
    edm.label = "Test";
    edm.version = "0.0.1";

    var migrator = {
        name: "mockMigrator",
        addTableAsync: function addTableAsync() {
            addTableAsyncCount++;
        },
        addColumnAsync: function addColumnAsync() {
            addColumnAsyncCount++;
        },
        removeTableAsync: function removeTableAsync() {
            addTableAsyncCount--;
        },
        removeColumnAsync: function removeColumnAsync() {
            addColumnAsyncCount--;
        }
    };

    var runner = new _Runner2.default({
        edm: edm,
        migrator: migrator
    });

    var tableCommand = commandBuilder.createAddTableCommand({
        name: "Person",
        label: "Person",
        pluralLabel: "People"
    });

    var columnCommand = commandBuilder.createAddColumnCommand("Person", {
        type: "Integer",
        name: "id",
        label: "Identifier",
        isPrimaryKey: true
    });

    var invalidCommand = new _Command2.default();
    invalidCommand.execute.action = "badAction";
    invalidCommand.revert.action = "anotherBadAction";

    return runner.migrateAsync([tableCommand, columnCommand, invalidCommand]).then(function () {
        _assert2.default.ok(false, "Supposed to fail with invalid action.");
    }).catch(function (error) {
        _assert2.default.equal(edm.tables.length, 0);
        _assert2.default.equal(addTableAsyncCount, 0);
        _assert2.default.equal(addColumnAsyncCount, 0);
    });
};
//# sourceMappingURL=migration.Runner.js.map