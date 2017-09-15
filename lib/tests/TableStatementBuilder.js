"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _edm = require("./../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

var _TableStatementBuilder = require("./../sqlite/TableStatementBuilder");

var _TableStatementBuilder2 = _interopRequireDefault(_TableStatementBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var sourceTable = _edm2.default.tables.find(function (table) {
    return table.name === "Source";
});

var foreignTable = _edm2.default.tables.find(function (table) {
    return table.name === "Foreign";
});

var otherForeignTable = _edm2.default.tables.find(function (table) {
    return table.name === "OtherForeign";
});

var relationships = _edm2.default.relationships;

exports["TableStatementBuilder: Constructor"] = function () {
    var builder = new _TableStatementBuilder2.default();
};

exports["TableStatementBuilder.createTableStatement: Without Relationships."] = function () {
    var builder = new _TableStatementBuilder2.default();

    var tableStatement = builder.createTableStatement(sourceTable, relationships);

    assert.equal(tableStatement, 'CREATE TABLE IF NOT EXISTS "Source" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "string" TEXT, "number" NUMERIC, "date" NUMERIC, "boolean" NUMERIC, "float" REAL)');
};

exports["TableStatementBuilder.createTableStatement: With Relationships."] = function () {
    var builder = new _TableStatementBuilder2.default();

    var tableStatement = builder.createTableStatement(foreignTable, relationships);

    assert.equal(tableStatement, "CREATE TABLE IF NOT EXISTS \"Foreign\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"foreignKey\" INTEGER, FOREIGN KEY (\"foreignKey\") REFERENCES \"Source\" (\"id\"))");
};

exports["TableStatementBuilder.createInsertStatement"] = function () {
    var builder = new _TableStatementBuilder2.default();

    var insertStatement = builder.createInsertStatement(sourceTable, {
        string: "This is a test."
    });

    assert.equal(insertStatement.statement, 'INSERT INTO "Source" ("string") VALUES (?)');

    assert.equal(insertStatement.values[0], "This is a test.");
};

exports["TableStatementBuilder.createInsertStatement: Defualt Values."] = function () {
    var builder = new _TableStatementBuilder2.default();

    var insertStatement = builder.createInsertStatement(sourceTable, {});

    assert.equal(insertStatement.statement, 'INSERT INTO "Source" DEFAULT VALUES');

    assert.equal(insertStatement.values.length, 0);
};

exports["TableStatementBuilder.createUpdateStatement"] = function () {
    var builder = new _TableStatementBuilder2.default();

    var updateStatement = builder.createUpdateStatement(sourceTable, { id: 1 }, { string: "This is a update test." });

    assert.equal(updateStatement.statement, "UPDATE \"Source\" SET \"string\" = ? WHERE \"id\" = ?");

    assert.equal(updateStatement.values[0], "This is a update test.");

    assert.equal(updateStatement.values[1], 1);

    assert.equal(updateStatement.values.length, 2);
};

exports["TableStatementBuilder.createDeleteStatement"] = function () {
    var builder = new _TableStatementBuilder2.default();

    var deleteStatement = builder.createDeleteStatement(sourceTable, { id: 1 });

    assert.equal(deleteStatement.statement, "DELETE FROM \"Source\" WHERE \"id\" = ?");

    assert.equal(deleteStatement.values[0], 1);

    assert.equal(deleteStatement.values.length, 1);
};

exports["TableStatementBuilder.createTableIndexesStatements"] = function () {
    var builder = new _TableStatementBuilder2.default();

    var indexStatements = builder.createTableIndexesStatements(foreignTable, relationships);

    assert.equal(indexStatements[0], "CREATE INDEX IF NOT EXISTS \"foreignKey\" ON \"Foreign\" (\"foreignKey\")");
    assert.equal(indexStatements[1], "CREATE INDEX IF NOT EXISTS \"id\" ON \"Foreign\" (\"id\")");
};

exports["TableStatementBuilder.createTableIndexesStatements: With custom indexes."] = function () {
    var builder = new _TableStatementBuilder2.default();

    var indexStatements = builder.createTableIndexesStatements(otherForeignTable, relationships);
};
//# sourceMappingURL=TableStatementBuilder.js.map