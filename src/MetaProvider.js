import Visitor from "./Visitor";
import EntityBuilder from "./EntityBuilder";

export default class MetaProvider {
    constructor(user, metaTable) {
        this.metaTable = metaTable;
        this.provider = metaTable.table.provider;
        this.decorators = metaTable.decorators;
        this.user = user;
    }

    _invokeMethodAsync(obj, method, args = []) {
        if (obj != null && typeof obj[method] === "function") {
            var result = obj[method].apply(args);

            if (!(result instanceof Promise)) {
                result = Promise.resolve(result);
            }

            return result;
        }

        return Promise.resolve();
    }

    _refineQueryableAsync(user, queryable) {
        let user = this.user;
        return this.decorators.reduce((promise, decorator) => {
            return promise.then((queryable) => {
                let options = decorator.options || null;
                return this._invokeMethodAsync(decorator, "refineQueryableAsync", [user, queryable, options]);
            });
        }, Promise.resolve(queryable));
    }

    toArrayAsync(queryable) {
        let user = this.user;
        let queryable = this._refineQueryableAsync(user, queryable);

        return this.provider.toArrayAsync(queryable);
    }

    toArrayWithCountAsync(queryable) {
        let user = this.user;
        let queryable = this._refineQueryableAsync(user, queryable);

        return this.provider.toArrayWithCountAsync(queryable);
    }

    countAsync(queryable) {
        let user = this.user;
        let queryable = this._refineQueryableAsync(user, queryable);

        return this.provider.countAsync(queryable);
    }
}