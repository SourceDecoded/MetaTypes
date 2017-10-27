"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Migrator = require("../mssql/Migrator");

var _Migrator2 = _interopRequireDefault(_Migrator);

var _edm = require("../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

var _MsSqlPool = require("../mock/MsSqlPool");

var _MsSqlPool2 = _interopRequireDefault(_MsSqlPool);

var _CommandBuilder = require("../migration/CommandBuilder");

var _CommandBuilder2 = _interopRequireDefault(_CommandBuilder);

var _Database = require("../mssql/Database");

var _Database2 = _interopRequireDefault(_Database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["mssql.Migrator.addColumnAsync string"] = function () {
    var pool = new _MsSqlPool2.default();
    var iDb = new _Database2.default({
        connectionPool: pool,
        edm: _edm2.default,
        schema: "dbo"
    });

    var migrator = new _Migrator2.default(iDb);
    var builder = new _CommandBuilder2.default();
    var column = {
        "type": "String",
        "name": "newColumn",
        "label": "New Column"
    };
    var command = builder.createAddColumnCommand("Source", column);
    migrator.addColumnAsync(_edm2.default, command.execute.options).then(function () {
        var query = pool.query;
        _assert2.default.equal(query, "ALTER TABLE [dbo].[Source__0_0_1] ADD [newColumn] ntext");
    });
};

exports["mssql.Migrator.addTableAsync"] = function () {
    var pool = new _MsSqlPool2.default();
    var iDb = new _Database2.default({
        connectionPool: pool,
        edm: _edm2.default,
        schema: "dbo"
    });

    var migrator = new _Migrator2.default(iDb);
    var builder = new _CommandBuilder2.default();
    var table = {
        "name": "testTable",
        "label": "Test",
        "pluralLabel": "Tests",
        "columns": [{
            "type": "Integer",
            "name": "id",
            "label": "Identifier",
            "isPrimaryKey": true,
            "isAutoIncrement": true,
            "isNullable": false
        }, {
            "type": "String",
            "name": "string",
            "label": "String",
            "defaultStringValue": ""
        }]
    };

    var command = builder.createAddTableCommand(table);
    migrator.addTableAsync(_edm2.default, command.execute.options).then(function () {
        var query = pool.query;
        var passingResult = "IF NOT (EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES \n            WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'testTable__0_0_1'))\n            BEGIN\n            CREATE TABLE [dbo].[testTable__0_0_1] ([id] int PRIMARY KEY IDENTITY(1,1), [string] ntext)\n            END";
        _assert2.default.equal(query, passingResult);
    });
};
//# sourceMappingURL=mssql.Migrator.js.map