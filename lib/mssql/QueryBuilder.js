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
    function QueryBuilder(edm, schema) {
        _classCallCheck(this, QueryBuilder);

        this.edm = edm;
        this.schema = schema;
    }

    _createClass(QueryBuilder, [{
        key: "_getQualifiedTableName",
        value: function _getQualifiedTableName(tableName) {
            return "[" + this.schema + "].[" + tableName + "__" + this.edm.version.replace(/\./g, "_") + "]";
        }
    }, {
        key: "_createAscendingExpression",
        value: function _createAscendingExpression(columns) {
            var ascending = columns.map(function (column) {
                return "[" + column + "] ASC";
            }).join(", ");

            return ascending;
        }
    }, {
        key: "_createDescendingExpression",
        value: function _createDescendingExpression(columns) {
            var desceding = columns.map(function (column) {
                return "[" + column + "] DESC";
            }).join(", ");

            return desceding;
        }
    }, {
        key: "_createLimitClause",
        value: function _createLimitClause(value) {
            if (value === Infinity) {
                return "";
            } else if (typeof value === "number") {
                return "FETCH NEXT (" + value + ") ROWS ONLY";
            } else {
                return "";
            }
        }
    }, {
        key: "_createOffsetClause",
        value: function _createOffsetClause(value) {
            if (typeof value !== "number") {
                value = 0;
            }
            return "OFFSET " + value + " ROWS";
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
                return 'ORDER BY (SELECT NULL)';
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
                return "SELECT * FROM " + this._getQualifiedTableName(tableName);
            } else {
                var columns = keys.map(function (key) {
                    return _this._escapeIdentifier(key) + " AS " + _this._escapeIdentifier(mapping[key]);
                }).join(", ");

                return "SELECT " + columns + " FROM " + this._getQualifiedTableName(tableName);
            }
        }
    }, {
        key: "_createSelectStatementWithCount",
        value: function _createSelectStatementWithCount(query) {
            return "SELECT COUNT(*) AS count FROM " + this._getQualifiedTableName(query.type);
        }
    }, {
        key: "_createWhereClause",
        value: function _createWhereClause(query) {
            var visitor = new _Visitor2.default(query.type, this.edm, this.schema);

            return visitor.parse(query.where);
        }
    }, {
        key: "_escapeIdentifier",
        value: function _escapeIdentifier(value) {
            if (value == null) {
                return value;
            }

            return "[" + value.replace(/\"/g, '""') + "]";
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

            parts.push(select, where, orderBy, offset, limit);

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