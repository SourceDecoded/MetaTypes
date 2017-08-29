import StatementBuilder from "./StatementBuilder";

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
        this.statementBuilder = new StatementBuilder(name, options);

    }

    _getTable(name) {
        return this.edm.tables.find((table) => {
            return table.name === name;
        });
    }


    addEntityAsync(entity) {

    }

    createTableAsync() {

    }

    dropTableAsync() {

    }

    removeEntityAsync(entity) {

    }

    updateEntityAsync(entity, delta) {

    }

    asQueryable(){
        
    }

}