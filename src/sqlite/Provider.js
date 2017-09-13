import Visitor from "./Visitor";
import EntityBuilder from "./EntityBuilder";

export default class Provider {
    constructor(name, options = {}) {
        if (options.sqliteDatabase == null) {
            throw new Error("Null Argument Exception: sqliteDatabase is required in options.");
        }

        if (options.edm == null) {
            throw new Error("Null Argument Exception: edm is required in options.");
        }

        this.edm = options.edm;
        this.sqliteDatabase = options.sqliteDatabase;
        this.name = name;

        this.entityBuilder = new EntityBuilder(name, this.edm);
    }

    toArrayAsync(queryable) {
        let query = queryable.getQuery();
        let visitor = new Visitor(this.name, this.edm);
        let statement = visitor.createSelectStatement(query);

        return this.sqliteDatabase.all(statement).then((results) => {
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
        let visitor = new Visitor(this.name, this.edm);
        let statement = visitor.createSelectStatementWithCount(query);

        return this.sqliteDatabase.get(statement).then((result) => {
            return result.count;
        });
    }
}