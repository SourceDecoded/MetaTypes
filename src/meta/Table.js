import Provider from "./Provider";
import { Queryable } from "queryablejs";
import User from "./../user/User";

const defaultDecorators = {
    name: null,
    edm: null,
    table: null,
    decorators: []
};

export default class Table {
    constructor({
        database = null,
        table = null,
        decorators = [],
        fileSystem = null
         } = {}) {

        if (table == null) {
            throw new Error("Null Argument Exception: Table needs to have a ITable.");
        }

        if (database == null) {
            throw new Error("Null Argument Exception: Table needs to have a meta database.");
        }

        if (fileSystem == null) {
            throw new Error("Null Argument Exception: MetaTable needs to have a fileSystem.");
        }

        this.table = table;
        this.database = database;
        this.name = table.name;
        this.edm = table.edm;
        this.fileSystem = fileSystem;
        this.edmTable = this._getEdmTable(this.name);
        this.decoratorOptions = {};
        this.decorators = decorators.filter((decorator) => {
            let decorators = this.edmTable.decorators || [];

            return decorators.findIndex((tableDecorator) => {
                this.decoratorOptions[tableDecorator.name] = tableDecorator.options;
                return tableDecorator.name === decorator.name
            }) > -1;
        });

        this.decorators.reduce((previous, current) => {
            return previous.then(() => {
                return current.activatedAsync(this.database);
            });
        }, Promise.resolve());
    }

    _approveEntityToBeRemovedAsync(user, entity) {
        return this._invokeMethodOnDecoratorsAsync(user, "approveEntityToBeRemovedAsync", [this.name, entity]).then(() => {
            return entity;
        });
    }

    _assertUser(user) {
        if (!(user instanceof User)) {
            throw new Error("Illegal Argument Exception: user needs to be an instance of User.");
        }
    }

    _entityAddedAsync(user, entity) {
        return this._invokeMethodWithRecoveryOnDecoratorsAsync(user, "entityAddedAsync", [this.name, entity]).then(() => {
            return entity;
        });
    }

    _entityRemovedAsync(user, entity) {
        return this._invokeMethodWithRecoveryOnDecoratorsAsync(user, "entityRemovedAsync", [this.name, entity]).then(() => {
            return entity;
        });
    }

