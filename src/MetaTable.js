import Table from "./sqlite/Table"

export default class MetaTable {
    constructor(name, options = {}) {
        this.edm = options.edm;
        this.sqlite = options.sqlite;
        this.name = name;

        this.sqliteTable = new Table(name, options);
    }

    addEntityAsync(entity) { }

    asQueryable() { }

    getQueryProvider() { }

    removedEntityAsync(entity) { }
    
    updateEntityAsync(entity, delta) { }

}