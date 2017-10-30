"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Provider = function () {
    function Provider(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Provider);

        if (options.sqliteDatabase == null) {
            throw new Error("Null Argument Exception: sqliteDatabase is required in options.");
        }

        if (options.edm == null) {
            throw new Error("Null Argument Exception: edm is required in options.");
        }

        this.edm = options.edm;
        this.sqliteDatabase = options.sqliteDatabase;
        this.name = name;
        this.queryBuilder = new QueryBuilder(this.edm);
    }

    _createClass(Provider, [{
        key: "toArrayAsync",
        value: function toArrayAsync(queryable) {
            var query = queryable.getQuery();
            var statement = this.queryBuilder.createStatement(query);

            return this.sqliteDatabase.all(statement);
        }
    }, {
        key: "toArrayWithCountAsync",
        value: function toArrayWithCountAsync(queryable) {
            var _this = this;

            var count = 0;
            return this.countAsync(function (c) {
                count = c;
                return _this.toArrayAsync(queryable);
            }).then(function (results) {
                return {
                    count: count,
                    results: results
                };
            });
        }
    }, {
        key: "countAsync",
        value: function countAsync(queryable) {
            var query = queryable.getQuery();
            var statement = this.queryBuilder.createCountStatement(query);

            return this.sqliteDatabase.get(statement).then(function (result) {
                return result.count;
            });
        }
    }]);

    return Provider;
}();

exports.default = Provider;
//# sourceMappingURL=Provider.js.map