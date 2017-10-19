import Visitor from "./Visitor";
import EntityBuilder from "./EntityBuilder";

export default class Provider {
    constructor(name, options = {}) {
        if (options.mssqlDatabase == null) {
            throw new Error("Null Argument Exception: mssqlDatabase is required in options.");
        }

        if (options.edm == null) {
            throw new Error("Null Argument Exception: edm is required in options.");
        }
        
        if (options.schema == null) {
            throw new Error("Null Argument Exception: schema is required in options");
        }

        this.edm = options.edm;
        this.mssqlDatabase = options.mssqlDatabase;
        this.schema = options.schema;
        this.name = name;

        this.entityBuilder = new EntityBuilder(name, this.edm);
    }

    toArrayAsync(queryable) {
        let query = queryable.getQuery();
        let visitor = new Visitor(this.name, this.edm, this.schema);
        let statement = visitor.createSelectStatement(query);

        return this.mssqlDatabase.all(statement).then((results) => {
            return this.entityBuilder.convert(results);
        });
    }

    toArrayWithCountAsync(queryable) {
        let count = 0;
        return this.countAsync((c) => {
            count = c;
            return this.toArrayAsync(queryable);
        }).then((results) => {
            return {
                count: count,
                results: results
            }
        })
    }

    countAsync(queryable) {
        let query = queryable.getQuery();
        let visitor = new Visitor(this.name, this.edm, this.schema);
        let statement = visitor.createSelectStatementWithCount(query);

        return this.sqliteDatabase.get(statement).then((result) => {
            return result.count;
        });
    }
}