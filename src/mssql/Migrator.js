import TableStatementBuilder from "./TableStatementBuilder";
import TableNameHelper from "./TableNameHelper";

export default class Migrator {
    constructor(iDb) {
        this.schema = iDb.schema;
        this.iDb = iDb;
        this.connectionPool = iDb.connectionPool;
        this.name = "MsSqlMigrator";
    }

    addColumnAsync(edm, options = {}) {
        let metaTable = this.iDb.getTable(options.tableName).table;
        let namer = new TableNameHelper({edm:edm, schema:this.schema});
        let builder = new TableStatementBuilder(metaTable, {
            edm: edm,
            schema: this.schema
        });
        let query = `ALTER TABLE ${namer.getQualifiedTableName(options.tableName)} ADD `;
        query += builder.createColumnDefinitionStatement(options.column);

        return this.connectionPool.request().query(query);
    }

    addDecoratorAsync(edm, options = {}) {
        // nothing to do here
    }

    addOneToOneRelationshipAsync(edm, options = {}) {
        // nothing to do here
    }

    addOneToManyRelationshipAsync(edm, options = {}) {
        // nothing to do here
    }

    addTableAsync(edm, options = {}) {
        let table = options;
        let builder = new TableStatementBuilder(table, {
            edm: edm,
            schema: this.schema
        });
        let query = builder.createTableStatement();

        return this.connectionPool.request().query(query).then((result) => {
            return [];
        });
    }

    removeColumnAsync(edm, options = {}) {
    }

    removeDecoratorAsync(edm, options = {}) {
    }

    removeOneToOneRelationshipCommand(edm, options = {}){
    }

    removeOneToManyRelationshipCommand(edm, options = {}){
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
