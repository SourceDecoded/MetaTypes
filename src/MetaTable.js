import Table from "./sqlite/Table"
import MetaProvider from "./MetaProvider";
import {Queryable} from "queryablejs";
import User from "./User";

const defaultDecorators = {
    name: null,
    edm: null,
    table: null,
    decorators: []
};

export default class MetaTable {
    constructor({ table = null, decorators = [] } = {}) {
        this.table = table;
        this.name = table.name;
        this.edm = table.edm;
        this.edmTable = this._getEdmTable(this.name);
        this.decoratorOptions = {};
        this.decorators = decorators.filter((decorator) => {
            let decorators = this.edmTable.decorators || [];

            return decorators.findIndex((tableDecorator) => {
                this.decoratorOptions[tableDecorator.name] = tableDecorator.options;
                return tableDecorator.name === decorator.name
            }) > -1;
        });
    }

    _approveEntityToBeRemovedAsync(user, entity) {
        return this._invokeMethodOnDecoratorsAsync("approveEntityToBeRemovedAsync", [user, entity]).then(() => {
            return entity;
        });
    }

    _assertUser(user) {
        if (!(user instanceof User)) {
            throw new Error("Illegal Argument Exception: user needs to be an instance of User.");
        }
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
                let options = this.decoratorOptions[decorator.name];
                return this._invokeMethodWithRecoveryAsync(decorator, "entityUpdatedAsync", [user, entity, delta, options]);
            });
        }, Promise.resolve());
    }

    _getEdmTable(name) {
        return this.edm.tables.find((table) => {
            return table.name === name;
        });
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

    _invokeMethodWithRecoveryAsync(obj, method, args = []) {
        let promise = Promise.resolve();

        if (obj != null && typeof obj[method] === "function") {
            promise = obj[method].apply(obj, args);

            if (!(promise instanceof Promise)) {
                promise = Promise.resolve(promise);
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
                let options = this.decoratorOptions[decorator.name];
                let customArgs = args.slice();
                customArgs.push(options);

                return this._invokeMethodAsync(decorator, method, customArgs);
            });
        }, Promise.resolve());
    }

    _invokeMethodWithRecoveryOnDecoratorsAsync(method, args) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then(() => {
                let options = this.decoratorOptions[decorator.name];
                let customArgs = args.slice();
                customArgs.push(options);

                return this._invokeMethodWithRecoveryAsync(decorator, method, customArgs);
            });
        }, Promise.resolve());
    }

    _prepareEntityToBeAddedAsync(user, entity) {
        return this._invokeMethodOnDecoratorsAsync("prepareEntityToBeAddedAsync", [user, entity]);
    }

    _prepareEntityToBeUpdatedAsync(user, entity, delta) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then((delta) => {
                let options = this.decoratorOptions[decorator.name];
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
            let options = this.decoratorOptions[decorator.name];
            return promise.then(() => {
                return this._invokeMethodAsync(decorator, "validateEntityToBeUpdatedAsync", [user, entity, delta, options]);
            });
        }, Promise.resolve()).then(() => {
            return delta;
        });
    }

    addEntityAsync(user, entity) {
        this._assertUser(user);

        return this._prepareEntityToBeAddedAsync(user, entity).then(() => {
            return this._validateEntityToBeAddedAsync(user, entity);
        }).then(() => {
            return this.table.addEntityAsync(entity);
        }).then((entity) => {
            return this._entityAddedAsync(user, entity);
        });
    }

    asQueryable(user) {
        this._assertUser(user);

        let provider = this.getQueryProvider(user);
        let queryable = new Queryable();

        queryable.provider = provider;

        return queryable;
    }

    getQueryProvider(user) {
        this._assertUser(user);

        return new MetaProvider(user, this);
    }

    removeEntityAsync(user, entity) {
        this._assertUser(user);

        Object.freeze(entity);
        return this._approveEntityToBeRemovedAsync(user, entity).then(() => {
            return this.table.removeEntityAsync(entity);
        }).then(() => {
            return this._entityRemovedAsync(user, entity);
        });
    }

    updateEntityAsync(user, entity, delta) {
        this._assertUser(user);

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
            return this._entityUpdatedAsync(updatedEntity, delta);
        }).then(() => {
            return updatedEntity;
        });
    }

}