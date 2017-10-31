import * as assert from "assert";
import edm from "./../mock/edm";
import TableStatementBuilder from "./../sqlite/TableStatementBuilder";

var sourceTable = edm.tables.find((table) => {
    return table.name === "Source";
});

const foreignTable = edm.tables.find((table) => {
    return table.name === "Foreign";
});

const otherForeignTable = edm.tables.find((table) => {
    return table.name === "OtherForeign";
});

const relationships = edm.relationships;

exports["TableStatementBuilder: Constructor"] = () => {
    var builder = new TableStatementBuilder();
}

exports["TableStatementBuilder.createTableStatement: Without Relationships."] = () => {
    var builder = new TableStatementBuilder();

    var tableStatement = builder.createTableStatement(sourceTable, relationships);

    assert.equal(
        tableStatement,
        'CREATE TABLE IF NOT EXISTS "Source" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "string" TEXT, "number" NUMERIC, "date" NUMERIC, "boolean" NUMERIC, "float" REAL)'
    )
}

exports["TableStatementBuilder.createTableStatement: With Relationships."] = () => {
    var builder = new TableStatementBuilder();

    var tableStatement = builder.createTableStatement(foreignTable, relationships);

    assert.equal(
        tableStatement,
        `CREATE TABLE IF NOT EXISTS "Foreign" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "foreignKey" INTEGER)`
    )
}

exports["TableStatementBuilder.createInsertStatement"] = () => {
    var builder = new TableStatementBuilder();

    var insertStatement = builder.createInsertStatement(sourceTable, {
        string: "This is a test."
    });

    assert.equal(
        insertStatement.statement,
        'INSERT INTO "Source" ("string") VALUES (?)'

    );

    assert.equal(
        insertStatement.values[0],
        "This is a test."
    );
}

exports["TableStatementBuilder.createInsertStatement: Defualt Values."] = () => {
    var builder = new TableStatementBuilder();

    var insertStatement = builder.createInsertStatement(sourceTable, {});

    assert.equal(
        insertStatement.statement,
        'INSERT INTO "Source" DEFAULT VALUES'
    );

    assert.equal(
        insertStatement.values.length,
        0
    );
}

exports["TableStatementBuilder.createUpdateStatement"] = () => {
    var builder = new TableStatementBuilder();

    var updateStatement = builder.createUpdateStatement(sourceTable, { id: 1 }, { string: "This is a update test." });

    assert.equal(
        updateStatement.statement,
        `UPDATE "Source" SET "string" = ? WHERE "id" = ?`
    );

    assert.equal(
        updateStatement.values[0],
        "This is a update test."
    );

    assert.equal(
        updateStatement.values[1],
        1
    );

    assert.equal(
        updateStatement.values.length,
        2
    );
}


exports["TableStatementBuilder.createDeleteStatement"] = () => {
    var builder = new TableStatementBuilder();

    var deleteStatement = builder.createDeleteStatement(sourceTable, { id: 1 });

    assert.equal(
        deleteStatement.statement,
        `DELETE FROM "Source" WHERE "id" = ?`
    );

    assert.equal(
        deleteStatement.values[0],
        1
    );

    assert.equal(
        deleteStatement.values.length,
        1
    );
}

exports["TableStatementBuilder.createTableIndexesStatements"] = () => {
    var builder = new TableStatementBuilder();

    var indexStatements = builder.createTableIndexesStatements(foreignTable, relationships);

    assert.equal(indexStatements[0], `CREATE INDEX IF NOT EXISTS "foreignKey" ON "Foreign" ("foreignKey")`);
    assert.equal(indexStatements[1], `CREATE INDEX IF NOT EXISTS "id" ON "Foreign" ("id")`);
}

exports["TableStatementBuilder.createTableIndexesStatements: With custom indexes."] = () => {
    var builder = new TableStatementBuilder();

    var indexStatements = builder.createTableIndexesStatements(otherForeignTable, relationships);

}

exports["TableStatementBuilder.createAddColumnStatement"] = () => {
    var builder = new TableStatementBuilder();

    var addColumnStatement = builder.createAddColumnStatement("Source", {
        type: "String",
        name: "property",
        label: "Property",
        isIndexed: true,
        isNullable: true,
        isAutoIncrement: false,
        isPrimaryKey: false
    });

    assert.equal(addColumnStatement, `ALTER TABLE Source ADD COLUMN "property" TEXT`);
}