import Visitor from "./Visitor";
import EntityBuilder from "./EntityBuilder";

export default class Provider {
    constructor(name, options = {}) {
        if (options.sqlite == null) {
            throw new Error("Null Argument Exception: sqlite is required in options.");
        }

        if (options.edm == null) {
            throw new Error("Null Argument Exception: edm is required in options.");
        }

        this.edm = options.edm;
        this.sqlite = options.sqlite;
        this.name = name;

        this.entityBuilder = new EntityBuilder(name, this.edm);
    }

    toArrayAsync(queryable) {
        let query = queryable;
        let visitor = new Visitor(name);
        let statement = visitor.createSelectStatement(query);

        return this.sqlite.all(statement).then((results) => {
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

    countAsync() {
        let query = queryable;
        let visitor = new Visitor(name);
        let statement = visitor.createSelectStatementWithCount(query);

        return this.sqlite.get(statement).then((result) => {
            return result.count;
        });
    }
}