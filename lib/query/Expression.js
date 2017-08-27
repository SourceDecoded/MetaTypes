"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OperationExpression = require("./OperationExpression");

var _OperationExpression2 = _interopRequireDefault(_OperationExpression);

var _ValueExpression = require("./ValueExpression");

var _ValueExpression2 = _interopRequireDefault(_ValueExpression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Expression = function () {
    function Expression() {
        _classCallCheck(this, Expression);

        this.nodeName = "expression";
    }

    _createClass(Expression, [{
        key: "copy",
        value: function copy() {
            throw new Error("Meant to be overriden");
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo() {
            throw new Error("Meant to be overriden");
        }
    }], [{
        key: "getExpressionType",
        value: function getExpressionType(value) {
            if (value instanceof Expression) {
                return value;
            }

            if (typeof value === "string") {
                return Expression.string(value);
            } else if (typeof value === "function") {
                return Expression["function"](value);
            } else if (typeof value === "number") {
                return Expression.number(value);
            } else if (typeof value === "boolean") {
                return Expression.boolean(value);
            } else if (value === null) {
                return Expression["null"](value);
                return Expression["undefined"](value);
            } else if (Array.isArray(value)) {
                return Expression.array(value);
            } else if (value instanceof Date) {
                return Expression.date(value);
            } else {
                return Expression.object(value);
            }
        }
    }, {
        key: "property",
        value: function property(value) {
            return new _ValueExpression2.default("property", value);
        }
    }, {
        key: "constant",
        value: function constant(value) {
            return new _ValueExpression2.default("constant", value);
        }
    }, {
        key: "boolean",
        value: function boolean(value) {
            var expression = new _ValueExpression2.default("boolean");
            expression.value = value;
            return expression;
        }
    }, {
        key: "string",
        value: function string(value) {
            var expression = new _ValueExpression2.default("string");
            expression.value = value;
            return expression;
        }
    }, {
        key: "number",
        value: function number(value) {
            var expression = new _ValueExpression2.default("number");
            expression.value = value;
            return expression;
        }
    }, {
        key: "object",
        value: function object(value) {
            var expression = new _ValueExpression2.default("object");
            expression.value = value;
            return expression;
        }
    }, {
        key: "date",
        value: function date(value) {
            var expression = new _ValueExpression2.default("date");
            expression.value = value;
            return expression;
        }
    }, {
        key: "function",
        value: function _function(value) {
            var expression = new _ValueExpression2.default("function");
            expression.value = value;
            return expression;
        }
    }, {
        key: "type",
        value: function type(value) {
            var expression = new _ValueExpression2.default("type");
            expression.value = value || Object;
            return expression;
        }
    }, {
        key: "null",
        value: function _null(value) {
            var expression = new _ValueExpression2.default("null");
            expression.value = value;
            return expression;
        }
    }, {
        key: "undefined",
        value: function undefined(value) {
            var expression = new _ValueExpression2.default("undefined");
            expression.value = value;
            return expression;
        }
    }, {
        key: "array",
        value: function array(value) {
            var expression = new _ValueExpression2.default("array");
            expression.value = value;
            return expression;
        }
    }, {
        key: "queryable",
        value: function queryable(leftExpression, rightExpression) {
            var expression = new _OperationExpression2.default("queryable");
            expression.children.push(leftExpression, rightExpression);
            return expression;
        }

        //
        // OperationExpression helpers
        //

    }, {
        key: "equalTo",
        value: function equalTo() {
            var expression = new _OperationExpression2.default("equalTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "notEqualTo",
        value: function notEqualTo() {
            var expression = new _OperationExpression2.default("notEqualTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "or",
        value: function or() {
            var expression = new _OperationExpression2.default("or");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "and",
        value: function and() {
            var expression = new _OperationExpression2.default("and");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "where",
        value: function where() {
            var expression = new _OperationExpression2.default("where");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "greaterThan",
        value: function greaterThan() {
            var expression = new _OperationExpression2.default("greaterThan");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "lessThan",
        value: function lessThan() {
            var expression = new _OperationExpression2.default("lessThan");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "greaterThanOrEqualTo",
        value: function greaterThanOrEqualTo() {
            var expression = new _OperationExpression2.default("greaterThanOrEqualTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "lessThanOrEqualTo",
        value: function lessThanOrEqualTo() {
            var expression = new _OperationExpression2.default("lessThanOrEqualTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "orderBy",
        value: function orderBy() {
            var expression = new _OperationExpression2.default("orderBy");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "descending",
        value: function descending() {
            var expression = new _OperationExpression2.default("descending");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "ascending",
        value: function ascending() {
            var expression = new _OperationExpression2.default("ascending");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "skip",
        value: function skip(value) {
            var expression = new _OperationExpression2.default("skip");
            var valueExpression = Expression.constant(value);
            expression.children.push(valueExpression);

            return expression;
        }
    }, {
        key: "take",
        value: function take(value) {
            var expression = new _OperationExpression2.default("take");
            var valueExpression = Expression.constant(value);
            expression.children.push(valueExpression);

            return expression;
        }
    }, {
        key: "buildOperatorExpression",
        value: function buildOperatorExpression(name) {
            var expression = new _OperationExpression2.default(name);
            var args = Array.prototype.slice.call(arguments, 1);
            args.forEach(function (arg) {
                expression.children.push(arg);
            });

            return expression;
        }
    }, {
        key: "guid",
        value: function guid() {
            var expression = new _OperationExpression2.default("guid");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "substring",
        value: function substring() {
            var expression = new _OperationExpression2.default("substring");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "substringOf",
        value: function substringOf() {
            var expression = new _OperationExpression2.default("substringOf");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "startsWith",
        value: function startsWith() {
            var expression = new _OperationExpression2.default("startsWith");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "endsWith",
        value: function endsWith() {
            var expression = new _OperationExpression2.default("endsWith");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "isIn",
        value: function isIn(property, array) {
            var expression = new _OperationExpression2.default("isIn");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(property, array) {
            var expression = new _OperationExpression2.default("isNotIn");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "include",
        value: function include() {
            var expression = new _OperationExpression2.default("include");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "any",
        value: function any(propertyAccessExpression, expression) {
            var anyExpression = new _OperationExpression2.default("any");
            var expressionExpression = Expression.expression(expression);

            anyExpression.children.push(propertyAccessExpression, expressionExpression);
            return anyExpression;
        }
    }, {
        key: "all",
        value: function all(propertyAccessExpression, expression) {
            var allExpression = new _OperationExpression2.default("all");
            var expressionExpression = Expression.expression(expression);

            allExpression.children.push(propertyAccessExpression, expressionExpression);
            return allExpression;
        }
    }, {
        key: "expression",
        value: function expression(value) {
            var expresssionExpression = new _ValueExpression2.default("expression", value);

            return expresssionExpression;
        }
    }, {
        key: "propertyAccess",
        value: function propertyAccess(leftExpression, propertyName) {
            var propertyExpression = Expression.property(propertyName);
            var propertyAccessExpression = new _OperationExpression2.default("propertyAccess");
            propertyAccessExpression.children.push(leftExpression, propertyExpression);

            return propertyAccessExpression;
        }
    }, {
        key: "contains",
        value: function contains(Type, namespace, expression) {
            var containsExpression = new _OperationExpression2.default("contains");
            var ofTypeExpression = new _ValueExpression2.default("ofType", Type);
            var propertyExpression = new _ValueExpression2.default("property", namespace);

            containsExpression.children.push(ofTypeExpression, propertyExpression, expression);

            return containsExpression;
        }
    }, {
        key: "intersects",
        value: function intersects(Type, namespace, expression) {
            var intersectsExpression = new _OperationExpression2.default("intersects");
            var ofTypeExpression = new _ValueExpression2.default("ofType", Type);
            var propertyExpression = new _ValueExpression2.default("property", namespace);

            intersectsExpression.children.push(ofTypeExpression, propertyExpression, expression);

            return intersectsExpression;
        }
    }]);

    return Expression;
}();

exports.default = Expression;
//# sourceMappingURL=Expression.js.map