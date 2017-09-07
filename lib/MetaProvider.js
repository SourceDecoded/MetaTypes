"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaProvider = function () {
    function MetaProvider(user, metaTable) {
        _classCallCheck(this, MetaProvider);

        this.metaTable = metaTable;
        this.provider = metaTable.table.provider;
        this.decorators = metaTable.decorators;
        this.user = user;
    }

    _createClass(MetaProvider, [{
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
        key: "_refineQueryableAsync",
        value: function _refineQueryableAsync(queryable) {
            var _this = this;

            var user = this.user;
            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function (queryable) {
                    var options = _this.metaTable.decoratorOptions[decorator.name];
                    var result = _this._invokeMethodAsync(decorator, "refineQueryableAsync", [user, queryable, options]);

                    if (!(result instanceof Promise)) {
                        return Promise.resolve(result);
                    }

                    return result;
                });
            }, Promise.resolve(queryable));
        }
    }, {
        key: "toArrayAsync",
        value: function toArrayAsync(queryable) {
            var _this2 = this;

            var user = this.user;

            return this._refineQueryableAsync(queryable).then(function (queryable) {
                return _this2.provider.toArrayAsync(queryable);
            });
        }
    }, {
        key: "toArrayWithCountAsync",
        value: function toArrayWithCountAsync(queryable) {
            var _this3 = this;

            var user = this.user;

            return this._refineQueryableAsync(queryable).then(function (queryable) {
                return _this3.provider.toArrayWithCountAsync(queryable);
            });
        }
    }, {
        key: "countAsync",
        value: function countAsync(queryable) {
            var _this4 = this;

            var user = this.user;

            return this._refineQueryableAsync(queryable).then(function (queryable) {
                return _this4.provider.countAsync(queryable);
            });
        }
    }]);

    return MetaProvider;
}();

exports.default = MetaProvider;
//# sourceMappingURL=MetaProvider.js.map