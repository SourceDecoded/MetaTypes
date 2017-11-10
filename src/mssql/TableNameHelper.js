export default class {

    constructor(options = {}) {
        if (!options.edm) {
            throw new Error("EDM needed to generate qualified table name");
        }
        if (!options.schema) {
            throw new Error("schema needed to generate qualified table name");
        }
        this.edm = options.edm;
        this.schema = options.schema;
    }

    getQualifiedTableName(tableName) {
        return `[${this.getSchemaPart()}].[${this.getTablePart(tableName)}]`;
    };

    getTablePart(tableName) {
        return `${tableName}__${this.edm.name}__${this.edm.version.replace(/\./g, "_")}`;
    };

    getSchemaPart() {
        return this.schema;
    }
}