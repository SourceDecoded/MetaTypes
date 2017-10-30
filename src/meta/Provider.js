import { Queryable, ValueExpression } from "queryablejs";

export default class Provider {
    constructor(user, metaTable, metaDatabase) {
        this.metaTable = metaTable;
        this.metaDatabase = metaDatabase;
        this.provider = metaTable.table.provider;
        this.decorators = metaTable.decorators;
        this.user = user;
    }

    _invokeMethodAsync(obj, method, args = []) {
        if (obj != null && typeof obj[method] === "function") {
            var result = obj[method].apply(obj, args);

            if (!(result instanceof Promise)) {
                result = Promise.resolve(result);
            }

            return result;
        }

        return Promise.resolve();
    }

    _refineInnerQueriesAsync(queryable) {
        let user = this.user;
        let query = queryable.getQuery();
        //let innerQueries = query.where.getMatchingNodes(new ValueExpression("queryable"));
        let innerQueries = query.where.getMatchingNodes({type: "value", nodeName: "queryable"});

        return innerQueries.reduce((queryableExpression) => {
            let query = queryableExpression.value;
            let queryable = new Queryable(query.type, query);
            let metaTable = this.metaDatabase.getTable(query.type);
            let previousQueryable = queryable;

            return this.decorators.reduce((promise, decorator) => {
                return promise.then((queryable) => {
                    previousQueryable = queryable;

                    let options = metaTable.decoratorOptions[decorator.name];
                    let result = this._invokeMethodAsync(decorator, "refineQueryableAsync", [user, queryable, options])

                    if (result == null) {
                        result = queryable;
                    }

                    if (!(result instanceof Promise)) {
                        return Promise.resolve(result);
                    }

                    return result;
                }).then((queryable) => {
                    if (!(queryable instanceof Queryable)) {
                        return previousQueryable;
                    }

                    let modifiedQuery = query.getQuery();
                    query.select = modifiedQuery.select;
                    query.where = modifiedQuery.where;
                    query.orderBy = modifiedQuery.orderBy;
                    query.skip = modifiedQuery.skip;
                    query.take = modifiedQuery.take;
                    query.type = modifiedQuery.type;

                    return queryable;
                });
            }, Promise.resolve(queryable));



        }, Queryable).then(() => {
            return queryable;
        });
    }

    _refineQueryableAsync(queryable) {
        let user = this.user;

        return this._refineInnerQueriesAsync(queryable).then((queryable) => {
            let previousQueryable = queryable;

            return this.decorators.reduce((promise, decorator) => {
                return promise.then((queryable) => {
                    previousQueryable = queryable;

                    let options = this.metaTable.decoratorOptions[decorator.name];
                    let result = this._invokeMethodAsync(decorator, "refineQueryableAsync", [user, queryable, options]);

                    if (result == null) {
                        result = queryable;
                    }

                    if (!(result instanceof Promise)) {
                        return Promise.resolve(result);
                    }

                    return result;
                }).then((queryable) => {
                    if (!(queryable instanceof Queryable)) {
                        return previousQueryable;
                    }
                    return queryable;
                });
            }, Promise.resolve(queryable));

        });
    }

    toArrayAsync(queryable) {
        let user = this.user;

        return this._refineQueryableAsync(queryable).then((queryable) => {
            return this.provider.toArrayAsync(queryable);
        }).then((results) => {
            // We need to save the previous results just in case the decorator doesn't implement
            // the life-cycle or it returns something that isn't an array.
            let previousResults = results;

            return this.decorators.reduce((promise, decorator) => {
                return promise.then((results) => {
                    if (!Array.isArray(results) || results.length !== previousResults.length) {
                        results = previousResults;
                    }

                    previousResults = results;

                    this._invokeMethodAsync(decorator, "mapAsync", [results]);
                });
                
            }, Promise.resolve(results));
        });
    }

    toArrayWithCountAsync(queryable) {
        let user = this.user;

        return this._refineQueryableAsync(queryable).then((queryable) => {
            return this.provider.toArrayWithCountAsync(queryable);
        });
    }

    countAsync(queryable) {
        let user = this.user;

        return this._refineQueryableAsync(queryable).then((queryable) => {
            return this.provider.countAsync(queryable);
        });
    }
}