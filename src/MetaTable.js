import Table from "./sqlite/Table"

export default class MetaTable {
    constructor(options = {}) {
        this.sqliteTable = options.sqliteTable;
        this.name = sqliteTable.name;
        this.edm = options.edm;
        this.table = this._getTable(this.name);

        this.decorators = options.decorators.filter((decorator) => {
            return table.decorators.findIndexOf((tableDecorator) => {
                return tableDecorator.name === decorator.name
            });
        });
    }

    _approveEntityToBeRemovedAsync(entity) {
        return this._invokeMethodOnDecoratorsAsync("approveEntityToBeRemovedAsync", [entity]);
    }

    _entityAddedAsync(entity) {
        return this._invokeMethodWithRecoveryOnDecoratorsAsync("entityAddedAsync", [entity]);
    }

    _entityRemovedAsync(entity) {
        return this._invokeMethodWithRecoveryOnDecoratorsAsync("entityRemovedAsync", [entity]).then(() => {
            return entity;
        });
    }

    _getDecoratorOptions(name) {
        let decorator = this._getTable(this.name).decorators.find((decorator) => {
            return decorator.name = name;
        });

        return decorator && decorator.options || null;
    }

    _getTable(name) {
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
            let options = this._getDecoratorOptions(decorator.name);
            return promise.then(() => {
                let args = Array.from(arguments);
                args.push(options);
                return this._invokeMethodAsync(decorator, method, args);
            });
        }, Promise.resolve.apply(Promise, args));
    }

    _invokeMethodWithRecoveryOnDecoratorsAsync(method, args) {
        return this.decorators.reduce((promise, decorator) => {
            let options = this._getDecoratorOptions(decorator.name);
            return promise.then(() => {
                let args = Array.from(arguments);
                args.push(options);
                return this._invokeMethodWithRecoveryAsync(decorator, method, args);
            });
        }, Promise.resolve.apply(Promise, args));
    }

    _prepareEntityToBeAddedAsync(entity) {
        return this._invokeMethodOnDecoratorsAsync("prepareEntityToBeAddedAsync", [entity]);
    }

    _validateEntityToBeAddedAsync(entity) {
        Object.freeze(entity);

        return this._invokeMethodOnDecoratorsAsync("validateEntityToBeAddedAsync", [entity]).then(() => {
            return entity;
        });
    }

    addEntityAsync(entity) {
        this._prepareEntityToBeAddedAsync(entity).then((entity) => {
            return this._validateEntityToBeAddedAsync(entity);
        }).then((entity) => {
            return this.sqliteTable.addEntityAsync(entity);
        }).then((entity) => {
            return this._entityAddedAsync(entity);
        });
    }

    asQueryable() { }

    getQueryProvider() { }

    removedEntityAsync(entity) {
        Object.freeze(entity);
        return this._approveEntityToBeRemovedAsync(entity).then((entity) => {
            return this.sqliteTable.removedEntityAsync(entity);
        }).then((entity) => {
            return this._entityRemovedAsync(entity);
        });
    }

    updateEntityAsync(entity, delta) {
        Object.freeze(entity);
        let updatedEntity;

        return this.decorators.reduce((promise, decorator) => {
            let options = this._getDecoratorOptions(decorator.name);
            return promise.then((delta) => {
                return this._invokeMethodAsync(decorator, "prepareEntityToBeUpdatedAsync", [entity, delta, options]);
            });
        }, Promise.resolve(delta)).then((delta) => {
            // Freeze the delta from being changes by the decorators.
            Object.freeze(delta);

            return this.decorators.reduce((promise, decorator) => {
                let options = this._getDecoratorOptions(decorator.name);
                return promise.then(() => {
                    return this._invokeMethodAsync(decorator, "validateEntityToBeUpdatedAsync", [entity, delta, options]);
                });
            }, Promise.resolve()).then(() => {
                return delta;
            });
        }).then((delta) => {
            return this.sqliteTable.updateEntityAsync(entity, delta).then((entity) => {
                updatedEntity = entity;
                return delta;
            });
        }).then((delta) => {
            return this.decorators.reduce((promise, decorator) => {
                let options = this._getDecoratorOptions(decorator.name);
                return promise.then(() => {
                    return this._invokeMethodWithRecoveryAsync(decorator, "entityUpdatedAsync", [entity, delta, options]);
                });
            }, Promise.resolve());
        }).then(() => {
            return updatedEntity;
        });
    }

}