import TableStatementBuilder from "./TableStatementBuilder";
import { Queryable } from "queryablejs";
import Provider from "./Provider";

export default class Table {
    constructor(name, options = {}) {
        this.mssqlDatabase = options.mssqlDatabase;
        this.edm = options.edm;
        this.name = name;
        this.schema = options.schema;

        if (this.name == null) {
            throw new Error("The table needs to have a name.");
        }

        if (this.mssqlDatabase == null) {
            throw new Error("The table needs to have a mssqlDatabase database.");
        }

        if (this.edm == null) {
            throw new Error("The table needs to have a edm.");
        }

        this.table = this._getTable(name);

        if (this.table == null) {
            throw new Error(`Cannot find table called '${name}' within ${this.edm.name}.`);
        }

        this.tableStatementBuilder = new TableStatementBuilder(this.table, options);
        this.provider = new Provider(name, {
            edm: this.edm,
            mssqlDatabase: this.mssqlDatabase,
            schema: this.schema
        });
    }

    _clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    _getPrimaryKeyName() {
        var column = this.table.columns.find((column) => {
            return column.isPrimaryKey;
        });

        return column && column.name || null;
    }

    _getTable(name) {
        return this.edm.tables.find((table) => {
            return table.name === name;
        });
    }

    addEntityAsync(entity) {
        var sql = this.tableStatementBuilder.createInsertStatement(entity);

        return this.mssqlDatabase.request().query(sql.statement, sql.values).then((result) => {
            let updatedEntity = this._clone(entity);

            // TODO: might need to be recordsets[1][0].id;
            // This uses the SQL Server specific way to get an inserted id.
            updatedEntity[this._getPrimaryKeyName()] = result.recordset[0].id;
            return updatedEntity;
        });
    }

    asQueryable() {
        let queryable = new Queryable(this.name);
        queryable.provider = this.provider;

        return queryable;
    }

    createAsync() {
        var tableStatement = this.tableStatementBuilder.createTableStatement(this.edm.relationships);
        var indexesStatements = this.tableStatementBuilder.createTableIndexesStatements(this.edm.relationships);

        indexesStatements.unshift(tableStatement);
        let fullStatement = indexesStatements.join(";");
        return this.mssqlDatabase.request().query(fullStatement);
    }

    dropAsync() {
        var statement = this.tableStatementBuilder.createDropTableStatement();

        return this.mssqlDatabase.request().query(statement);
    }

    getQueryProvider() {
        return this.provider;
    }


    removeEntityAsync(entity) {
        var sql = this.tableStatementBuilder.createDeleteStatement(entity);

        return this.mssqlDatabase.request().query(sql.statement, sql.values).then(() => {
            return entity;
        });
    }

    updateEntityAsync(entity, delta) {
        var sql = this.tableStatementBuilder.createUpdateStatement(entity, delta);

        return this.mssqlDatabase.request().query(sql.statement, sql.values).then((statement) => {
            return Object.assign({}, entity, delta);
        });
    }
}