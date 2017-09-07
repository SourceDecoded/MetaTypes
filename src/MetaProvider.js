export default class MetaProvider {
    constructor(user, metaTable) {
        this.metaTable = metaTable;
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

    _refineQueryableAsync(queryable) {
        let user = this.user;
        return this.decorators.reduce((promise, decorator) => {
            return promise.then((queryable) => {
                let options = this.metaTable.decoratorOptions[decorator.name];
                let result = this._invokeMethodAsync(decorator, "refineQueryableAsync", [user, queryable, options]);

                if (!(result instanceof Promise)) {
                    return Promise.resolve(result);
                }

                return result;
            });
        }, Promise.resolve(queryable));
    }

    toArrayAsync(queryable) {
        let user = this.user;

        return this._refineQueryableAsync(queryable).then((queryable) => {
            return this.provider.toArrayAsync(queryable);
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