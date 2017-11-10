"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryablejs = require("queryablejs");

var _QueryBuilder = require("./QueryBuilder");

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

var _TableNameHelper = require("./TableNameHelper");

var _TableNameHelper2 = _interopRequireDefault(_TableNameHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Visitor = function (_ExpressionVisitor) {
    _inherits(Visitor, _ExpressionVisitor);

    function Visitor(name, edm, schema) {
        _classCallCheck(this, Visitor);

        var _this = _possibleConstructorReturn(this, (Visitor.__proto__ || Object.getPrototypeOf(Visitor)).call(this));

        _this.name = name;
        _this.edm = edm;
        _this.table = _this._getTable(name);
        _this.schema = schema;
        _this.queryConverter = new _queryablejs.QueryConverter();
        _this.namer = new _TableNameHelper2.default({ edm: edm, schema: schema });
        return _this;
    }

    _createClass(Visitor, [{
        key: "_convertString",
        value: function _convertString(value) {
            return "N'" + this._escape(value) + "'";
        }
    }, {
        key: "_convertContainsString",
        value: function _convertContainsString(value) {
            return "'%" + this._escape(value) + "%'";
        }
    }, {
        key: "_convertStartsWithString",
        value: function _convertStartsWithString(value) {
            return "'" + this._escape(value) + "%'";
        }
    }, {
        key: "_convertEndsWithString",
        value: function _convertEndsWithString(value) {
            return "'%" + this._escape(value) + "'";
        }
    }, {
        key: "_convertNumber",
        value: function _convertNumber(value) {
            return value.toString();
        }
    }, {
        key: "_convertBoolean",
        value: function _convertBoolean(value) {
            return value ? 1 : 0;
        }
    }, {
        key: "_convertDate",
        value: function _convertDate(value) {
            return value.getTime();
        }
    }, {
        key: "_escape",
        value: function _escape(value) {
            return "" + value.replace(/'/g, "''");
        }
    }, {
        key: "_escapeIdentifier",
        value: function _escapeIdentifier(value) {
            if (value == null) {
                return value;
            }

            return "[" + value + "]";
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
                return this._convertString(value);
            } else if (typeof value === "number") {
                return this._convertNumber(value);
            } else if (typeof value === "boolean") {
                return this._convertBoolean(value);
            } else if (value instanceof Date) {
                return this._convertDate(value);
            } else if (value == null) {
                return "NULL";
            } else {
                throw new Error("Unknown primitive type.");
            }
        }
    }, {
        key: "_writeTableProperty",
        value: function _writeTableProperty(tableName, column) {
            return this.namer.getQualifiedTableName(tableName) + ".[" + column + "]";
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
        key: "array",
        value: function array(expression) {
            var _this2 = this;

            var array = expression.value;

            if (!Array.isArray(array)) {
                throw new Error("Invalid query: The array value node needs to be an array.");
            }

            var result = array.map(function (value) {
                return _this2._sqlizePrimitive(value);
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
        key: "contains",
        value: function contains(left, value) {
            return left + " LIKE " + this._convertContainsString(value);
        }
    }, {
        key: "date",
        value: function date(expression) {
            return expression.value;
        }
    }, {
        key: "endsWith",
        value: function endsWith(left, right) {
            return left + " LIKE " + this._convertEndsWithString(right);
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo(left, right) {
            if (right === null) {
                return left + " IS NULL";
            } else if (typeof right === "string") {
                return left + " LIKE " + this._sqlizePrimitive(right);
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

            if (children.length === 1) {
                return result;
            }

            return "(" + result + ")";
        }
    }, {
        key: "property",
        value: function property(expression) {
            var property = expression.value;
            return property;
        }
    }, {
        key: "propertyAccess",
        value: function propertyAccess(type, property) {
            return this._writeTableProperty(this.table.name, property);
        }
    }, {
        key: "queryable",
        value: function queryable(expression) {
            var query = this.queryConverter.convert(JSON.stringify(expression.value));
            var queryBuilder = new _QueryBuilder2.default(this.edm, this.schema);

            return "(" + queryBuilder.createStatement(query) + ")";
        }
    }, {
        key: "startsWith",
        value: function startsWith(left, value) {
            return left + " LIKE " + this._convertStartsWithString(value);
        }
    }, {
        key: "string",
        value: function string(expression) {
            return expression.value;
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