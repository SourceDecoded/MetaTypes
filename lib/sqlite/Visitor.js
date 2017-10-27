"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryablejs = require("queryablejs");

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SqlParts = function () {
    function SqlParts() {
        _classCallCheck(this, SqlParts);

        this.select = null;
        this.where = null;
        this.orderBy = null;
        this.skip = 0;
        this.take = Infinity;
    }

    _createClass(SqlParts, [{
        key: "toString",
        value: function toString() {
            var parts = [];

            parts.push(this.select, this.where, this.orderBy, this.take, this.skip);

            parts = parts.filter(function (part) {
                return typeof part === "string" && part.length > 0;
            });

            return parts.join(" ");
        }
    }]);

    return SqlParts;
}();

var Visitor = function (_ExpressionVisitor) {
    _inherits(Visitor, _ExpressionVisitor);

    function Visitor(name, edm) {
        _classCallCheck(this, Visitor);

        var _this = _possibleConstructorReturn(this, (Visitor.__proto__ || Object.getPrototypeOf(Visitor)).call(this));

        _this.name = name;
        _this.edm = edm;
        _this.table = _this._getTable(name);

        _this.dataConverter = {
            convertString: function convertString(value) {
                return "'" + _this._escape(value) + "'";
            },
            convertContainsString: function convertContainsString(value) {
                return "'%" + _this._escape(value) + "%'";
            },
            convertStartsWithString: function convertStartsWithString(value) {
                return "'" + _this._escape(value) + "%'";
            },
            convertEndsWithString: function convertEndsWithString(value) {
                return "'%" + _this._escape(value) + "'";
            },
            convertNumber: function convertNumber(value) {
                return value.toString();
            },
            convertBoolean: function convertBoolean(value) {
                return value ? 1 : 0;
            },
            convertDate: function convertDate(value) {
                return value.getTime();
            }
        };

        return _this;
    }

    _createClass(Visitor, [{
        key: "_escape",
        value: function _escape(value) {
            if (value == null) {
                return value;
            }

            return "" + value.replace(/'/g, "''");
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
        key: "_createSelectStatement",
        value: function _createSelectStatement(query) {
            var _this2 = this;

            var mapping = query.select.value;
            var keys = Object.keys(mapping);

            if (keys.length === 0) {
                return "SELECT * FROM " + this._escapeIdentifier(this.table.name);
            } else {
                var columns = keys.map(function (key) {
                    return _this2._escapeIdentifier(key) + " AS " + _this2._escapeIdentifier(mapping[key]);
                }).join(", ");

                return "SELECT " + columns + " FROM " + this._escapeIdentifier(this.table.name);
            }
        }
    }, {
        key: "_getTable",
        value: function _getTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "_sqlizePrimitive",
        value: function _sqlizePrimitive(value) {
            if (typeof value === "string") {
                return this.dataConverter.convertString(value);
            } else if (typeof value === "number") {
                return this.dataConverter.convertNumber(value);
            } else if (typeof value === "boolean") {
                return this.dataConverter.convertBoolean(value);
            } else if (value instanceof Date) {
                return this.dataConverter.convertDate(value);
            } else if (value == null) {
                return "NULL";
            } else {
                throw new Error("Unknown primitive type.");
            }
        }
    }, {
        key: "_writeTableProperty",
        value: function _writeTableProperty(table, column) {
            return this._escapeIdentifier(table) + "." + this._escapeIdentifier(column);
        }
    }, {
        key: "and",
        value: function and() {
            var children = Array.from(arguments);
            var result = children.join(" AND ");

            if (result.length === 0) {
                return "";
            }

            if (children.length === 1) {
                return result;
            }

            return "(" + result + ")";
        }
    }, {
        key: "ascending",
        value: function ascending(left) {
            return left + " ASC";
        }
    }, {
        key: "array",
        value: function array(expression) {
            var _this3 = this;

            var array = expression.value;
            var result = array.map(function (value) {
                return _this3._sqlizePrimitive(value);
            }).join(", ");

            return "(" + result + ")";
        }
    }, {
        key: "boolean",
        value: function boolean(expression) {
            return expression.value;
        }
    }, {
        key: "constant",
        value: function constant(expression) {
            return expression.value;
        }
    }, {
        key: "createSqlWithCount",
        value: function createSqlWithCount(query) {
            var queryParts = [];
            var countAlias = "count";

            var sql = new SqlParts();
            sql.select = "SELECT COUNT(*) AS count FROM " + this._escapeIdentifier(this.name);
            sql.where = this.parse(query.where);

            return sql.toString();
        }
    }, {
        key: "createSql",
        value: function createSql(query) {
            var sql = new SqlParts();
            sql.select = this._createSelectStatement(query);
            sql.where = this.parse(query.where);
            sql.orderBy = this.parse(query.orderBy);
            sql.skip = this.skip(query.skip.value);
            sql.take = this.take(query.take.value);

            return sql.toString();
        }
    }, {
        key: "date",
        value: function date(expression) {
            return expression.value;
        }
    }, {
        key: "descending",
        value: function descending(left) {
            return left + " DESC";
        }
    }, {
        key: "endsWith",
        value: function endsWith(left, right) {
            return left + " LIKE " + this.dataConverter.convertEndsWithString(right);
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo(left, right) {
            if (right === null) {
                return left + " IS NULL";
            } else {
                return left + " = " + this._sqlizePrimitive(right);
            }
        }
    }, {
        key: "expression",
        value: function expression(_expression) {
            return _expression.value;
        }
    }, {
        key: "isGreaterThan",
        value: function isGreaterThan(left, right) {
            return left + " > " + this._sqlizePrimitive(right);
        }
    }, {
        key: "isGreaterThanOrEqualTo",
        value: function isGreaterThanOrEqualTo(left, right) {
            return left + " >= " + this._sqlizePrimitive(right);
        }
    }, {
        key: "isIn",
        value: function isIn(left, results) {
            return left + " IN " + results;
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(left, results) {
            return left + " NOT IN " + results;
        }
    }, {
        key: "isLessThan",
        value: function isLessThan(left, right) {
            return left + " < " + this._sqlizePrimitive(right);
        }
    }, {
        key: "isLessThanOrEqualTo",
        value: function isLessThanOrEqualTo(left, right) {
            return left + " <= " + this._sqlizePrimitive(right);
        }
    }, {
        key: "not",
        value: function not(left, right) {
            return left + " NOT " + right;
        }
    }, {
        key: "isNotEqualTo",
        value: function isNotEqualTo(left, right) {
            if (right === "NULL") {
                return left + " IS NOT NULL";
            } else {
                return left + " <> " + this._sqlizePrimitive(right);
            }
        }
    }, {
        key: "null",
        value: function _null(expression) {
            return expression.value;
        }
    }, {
        key: "number",
        value: function number(expression) {
            return expression.value;
        }
    }, {
        key: "or",
        value: function or() {
            var children = Array.from(arguments);
            var result = children.join(" OR ");

            if (result === "") {
                return "";
            }

            return "(" + result + ")";
        }
    }, {
        key: "orderBy",
        value: function orderBy() {
            var result = Array.from(arguments).join(", ");

            if (result === "") {
                return "";
            }

            return "ORDER BY " + result;
        }
    }, {
        key: "property",
        value: function property(expression) {
            return expression.value;
        }
    }, {
        key: "propertyAccess",
        value: function propertyAccess(type, property) {
            return this._writeTableProperty(this.table.name, property);
        }
    }, {
        key: "queryable",
        value: function queryable(expression) {
            var queryable = expression.value;
            var query = queryable.getQuery();
            var visitor = new Visitor(queryable.type, this.edm);

            return "(" + visitor.createSql(query) + ")";
        }
    }, {
        key: "skip",
        value: function skip(value) {
            return "OFFSET " + value;
        }
    }, {
        key: "startsWith",
        value: function startsWith(left, value) {
            return left + " LIKE " + this.dataConverter.convertStartsWithString(value);
        }
    }, {
        key: "string",
        value: function string(expression) {
            return expression.value;
        }
    }, {
        key: "contains",
        value: function contains(left, value) {
            return left + " LIKE " + this.dataConverter.convertContainsString(value);
        }
    }, {
        key: "take",
        value: function take(value) {
            if (value === Infinity) {
                return "LIMIT -1";
            } else {
                return "LIMIT " + value;
            }
        }
    }, {
        key: "type",
        value: function type(expression) {
            return expression.value;
        }
    }, {
        key: "where",
        value: function where(expression) {
            if (!expression) {
                return "";
            }

            return "WHERE " + this["and"].apply(this, arguments);
        }
    }]);

    return Visitor;
}(_queryablejs.ExpressionVisitor);

exports.default = Visitor;
//# sourceMappingURL=Visitor.js.map