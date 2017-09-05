import Table from "./sqlite/Table"
import MetaProvider from "./MetaProvider";
import Queryable from "./query/Queryable";

const defaultDecorators = {
    name: null,
    edm: null,
    table: null,
    decorators: []
};

export default class MetaTable {
    constructor(options = {}) {
        this.table = options.table;
        this.name = this.table.name;
        this.edm = this.table.edm;
        this.edmTable = this._getEdmTable(this.name);

        this.decorators = options.decorators.filter((decorator) => {
            return table.decorators.findIndexOf((tableDecorator) => {
                return tableDecorator.name === decorator.name
            });
        });
    }

    _approveEntityToBeRemovedAsync(user, entity) {
        return this._invokeMethodOnDecoratorsAsync("approveEntityToBeRemovedAsync", [user, entity]).then(() => {
            return entity;
        });
    }

    _entityAddedAsync(user, entity) {
        return this._invokeMethodWithRecoveryOnDecoratorsAsync("entityAddedAsync", [user, entity]).then(() => {
            return entity;
        });
    }

    _entityRemovedAsync(user, entity) {
        return this._invokeMethodWithRecoveryOnDecoratorsAsync("entityRemovedAsync", [user, entity]).then(() => {
            return entity;
        });
    }

    _entityUpdatedAsync(user, entity, delta) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then(() => {
                let options = this._getDecoratorOptions(decorator.name);
                return this._invokeMethodWithRecoveryAsync(decorator, "entityUpdatedAsync", [user, entity, delta, options]);
            });
        }, Promise.resolve());
    }

    _getDecoratorOptions(name) {
        let decorator = this._getEdmTable(this.name).decorators.find((decorator) => {
            return decorator.name = name;
        });

        return decorator && decorator.options || null;
    }

    _getEdmTable(name) {
        return this.edm.tables.find((table) => {
            return table.name === name;
        });
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

    _invokeMethodWithRecoveryAsync(obj, method, args = []) {
        let promise = Promise.resolve();

        if (obj != null && typeof obj[nethod] === "function") {
            promise = obj[method].apply(args);

            if (!(promise instanceof Promise)) {
                promise = Promise.resolve(result);
            }
        }

        return promise.catch((eror) => {
            // Log error.
            return null
        });
    }

    _invokeMethodOnDecoratorsAsync(method, args) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then(() => {
                let options = this._getDecoratorOptions(decorator.name);
                let customArgs = args.slice();
                customArgs.push(options);

                return this._invokeMethodAsync(decorator, method, customArgs);
            });
        }, Promise.resolve());
    }

    _invokeMethodWithRecoveryOnDecoratorsAsync(method, args) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then(() => {
                let options = this._getDecoratorOptions(decorator.name);
                let customArgs = args.slice();
                customArgs.push(options);

                return this._invokeMethodWithRecoveryAsync(decorator, method, customArgs);
            });
        }, Promise.resolve());
    }

    _prepareEntityToBeAddedAsync(user, entity) {
        return this._invokeMethodOnDecoratorsAsync("prepareEntityToBeAddedAsync", [user, entity]);
    }

    _prepareEntityToBeUpdatedAsync(user, entity) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then((delta) => {
                let options = this._getDecoratorOptions(decorator.name);
                return this._invokeMethodAsync(decorator, "prepareEntityToBeUpdatedAsync", [user, entity, delta, options]);
            });
        }, Promise.resolve(delta))
    }

    _validateEntityToBeAddedAsync(user, entity) {
        Object.freeze(entity);

        return this._invokeMethodOnDecoratorsAsync("validateEntityToBeAddedAsync", [user, entity]).then(() => {
            return entity;
        });
    }

    _validateEntityToBeUpdatedAsync(user, entity, delta) {
        Object.freeze(delta);

        return this.decorators.reduce((promise, decorator) => {
            let options = this._getDecoratorOptions(decorator.name);
            return promise.then(() => {
                return this._invokeMethodAsync(decorator, "validateEntityToBeUpdatedAsync", [user, entity, delta, options]);
            });
        }, Promise.resolve()).then(() => {
            return delta;
        });
    }

    addEntityAsync(user, entity) {
        this._prepareEntityToBeAddedAsync(user, entity).then(() => {
            return this._validateEntityToBeAddedAsync(user, entity);
        }).then(() => {
            return this.table.addEntityAsync(user, entity);
        }).then(() => {
            return this._entityAddedAsync(user, entity);
        });
    }

    asQueryable(user) {
        let provider = this.getQueryProvider(user);
        let queryable = new Queryable();

        queryable.provider = provider;

        return queryable;
    }

    getQueryProvider(user) {
        return new MetaProvider(user, this);
    }

    removedEntityAsync(user, entity) {
        Object.freeze(entity);
        return this._approveEntityToBeRemovedAsync(user, entity).then(() => {
            return this.table.removedEntityAsync(user, entity);
        }).then(() => {
            return this._entityRemovedAsync(user, entity);
        });
    }

    updateEntityAsync(user, entity, delta) {
        Object.freeze(entity);
        let updatedEntity;

        return this._prepareEntityToBeUpdatedAsync(user, entity, delta).then((delta) => {
            return this._validateEntityToBeUpdatedAsync(user, entity, delta);
        }).then((delta) => {
            return this.table.updateEntityAsync(user, entity, delta).then((entity) => {
                updatedEntity = entity;
                return delta;
            });
        }).then((delta) => {
            return this._entityUpdatedAsync(user, updatedEntity, delta);
        }).then(() => {
            return updatedEntity;
        });
    }

}