    _entityUpdatedAsync(user, entity, delta) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then(() => {
                let options = Object.assign({ user }, this.decoratorOptions[decorator.name]);
                return this._invokeMethodWithRecoveryAsync(decorator, "entityUpdatedAsync", [this.name, entity, delta, options]);
            });
        }, Promise.resolve());
    }

    _getEdmTable(name) {
        return this.edm.tables.find((table) => {
            return table.name === name;
        });
    }

    _getPrimaryKeyColumn() {
        return this._getEdmTable(this.name).columns.find((column) => {
            return column.isPrimaryKey;
        });
    }

    _getPrimaryKeyName() {
        return this._getPrimaryKeyColumn().name;
    }

    _getFilePathById(id) {
        return `${this.edm.name}_${this.edm.version}_${this.edmTable.name}_${id}`;
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

    _invokeMethodOnDecoratorsAsync(user, method, args) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then(() => {
                let options = Object.assign({ user: user }, this.decoratorOptions[decorator.name]);

                let customArgs = args.slice();
                customArgs.push(options);

                return this._invokeMethodAsync(decorator, method, customArgs);
            });
        }, Promise.resolve());
    }

    _invokeMethodWithRecoveryOnDecoratorsAsync(user, method, args = []) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then(() => {
                let options = Object.assign({ user: user }, this.decoratorOptions[decorator.name]);
                let customArgs = args.slice();
                customArgs.push(options);

                return this._invokeMethodWithRecoveryAsync(decorator, method, customArgs);
            });
        }, Promise.resolve());
    }

    _prepareEntityToBeAddedAsync(user, entity) {
        return this._invokeMethodOnDecoratorsAsync(user, "prepareEntityToBeAddedAsync", [this.name, entity]);
    }

    _prepareEntityToBeUpdatedAsync(user, entity, delta) {
        return this.decorators.reduce((promise, decorator) => {
            return promise.then((delta) => {
                let options = Object.assign({ user: user }, this.decoratorOptions[decorator.name]);
                return this._invokeMethodAsync(decorator, "prepareEntityToBeUpdatedAsync", [this.name, entity, delta, options]);
            }).then(() => { return delta });
        }, Promise.resolve(delta))
    }

    _validateEntityToBeAddedAsync(user, entity) {
        Object.freeze(entity);

        return this._invokeMethodOnDecoratorsAsync(user, "validateEntityToBeAddedAsync", [this.name, entity]).then(() => {
            return entity;
        });
    }

    _validateEntityToBeUpdatedAsync(user, entity, delta) {
        Object.freeze(delta);

        return this.decorators.reduce((promise, decorator) => {
            return promise.then(() => {
                let options = Object.assign({ user: user }, this.decoratorOptions[decorator.name]);
                return this._invokeMethodAsync(decorator, "validateEntityToBeUpdatedAsync", [this.name, entity, delta, options]);
            });
        }, Promise.resolve()).then(() => {
            return delta;
        });
    }

    addDecoratorAsync(decorator) {
        this.decorators.push(decorator);
        return decorator.activatedAsync(this.database);
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
        let queryable = new Queryable(this.table.name);

        queryable.provider = provider;

        return queryable;
    }

    getFileSizeByIdAsync(user, id) {
        return this.getEntityByIdAsync(user, id).then((entity) => {
            return this.getFileSizeAsync(this._getFilePathById(id));
        });
    }

    getFileReadStreamByIdAsync(user, id) {
        return this.getEntityByIdAsync(user, id).then((entity) => {
            return this.fileSystem.getReadStreamAsync(this._getFilePathById(id));
        });
    }

    getFileWriteStreamByIdAsync(user, id) {
        let filePath = this._getFilePathById(id);
        return this.getEntityByIdAsync(user, id).then((entity) => {
            return this.fileSystem.getWriteStreamAsync(filePath);
        }).then((writable) => {
            writable.on("finish", () => {
                this._invokeMethodWithRecoveryOnDecoratorsAsync(user, "fileUpdatedAsync", [id, filePath]);
            });
            return writable;
        });
    }

    getEntityByIdAsync(user, id) {
        let primaryKey = this._getPrimaryKeyName();
        return this.asQueryable(user).where((expBuilder) => {
            return expBuilder.property(primaryKey).isEqualTo(id);
        }).toArrayAsync().then((results) => {
            if (results.length === 1) {
                return results[0];
            }

            throw new Error("Entity Not Found");
        });
    }

    getQueryProvider(user) {
        this._assertUser(user);

        return new Provider(user, this, this.database);
    }

    removeDecoratorAsync(decoratorName) {
        let index = this.decorators.findIndex((decorator) => {
            return decorator.name === decoratorName;
        });

        table.decorators.splice(index, 1);

        return Promise.resolve();
    }

    removeEntityAsync(user, entity) {
        this._assertUser(user);

        Object.freeze(entity);
        return this._approveEntityToBeRemovedAsync(user, entity).then(() => {
            let primaryKey = this._getPrimaryKeyName();

            return this.removeFileByIdAsync(user, entity[primaryKey]).catch((error) => {
                return;
            });
        }).then(() => {
            return this.table.removeEntityAsync(entity);
        }).then(() => {
            return this._entityRemovedAsync(user, entity);
        });
    }

    removeFileByIdAsync(user, id) {
        let filePath = this._getFilePathById(id);

        return this.getEntityByIdAsync(user, id).then(() => {
            return this.fileSystem.removeFileAsync(filePath);
        }).then(() => {
            return this._invokeMethodWithRecoveryOnDecoratorsAsync(user, "fileRemovedAsync", [id, filePath]);
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
            return this._entityUpdatedAsync(user, updatedEntity, delta);
        }).then(() => {
            return updatedEntity;
        });
    }

}