import TableStatementBuilder from "./TableStatementBuilder";

export default class Migrator {
    constructor(iDb) {
        this.schema = iDb.schema;
        this.iDb = iDb;
        this.connectionPool = iDb.connectionPool;
        this.name = "MsSqlMigrator";
    }

    _getQualifiedDbTableName(table, version) {
        return `[${this.schema}].[${table}__${version.replace(/\./g, "_")}]`;
    }

    addColumnAsync(edm, command = {}) {
        let metaTable = this.iDb.getTable(command.options.tableName).table;
        let builder = new TableStatementBuilder(metaTable, {
            edm: edm,
            schema: this.schema
        });
        let query = `ALTER TABLE ${this._getQualifiedDbTableName(command.options.tableName, edm.version)} ADD `;
        query += builder.createColumnDefinitionStatement(command.options.column);

        return this.connectionPool.request().query(query);
    }

    addDecoratorAsync(edm, command = {}) {
        // nothing to do here
    }

    addOneToOneRelationshipAsync(edm, command = {}) {
        // nothing to do here
    }

    addOneToManyRelationshipAsync(edm, command = {}) {
        // nothing to do here
    }

    addTableAsync(edm, command = {}) {
        let table = command.options;
        let builder = new TableStatementBuilder(table, {
            edm: edm,
            schema: this.schema
        });
        let query = builder.createTableStatement();

        return this.connectionPool.request().query(query);
    }

    removeColumnAsync(edm, command = {}) {
    }

    removeDecoratorAsync(edm, command = {}) {
    }

    removeOneToOneRelationshipCommand(edm, command = {}){
    }

    removeOneToManyRelationshipCommand(edm, command = {}){
    }

    removeTableAsync(edm, command = {}) {
    }

    updateColumnAsync(edm, command = {}) {
    }

    updateDecoratorAsync(edm, command = {}) {
    }

    updateTableAsync(edm, command = {}) {
    }
}
