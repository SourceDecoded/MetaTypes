import TableStatementBuilder from "./TableStatementBuilder";

export default class Migrator {
    constructor(sqliteDatabase) {

        if (sqliteDatabase == null) {
            throw new Error("Null Argument Exception: sqliteDatabase cannot be null or undefined.");
        }

        this.sqliteDatabase = sqliteDatabase;
        this.tableStatementBuilder = new TableStatementBuilder();

    }

    addColumnAsync(edm, options = {}) {
        let statement = this.tableStatementBuilder.createAddColumnStatement(options.tableName, options.column);
        return this.sqliteDatabase.run(statement);
    }

    addDecoratorAsync(edm, options = {}) {
    }

    addOneToOneRelationshipAsync(edm, options = {}) {
    }

    addOneToManyRelationshipAsync(edm, options = {}) {
    }

    addTableAsync(edm, options = {}) {
        let statement = this.tableStatementBuilder.createTableStatement(options);
        return this.sqliteDatabase.run(statement);
    }

    removeColumnAsync(edm, options = {}) {
    }

    removeDecoratorAsync(edm, options = {}) {
    }

    removeOneToOneRelationshipCommand(edm, options = {}) {
    }

    removeOneToManyRelationshipCommand(edm, options = {}) {
    }

    removeTableAsync(edm, options = {}) {
    }

    updateColumnAsync(edm, options = {}) {
    }

    updateDecoratorAsync(edm, options = {}) {
    }

    updateTableAsync(edm, options = {}) {
    }
}
