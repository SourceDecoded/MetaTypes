import TableStatementBuilder from "./TableStatementBuilder";
import Queryable from "./../query/Queryable";
import Provider from "./Provider";

export default class Table {
    constructor(name, options = {}) {
        this.sqlite = options.sqlite;
        this.edm = options.edm;
        this.name = name;

        if (this.name == null) {
            throw new Error("The table needs to have a name.");
        }

        if (this.sqlite == null) {
            throw new Error("The table needs to have a sqlite database.");
        }

        if (this.edm == null) {
            throw new Error("The table needs to have a edm.");
        }

        this.table = this._getTable(name);
        this.tableStatementBuilder = new TableStatementBuilder(name, options);
        this.provider = new Provider(name, {
            edm: this.edm,
            sqlite: this.sqlite
        });
    }

    _getTable(name) {
        return this.edm.tables.find((table) => {
            return table.name === name;
        });
    }


    addEntityAsync(entity) {
        var statement = this.tableStatementBuilder.createInsertStatement(this.table, entity);

        return this.sqlite.run(statement);
    }

    createAsync() {
        var tableStatement = this.tableStatementBuilder.createTableStatement(this.table, this.edm.relationships);
        var indexesStatements = this.tableStatementBuilder.createTableIndexesStatements(this.table, this.edm.relationships);

        indexesStatements.unshift(tableStatement);

        return this.sqlite.exec(indexesStatments.join(";"));
    }

    dropAsync() {
        var statement = this.tableStatementBuilder.createDropTableStatement(this.table.name);

        return this.sqlite.run(statement);
    }

    removeEntityAsync(entity) {
        var statement = this.tableStatementBuilder.createDeleteStatement(this.table.name, entity);
    }

    updateEntityAsync(entity, delta) {
        var statement = this.tableStatementBuilder.createUpdateStatement(this.table.name, entity, delta);
    }

    asQueryable() {
        let queryable = new Queryable(this.name);
        queryable.provider = provider;

        return queryable;
    }

    getQueryProvider() {
        return this.provider;
    }

}