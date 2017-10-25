import assert from "assert";
import Migrator from "../mssql/Migrator";
import edm from "../mock/edm";
import Pool from "../mock/MsSqlPool";
import CommandBuilder from "../migration/CommandBuilder";
import Database from "../mssql/Database";

exports["mssql.Migrator.addColumnAsync string"] = () => {
    let pool = new Pool();
    let iDb = new Database({
        connectionPool: pool,
        edm: edm,
        schema: "dbo"
    });

    let migrator = new Migrator(iDb);
    let builder = new CommandBuilder();
    let column = {
        "type": "String",
        "name": "newColumn",
        "label": "New Column"
    };
    let command = builder.createAddColumnCommand("Source", column);
    migrator.addColumnAsync(edm, command.execute.options).then(() => {
        let query = pool.query;
        assert.equal(query, "ALTER TABLE [dbo].[Source__0_0_1] ADD [newColumn] ntext");
    });
};

exports["mssql.Migrator.addTableAsync"] = () => {
    let pool = new Pool();
    let iDb = new Database({
        connectionPool: pool,
        edm: edm,
        schema: "dbo"
    });

    let migrator = new Migrator(iDb);
    let builder = new CommandBuilder();
    let table = {
        "name": "testTable",
        "label": "Test",
        "pluralLabel": "Tests",
        "columns": [
            {
                "type": "Integer",
                "name": "id",
                "label": "Identifier",
                "isPrimaryKey": true,
                "isAutoIncrement": true,
                "isNullable": false
            },
            {
                "type": "String",
                "name": "string",
                "label": "String",
                "defaultStringValue": ""
            }
        ]
    };

    let command = builder.createAddTableCommand(table);
    migrator.addTableAsync(edm, command.execute.options).then(() => {
        let query = pool.query;
        let passingResult = `IF NOT (EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'testTable__0_0_1'))
            BEGIN
            CREATE TABLE [dbo].[testTable__0_0_1] ([id] int PRIMARY KEY IDENTITY(1,1), [string] ntext)
            END`;
        assert.equal(query, passingResult);
    });
};
