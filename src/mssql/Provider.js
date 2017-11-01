import QueryBuilder from "./QueryBuilder";

export default class Provider {
    constructor(name, options = {}) {
        if (options.connectionPool == null) {
            throw new Error("Null Argument Exception: connectionPool is required in options.");
        }

        if (options.edm == null) {
            throw new Error("Null Argument Exception: edm is required in options.");
        }
        
        if (options.schema == null) {
            throw new Error("Null Argument Exception: schema is required in options");
        }

        this.edm = options.edm;
        this.connectionPool = options.connectionPool;
        this.schema = options.schema;
        this.name = name;
        this.queryBuilder = new QueryBuilder(this.edm, options.schema);
    }

    toArrayAsync(queryable) {
        let query = queryable.getQuery();
        let statement = this.queryBuilder.createStatement(query);

        let request = this.connectionPool.request();

        return request.query(statement).then((results) => {
            return results.recordset;
        });
    }

    toArrayWithCountAsync(queryable) {
        let count = 0;
        return this.countAsync(queryable).then((c) => {
            count = c;
            return this.toArrayAsync(queryable);
        }).then((results) => {
            return {
                count: count,
                results: results
            }
        });
    }

    countAsync(queryable) {
        let query = queryable.getQuery();
        let statement = this.queryBuilder.createCountStatement(query);

        let request = this.connectionPool.request();

        return request.query(statement).then((result) => {
            return result.recordset[0].count;
        });
    }
}