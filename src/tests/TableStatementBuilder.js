import * as assert from "assert";
import TableStatementBuilder from "./../sqlite/TableStatementBuilder";

var sourceTable = {
    "id": 1,
    "name": "Source",
    "label": "Source",
    "pluralLabel": "Sources",
    "columns": [
        {
            "id": 1,
            "type": "Integer", // Possible types: String, Number, Date, Boolean
            "name": "id",
            "isPrimaryKey": true, // Defaults to false
            "isAutoIncrement": true, // Default to false
            "isNullable": false // Default to true
        },
        {
            "id": 2,
            "type": "String",
            "name": "string",
            "defaultStringValue": ""
        },
        {
            "id": 3,
            "type": "Number",
            "name": "number",
            "defaultNumberValue": 1
        },
        {
            "id": 4,
            "type": "Date",
            "name": "date",
            "defaultDateValue": new Date(1900, 0, 1)
        },
        {
            "id": 5,
            "type": "Boolean",
            "name": "boolean",
            "defaultBooleanValue": false
        },
        {
            "id": 6,
            "type": "Float",
            "name": "float",
            "defaultFloatValue": false
        },
    ]
};

const foreignTable = {
    "id": 1,
    "name": "Foreign",
    "label": "Foreign",
    "pluralLabel": "Foreigners",
    "columns": [
        {
            "id": 100,
            "type": "Integer", // Possible types: String, Number, Date, Boolean
            "name": "id",
            "isPrimaryKey": true, // Defaults to false
            "isAutoIncrement": true, // Default to false
            "isNullable": false // Default to true
        },
        {
            "id": 101,
            "type": "Integer",
            "name": "foreignKey",
        }
    ]
};

const relationships = {
    oneToOne: [],
    oneToMany: [{
        "id": 1,
        "type": "Source",
        "hasKey": "id",
        "hasMany": "foreigners",
        "ofType": "Foreign",
        "withKey": "id",
        "withForeignKey": "foreignKey",
        "withOne": "source"
    }]
};

exports["TableStatementBuilder: Constructor"] = () => {
    var builder = new TableStatementBuilder();
}

exports["TableStatementBuilder.createTableStatement: Without Relationships."] = () => {
    var builder = new TableStatementBuilder();

    var tableStatement = builder.createTableStatement(sourceTable, relationships);

    assert.equal(
        tableStatement,
        "CREATE TABLE IF NOT EXISTS 'Source' ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'string' TEXT, 'number' NUMERIC, 'date' NUMERIC, 'boolean' NUMERIC, 'float' REAL)"
    )
}

exports["TableStatementBuilder.createTableStatement: With Relationships."] = () => {
    var builder = new TableStatementBuilder();

    var tableStatement = builder.createTableStatement(foreignTable, relationships);

    assert.equal(
        tableStatement,
        "CREATE TABLE IF NOT EXISTS 'Foreign' ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'foreignKey' INTEGER) FOREIGN KEY ('foreignKey') REFERENCES 'Source' ('id')"
    )
}

exports["TableStatementBuilder.createInsertStatement"] = () => {
    var builder = new TableStatementBuilder();

    var insertStatement = builder.createInsertStatement(sourceTable, {
        string: "This is a test."
    });

    assert.equal(
        insertStatement.statement,
        "INSERT INTO 'Source' ('string') VALUES (?)"
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
        "INSERT INTO 'Source' DEFAULT VALUES"
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
        "UPDATE 'Source' SET 'string' = ? WHERE 'id' = ?"
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
        "DELETE FROM 'Source' WHERE 'id' = ?"
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

    assert.equal(indexStatements[0], "CREATE INDEX IF NOT EXISTS 'id' ON 'Foreign' ('id')");
    assert.equal(indexStatements[1], "CREATE INDEX IF NOT EXISTS 'foreignKey' ON 'Foreign' ('foreignKey')");
}