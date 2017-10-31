"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryablejs = require("queryablejs");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Provider = function () {
    function Provider(user, metaTable, metaDatabase) {
        _classCallCheck(this, Provider);

        this.metaTable = metaTable;
        this.metaDatabase = metaDatabase;
        this.provider = metaTable.table.provider;
        this.decorators = metaTable.decorators;
        this.user = user;
    }

    _createClass(Provider, [{
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
        key: "_refineInnerQueriesAsync",
        value: function _refineInnerQueriesAsync(queryable) {
            var _this = this;

            var user = this.user;
            var query = queryable.getQuery();
            var innerQueries = query.where.getMatchingNodes(new _queryablejs.ValueExpression("queryable"));

            return innerQueries.reduce(function (promise, queryableExpression) {
                var query = queryableExpression.value;
                var queryable = new _queryablejs.Queryable(query.type, query);
                var metaTable = _this.metaDatabase.getTable(query.type);
                var previousQueryable = queryable;

                return promise.then(function () {
                    return _this.decorators.reduce(function (promise, decorator) {
                        return promise.then(function (queryable) {
                            previousQueryable = queryable;

                            var options = metaTable.decoratorOptions[decorator.name];
                            var result = _this._invokeMethodAsync(decorator, "refineQueryableAsync", [user, queryable, options]);

                            if (result == null) {
                                result = queryable;
                            }

                            if (!(result instanceof Promise)) {
                                return Promise.resolve(result);
                            }

                            return result;
                        }).then(function (queryable) {
                            if (!(queryable instanceof _queryablejs.Queryable)) {
                                return previousQueryable;
                            }

                            var modifiedQuery = query.getQuery();
                            query.select = modifiedQuery.select;
                            query.where = modifiedQuery.where;
                            query.orderBy = modifiedQuery.orderBy;
                            query.skip = modifiedQuery.skip;
                            query.take = modifiedQuery.take;
                            query.type = modifiedQuery.type;

                            return queryable;
                        });
                    }, Promise.resolve(queryable));
                });
            }, Promise.resolve()).then(function () {
                return queryable;
            });
        }
    }, {
        key: "_refineQueryableAsync",
        value: function _refineQueryableAsync(queryable) {
            var _this2 = this;

            var user = this.user;

            return this._refineInnerQueriesAsync(queryable).then(function (queryable) {
                var previousQueryable = queryable;

                return _this2.decorators.reduce(function (promise, decorator) {
                    return promise.then(function (queryable) {
                        previousQueryable = queryable;

                        var options = _this2.metaTable.decoratorOptions[decorator.name];
                        var result = _this2._invokeMethodAsync(decorator, "refineQueryableAsync", [user, queryable, options]);

                        if (result == null) {
                            result = queryable;
                        }

                        if (!(result instanceof Promise)) {
                            return Promise.resolve(result);
                        }

                        return result;
                    }).then(function (queryable) {
                        if (!(queryable instanceof _queryablejs.Queryable)) {
                            return previousQueryable;
                        }
                        return queryable;
                    });
                }, Promise.resolve(queryable));
            });
        }
    }, {
        key: "toArrayAsync",
        value: function toArrayAsync(queryable) {
            var _this3 = this;

            var user = this.user;

            return this._refineQueryableAsync(queryable).then(function (queryable) {
                return _this3.provider.toArrayAsync(queryable);
            }).then(function (results) {
                // We need to save the previous results just in case the decorator doesn't implement
                // the life-cycle or it returns something that isn't an array.
                var previousResults = results;

                return _this3.decorators.reduce(function (promise, decorator) {
                    return promise.then(function (results) {
                        if (!Array.isArray(results) || results.length !== previousResults.length) {
                            results = previousResults;
                        }

                        previousResults = results;

                        _this3._invokeMethodAsync(decorator, "mapAsync", [results]);
                    });
                }, Promise.resolve(results));
            });
        }
    }, {
        key: "toArrayWithCountAsync",
        value: function toArrayWithCountAsync(queryable) {
            var _this4 = this;

            var user = this.user;

            return this._refineQueryableAsync(queryable).then(function (queryable) {
                return _this4.provider.toArrayWithCountAsync(queryable);
            });
        }
    }, {
        key: "countAsync",
        value: function countAsync(queryable) {
            var _this5 = this;

            var user = this.user;

            return this._refineQueryableAsync(queryable).then(function (queryable) {
                return _this5.provider.countAsync(queryable);
            });
        }
    }]);

    return Provider;
}();

exports.default = Provider;
//# sourceMappingURL=Provider.js.map