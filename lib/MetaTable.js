"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Table = require("./sqlite/Table");

var _Table2 = _interopRequireDefault(_Table);

var _MetaProvider = require("./MetaProvider");

var _MetaProvider2 = _interopRequireDefault(_MetaProvider);

var _Queryable = require("./query/Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

var _User = require("./User");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultDecorators = {
    name: null,
    edm: null,
    table: null,
    decorators: []
};

var MetaTable = function () {
    function MetaTable() {
        var _this = this;

        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$table = _ref.table,
            table = _ref$table === undefined ? null : _ref$table,
            _ref$decorators = _ref.decorators,
            decorators = _ref$decorators === undefined ? [] : _ref$decorators;

        _classCallCheck(this, MetaTable);

        this.table = table;
        this.name = table.name;
        this.edm = table.edm;
        this.edmTable = this._getEdmTable(this.name);
        this.decoratorOptions = {};
        this.decorators = decorators.filter(function (decorator) {
            var decorators = _this.edmTable.decorators || [];

            return decorators.findIndex(function (tableDecorator) {
                _this.decoratorOptions[tableDecorator.name] = tableDecorator.options;
                return tableDecorator.name === decorator.name;
            }) > -1;
        });
    }

    _createClass(MetaTable, [{
        key: "_approveEntityToBeRemovedAsync",
        value: function _approveEntityToBeRemovedAsync(user, entity) {
            return this._invokeMethodOnDecoratorsAsync("approveEntityToBeRemovedAsync", [user, entity]).then(function () {
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
            return this._invokeMethodWithRecoveryOnDecoratorsAsync("entityAddedAsync", [user, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_entityRemovedAsync",
        value: function _entityRemovedAsync(user, entity) {
            return this._invokeMethodWithRecoveryOnDecoratorsAsync("entityRemovedAsync", [user, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_entityUpdatedAsync",
        value: function _entityUpdatedAsync(user, entity, delta) {
            var _this2 = this;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = _this2.decoratorOptions[decorator.name];
                    return _this2._invokeMethodWithRecoveryAsync(decorator, "entityUpdatedAsync", [user, entity, delta, options]);
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
        value: function _invokeMethodOnDecoratorsAsync(method, args) {
            var _this3 = this;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = _this3.decoratorOptions[decorator.name];
                    var customArgs = args.slice();
                    customArgs.push(options);

                    return _this3._invokeMethodAsync(decorator, method, customArgs);
                });
            }, Promise.resolve());
        }
    }, {
        key: "_invokeMethodWithRecoveryOnDecoratorsAsync",
        value: function _invokeMethodWithRecoveryOnDecoratorsAsync(method, args) {
            var _this4 = this;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = _this4.decoratorOptions[decorator.name];
                    var customArgs = args.slice();
                    customArgs.push(options);

                    return _this4._invokeMethodWithRecoveryAsync(decorator, method, customArgs);
                });
            }, Promise.resolve());
        }
    }, {
        key: "_prepareEntityToBeAddedAsync",
        value: function _prepareEntityToBeAddedAsync(user, entity) {
            return this._invokeMethodOnDecoratorsAsync("prepareEntityToBeAddedAsync", [user, entity]);
        }
    }, {
        key: "_prepareEntityToBeUpdatedAsync",
        value: function _prepareEntityToBeUpdatedAsync(user, entity, delta) {
            var _this5 = this;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function (delta) {
                    var options = _this5.decoratorOptions[decorator.name];
                    return _this5._invokeMethodAsync(decorator, "prepareEntityToBeUpdatedAsync", [user, entity, delta, options]);
                });
            }, Promise.resolve(delta));
        }
    }, {
        key: "_validateEntityToBeAddedAsync",
        value: function _validateEntityToBeAddedAsync(user, entity) {
            Object.freeze(entity);

            return this._invokeMethodOnDecoratorsAsync("validateEntityToBeAddedAsync", [user, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_validateEntityToBeUpdatedAsync",
        value: function _validateEntityToBeUpdatedAsync(user, entity, delta) {
            var _this6 = this;

            Object.freeze(delta);

            return this.decorators.reduce(function (promise, decorator) {
                var options = _this6.decoratorOptions[decorator.name];
                return promise.then(function () {
                    return _this6._invokeMethodAsync(decorator, "validateEntityToBeUpdatedAsync", [user, entity, delta, options]);
                });
            }, Promise.resolve()).then(function () {
                return delta;
            });
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
            var queryable = new _Queryable2.default();

            queryable.provider = provider;

            return queryable;
        }
    }, {
        key: "getQueryProvider",
        value: function getQueryProvider(user) {
            this._assertUser(user);

            return new _MetaProvider2.default(user, this);
        }
    }, {
        key: "removeEntityAsync",
        value: function removeEntityAsync(user, entity) {
            var _this8 = this;

            this._assertUser(user);

            Object.freeze(entity);
            return this._approveEntityToBeRemovedAsync(user, entity).then(function () {
                return _this8.table.removeEntityAsync(entity);
            }).then(function () {
                return _this8._entityRemovedAsync(user, entity);
            });
        }
    }, {
        key: "updateEntityAsync",
        value: function updateEntityAsync(user, entity, delta) {
            var _this9 = this;

            this._assertUser(user);

            Object.freeze(entity);
            var updatedEntity = void 0;

            return this._prepareEntityToBeUpdatedAsync(user, entity, delta).then(function (delta) {
                return _this9._validateEntityToBeUpdatedAsync(user, entity, delta);
            }).then(function (delta) {
                return _this9.table.updateEntityAsync(user, entity, delta).then(function (entity) {
                    updatedEntity = entity;
                    return delta;
                });
            }).then(function (delta) {
                return _this9._entityUpdatedAsync(updatedEntity, delta);
            }).then(function () {
                return updatedEntity;
            });
        }
    }]);

    return MetaTable;
}();

exports.default = MetaTable;
//# sourceMappingURL=MetaTable.js.map