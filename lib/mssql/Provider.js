"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Visitor = require("./Visitor");

var _Visitor2 = _interopRequireDefault(_Visitor);

var _EntityBuilder = require("./EntityBuilder");

var _EntityBuilder2 = _interopRequireDefault(_EntityBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Provider = function () {
    function Provider(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Provider);

        if (options.mssqlDatabase == null) {
            throw new Error("Null Argument Exception: mssqlDatabase is required in options.");
        }

        if (options.edm == null) {
            throw new Error("Null Argument Exception: edm is required in options.");
        }

        if (options.schema == null) {
            throw new Error("Null Argument Exception: schema is required in options");
        }

        this.edm = options.edm;
        this.mssqlDatabase = options.mssqlDatabase;
        this.schema = options.schema;
        this.name = name;

        this.entityBuilder = new _EntityBuilder2.default(name, this.edm);
    }

    _createClass(Provider, [{
        key: "toArrayAsync",
        value: function toArrayAsync(queryable) {
            var _this = this;

            var query = queryable.getQuery();
            var visitor = new _Visitor2.default(this.name, this.edm, this.schema);
            var statement = visitor.createSelectStatement(query);

            return this.mssqlDatabase.all(statement).then(function (results) {
                return _this.entityBuilder.convert(results);
            });
        }
    }, {
        key: "toArrayWithCountAsync",
        value: function toArrayWithCountAsync(queryable) {
            var _this2 = this;

            var count = 0;
            return this.countAsync(function (c) {
                count = c;
                return _this2.toArrayAsync(queryable);
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
            var visitor = new _Visitor2.default(this.name, this.edm, this.schema);
            var statement = visitor.createSelectStatementWithCount(query);

            return this.sqliteDatabase.get(statement).then(function (result) {
                return result.count;
            });
        }
    }]);

    return Provider;
}();

exports.default = Provider;
//# sourceMappingURL=Provider.js.map