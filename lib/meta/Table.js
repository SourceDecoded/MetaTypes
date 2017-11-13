"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Provider = require("./Provider");

var _Provider2 = _interopRequireDefault(_Provider);

var _queryablejs = require("queryablejs");

var _User = require("./../user/User");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultDecorators = {
    name: null,
    edm: null,
    table: null,
    decorators: []
};

var Table = function () {
    function Table() {
        var _this = this;

        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$metaDatabase = _ref.metaDatabase,
            metaDatabase = _ref$metaDatabase === undefined ? null : _ref$metaDatabase,
            _ref$table = _ref.table,
            table = _ref$table === undefined ? null : _ref$table,
            _ref$decorators = _ref.decorators,
            decorators = _ref$decorators === undefined ? [] : _ref$decorators,
            _ref$fileSystem = _ref.fileSystem,
            fileSystem = _ref$fileSystem === undefined ? null : _ref$fileSystem;

        _classCallCheck(this, Table);

        if (table == null) {
            throw new Error("Null Argument Exception: Table needs to have a ITable.");
        }

        if (metaDatabase == null) {
            throw new Error("Null Argument Exception: Table needs to have a metaDatabase.");
        }

        if (fileSystem == null) {
            throw new Error("Null Argument Exception: MetaTable needs to have a fileSystem.");
        }

        this.table = table;
        this.metaDatabase = metaDatabase;
        this.name = table.name;
        this.edm = table.edm;
        this.fileSystem = fileSystem;
        this.edmTable = this._getEdmTable(this.name);
        this.decoratorOptions = {};
        this.decorators = decorators.filter(function (decorator) {
            var decorators = _this.edmTable.decorators || [];

            return decorators.findIndex(function (tableDecorator) {
                _this.decoratorOptions[tableDecorator.name] = tableDecorator.options;
                return tableDecorator.name === decorator.name;
            }) > -1;
        });

        this.decorators.reduce(function (previous, current) {
            return previous.then(function () {
                return current.activatedAsync(_this.metaDatabase);
            });
        }, Promise.resolve());
    }

    _createClass(Table, [{
        key: "_approveEntityToBeRemovedAsync",
        value: function _approveEntityToBeRemovedAsync(user, entity) {
            return this._invokeMethodOnDecoratorsAsync(user, "approveEntityToBeRemovedAsync", [this.name, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_assertUser",
        value: function _assertUser(user) {
            if (!(user instanceof _User2.default)) {
                throw new Error("Illegal Argument Exception: user needs to be an instance of User.");
            }
        }
    }, {
        key: "_entityAddedAsync",
        value: function _entityAddedAsync(user, entity) {
            return this._invokeMethodWithRecoveryOnDecoratorsAsync(user, "entityAddedAsync", [this.name, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_entityRemovedAsync",
        value: function _entityRemovedAsync(user, entity) {
            return this._invokeMethodWithRecoveryOnDecoratorsAsync(user, "entityRemovedAsync", [this.name, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_entityUpdatedAsync",
        value: function _entityUpdatedAsync(user, entity, delta) {
            var _this2 = this;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = Object.assign({ user: user }, _this2.decoratorOptions[decorator.name]);
                    return _this2._invokeMethodWithRecoveryAsync(decorator, "entityUpdatedAsync", [_this2.name, entity, delta, options]);
                });
            }, Promise.resolve());
        }
    }, {
        key: "_getEdmTable",
        value: function _getEdmTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "_getPrimaryKeyColumn",
        value: function _getPrimaryKeyColumn() {
            return this._getEdmTable(this.name).columns.find(function (column) {
                return column.isPrimaryKey;
            });
        }
    }, {
        key: "_getPrimaryKeyName",
        value: function _getPrimaryKeyName() {
            return this._getPrimaryKeyColumn().name;
        }
    }, {
        key: "_getFilePathById",
        value: function _getFilePathById(id) {
            return this.edm.name + "_" + this.edm.version + "_" + this.edmTable.name + "_" + id;
        }
    }, {
        key: "_invokeMethodAsync",
        value: function _invokeMethodAsync(obj, method) {
            var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            if (obj != null && typeof obj[method] === "function") {
                var result = obj[method].apply(obj, args);

                if (!(result instanceof Promise)) {
                    result = Promise.resolve(result);
                }

                return result;
            }

            return Promise.resolve();
        }
    }, {
        key: "_invokeMethodWithRecoveryAsync",
        value: function _invokeMethodWithRecoveryAsync(obj, method) {
            var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            var promise = Promise.resolve();

            if (obj != null && typeof obj[method] === "function") {
                promise = obj[method].apply(obj, args);

                if (!(promise instanceof Promise)) {
                    promise = Promise.resolve(promise);
                }
            }

            return promise.catch(function (eror) {
                // Log error.
                return null;
            });
        }
    }, {
        key: "_invokeMethodOnDecoratorsAsync",
        value: function _invokeMethodOnDecoratorsAsync(user, method, args) {
            var _this3 = this;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = Object.assign({ user: user }, _this3.decoratorOptions[decorator.name]);

                    var customArgs = args.slice();
                    customArgs.push(options);

                    return _this3._invokeMethodAsync(decorator, method, customArgs);
                });
            }, Promise.resolve());
        }
    }, {
        key: "_invokeMethodWithRecoveryOnDecoratorsAsync",
        value: function _invokeMethodWithRecoveryOnDecoratorsAsync(user, method) {
            var _this4 = this;

            var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = Object.assign({ user: user }, _this4.decoratorOptions[decorator.name]);
                    var customArgs = args.slice();
                    customArgs.push(options);

                    return _this4._invokeMethodWithRecoveryAsync(decorator, method, customArgs);
                });
            }, Promise.resolve());
        }
    }, {
        key: "_prepareEntityToBeAddedAsync",
        value: function _prepareEntityToBeAddedAsync(user, entity) {
            return this._invokeMethodOnDecoratorsAsync(user, "prepareEntityToBeAddedAsync", [this.name, entity]);
        }
    }, {
        key: "_prepareEntityToBeUpdatedAsync",
        value: function _prepareEntityToBeUpdatedAsync(user, entity, delta) {
            var _this5 = this;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function (delta) {
                    var options = Object.assign({ user: user }, _this5.decoratorOptions[decorator.name]);
                    return _this5._invokeMethodAsync(decorator, "prepareEntityToBeUpdatedAsync", [_this5.name, entity, delta, options]);
                }).then(function () {
                    return delta;
                });
            }, Promise.resolve(delta));
        }
    }, {
        key: "_validateEntityToBeAddedAsync",
        value: function _validateEntityToBeAddedAsync(user, entity) {
            Object.freeze(entity);

            return this._invokeMethodOnDecoratorsAsync(user, "validateEntityToBeAddedAsync", [this.name, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_validateEntityToBeUpdatedAsync",
        value: function _validateEntityToBeUpdatedAsync(user, entity, delta) {
            var _this6 = this;

            Object.freeze(delta);

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = Object.assign({ user: user }, _this6.decoratorOptions[decorator.name]);
                    return _this6._invokeMethodAsync(decorator, "validateEntityToBeUpdatedAsync", [_this6.name, entity, delta, options]);
                });
            }, Promise.resolve()).then(function () {
                return delta;
            });
        }
    }, {
        key: "addDecoratorAsync",
        value: function addDecoratorAsync(decorator) {
            var decoratorInstance = this.metaDatabase.decorators.find(function (instance) {
                return instance.name === decorator.name;
            });
            this.decorators.push(decoratorInstance);
            return decoratorInstance.activatedAsync(this.metaDatabase);
        }
    }, {
        key: "addEntityAsync",
        value: function addEntityAsync(user, entity) {
            var _this7 = this;

            this._assertUser(user);

            return this._prepareEntityToBeAddedAsync(user, entity).then(function () {
                return _this7._validateEntityToBeAddedAsync(user, entity);
            }).then(function () {
                return _this7.table.addEntityAsync(entity);
            }).then(function (entity) {
                return _this7._entityAddedAsync(user, entity);
            });
        }
    }, {
        key: "asQueryable",
        value: function asQueryable(user) {
            this._assertUser(user);

            var provider = this.getQueryProvider(user);
            var queryable = new _queryablejs.Queryable(this.table.name);

            queryable.provider = provider;

            return queryable;
        }
    }, {
        key: "getFileSizeByIdAsync",
        value: function getFileSizeByIdAsync(user, id) {
            var _this8 = this;

            return this.getEntityByIdAsync(user, id).then(function (entity) {
                return _this8.getFileSizeAsync(_this8._getFilePathById(id));
            });
        }
    }, {
        key: "getFileReadStreamByIdAsync",
        value: function getFileReadStreamByIdAsync(user, id) {
            var _this9 = this;

            return this.getEntityByIdAsync(user, id).then(function (entity) {
                return _this9.fileSystem.getReadStreamAsync(_this9._getFilePathById(id));
            });
        }
    }, {
        key: "getFileWriteStreamByIdAsync",
        value: function getFileWriteStreamByIdAsync(user, id) {
            var _this10 = this;

            var filePath = this._getFilePathById(id);
            return this.getEntityByIdAsync(user, id).then(function (entity) {
                return _this10.fileSystem.getWriteStreamAsync(filePath);
            }).then(function (writable) {
                writable.on("finish", function () {
                    _this10._invokeMethodWithRecoveryOnDecoratorsAsync(user, "fileUpdatedAsync", [id, filePath]);
                });
                return writable;
            });
        }
    }, {
        key: "getEntityByIdAsync",
        value: function getEntityByIdAsync(user, id) {
            var primaryKey = this._getPrimaryKeyName();
            return this.asQueryable(user).where(function (expBuilder) {
                return expBuilder.property(primaryKey).isEqualTo(id);
            }).toArrayAsync().then(function (results) {
                if (results.length === 1) {
                    return results[0];
                }

                throw new Error("Entity Not Found");
            });
        }
    }, {
        key: "getQueryProvider",
        value: function getQueryProvider(user) {
            this._assertUser(user);

            return new _Provider2.default(user, this, this.metaDatabase);
        }
    }, {
        key: "removeDecoratorAsync",
        value: function removeDecoratorAsync(decoratorName) {
            var index = this.decorators.findIndex(function (decorator) {
                return decorator.name === decoratorName;
            });

            table.decorators.splice(index, 1);

            return Promise.resolve();
        }
    }, {
        key: "removeEntityAsync",
        value: function removeEntityAsync(user, entity) {
            var _this11 = this;

            this._assertUser(user);

            Object.freeze(entity);
            return this._approveEntityToBeRemovedAsync(user, entity).then(function () {
                var primaryKey = _this11._getPrimaryKeyName();

                return _this11.removeFileByIdAsync(user, entity[primaryKey]).catch(function (error) {
                    return;
                });
            }).then(function () {
                return _this11.table.removeEntityAsync(entity);
            }).then(function () {
                return _this11._entityRemovedAsync(user, entity);
            });
        }
    }, {
        key: "removeFileByIdAsync",
        value: function removeFileByIdAsync(user, id) {
            var _this12 = this;

            var filePath = this._getFilePathById(id);

            return this.getEntityByIdAsync(user, id).then(function () {
                return _this12.fileSystem.removeFileAsync(filePath);
            }).then(function () {
                return _this12._invokeMethodWithRecoveryOnDecoratorsAsync(user, "fileRemovedAsync", [id, filePath]);
            });
        }
    }, {
        key: "updateEntityAsync",
        value: function updateEntityAsync(user, entity, delta) {
            var _this13 = this;

            this._assertUser(user);

            Object.freeze(entity);
            var updatedEntity = void 0;

            return this._prepareEntityToBeUpdatedAsync(user, entity, delta).then(function (delta) {
                return _this13._validateEntityToBeUpdatedAsync(user, entity, delta);
            }).then(function (delta) {
                return _this13.table.updateEntityAsync(user, entity, delta).then(function (entity) {
                    updatedEntity = entity;
                    return delta;
                });
            }).then(function (delta) {
                return _this13._entityUpdatedAsync(user, updatedEntity, delta);
            }).then(function () {
                return updatedEntity;
            });
        }
    }]);

    return Table;
}();

exports.default = Table;
//# sourceMappingURL=Table.js.map