"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Visitor = require("./Visitor");

var _Visitor2 = _interopRequireDefault(_Visitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryBuilder = function () {
    function QueryBuilder(edm) {
        _classCallCheck(this, QueryBuilder);

        this.edm = edm;
    }

    _createClass(QueryBuilder, [{
        key: "_createAscendingExpression",
        value: function _createAscendingExpression(columns) {
            var ascending = columns.join(", ");

            if (ascending.length > 0) {
                ascending = ascending + " ASC";
            }

            return ascending;
        }
    }, {
        key: "_createDescendingExpression",
        value: function _createDescendingExpression(columns) {
            var desceding = columns.join(", ");

            if (desceding.length > 0) {
                desceding = desceding + " DESC";
            }

            return desceding;
        }
    }, {
        key: "_createLimitClause",
        value: function _createLimitClause(value) {
            if (value === Infinity) {
                return "LIMIT -1";
            } else if (typeof value === "number") {
                return "LIMIT " + value;
            } else {
                return "";
            }
        }
    }, {
        key: "_createOffsetClause",
        value: function _createOffsetClause(value) {
            return "OFFSET " + value;
        }
    }, {
        key: "_createOrderByClause",
        value: function _createOrderByClause(orderBy) {

            var accumulator = {
                ASC: [],
                DESC: []
            };

            orderBy.reduce(function (accumulator, orderBy) {
                if (Array.isArray(accumulator[orderBy.type])) {
                    accumulator[orderBy.type].push(orderBy.column);
                }
                return accumulator;
            }, accumulator);

            var ascending = this._createAscendingExpression(accumulator.ASC);
            var desceding = this._createDescendingExpression(accumulator.DESC);

            var orderByClause = [ascending, desceding].filter(this._isNotEmptyFilter).join(",");

            if (orderByClause.length > 0) {
                return "ORDER BY " + orderByClause;
            } else {
                return orderByClause;
            }
        }
    }, {
        key: "_createSelectStatement",
        value: function _createSelectStatement(query) {
            var _this = this;

            var tableName = query.type;
            var mapping = query.select;
            var keys = Object.keys(mapping);

            if (keys.length === 0) {
                return "SELECT * FROM " + this._escapeIdentifier(tableName);
            } else {
                var columns = keys.map(function (key) {
                    return _this._escapeIdentifier(key) + " AS " + _this._escapeIdentifier(mapping[key]);
                }).join(", ");

                return "SELECT " + columns + " FROM " + this._escapeIdentifier(tableName);
            }
        }
    }, {
        key: "_createSelectStatementWithCount",
        value: function _createSelectStatementWithCount(tableName) {
            return "SELECT COUNT(*) AS count FROM " + this._escapeIdentifier(tableName);
        }
    }, {
        key: "_createWhereClause",
        value: function _createWhereClause(query) {
            var visitor = new _Visitor2.default(query.type, this.edm);

            return visitor.parse(query.where);
        }
    }, {
        key: "_escapeIdentifier",
        value: function _escapeIdentifier(value) {
            if (value == null) {
                return value;
            }

            return "\"" + value.replace(/\"/g, '""') + "\"";
        }
    }, {
        key: "_isNotEmptyFilter",
        value: function _isNotEmptyFilter(part) {
            return typeof part === "string" && part.length > 0;
        }
    }, {
        key: "createStatement",
        value: function createStatement(query) {
            var parts = [];
            var select = this._createSelectStatement(query);
            var where = this._createWhereClause(query);
            var orderBy = this._createOrderByClause(query.orderBy);
            var limit = this._createLimitClause(query.take);
            var offset = this._createOffsetClause(query.skip);

            parts.push(select, where, orderBy, limit, offset);

            parts = parts.filter(this._isNotEmptyFilter);

            return parts.join(" ");
        }
    }, {
        key: "createCountStatement",
        value: function createCountStatement(query) {
            var parts = [];
            var select = this._createSelectStatementWithCount(query);
            var where = this._createWhereClause(query);

            parts.push(select, where);

            parts = parts.filter(this._isNotEmptyFilter);

            return parts.join(" ");
        }
    }]);

    return QueryBuilder;
}();

exports.default = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map