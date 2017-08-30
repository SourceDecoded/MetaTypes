"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
            return new ValueExpression("property", value);
        }
    }, {
        key: "constant",
        value: function constant(value) {
            return new ValueExpression("constant", value);
        }
    }, {
        key: "boolean",
        value: function boolean(value) {
            var expression = new ValueExpression("boolean");
            expression.value = value;
            return expression;
        }
    }, {
        key: "string",
        value: function string(value) {
            var expression = new ValueExpression("string");
            expression.value = value;
            return expression;
        }
    }, {
        key: "number",
        value: function number(value) {
            var expression = new ValueExpression("number");
            expression.value = value;
            return expression;
        }
    }, {
        key: "object",
        value: function object(value) {
            var expression = new ValueExpression("object");
            expression.value = value;
            return expression;
        }
    }, {
        key: "date",
        value: function date(value) {
            var expression = new ValueExpression("date");
            expression.value = value;
            return expression;
        }
    }, {
        key: "function",
        value: function _function(value) {
            var expression = new ValueExpression("function");
            expression.value = value;
            return expression;
        }
    }, {
        key: "type",
        value: function type(value) {
            var expression = new ValueExpression("type");
            expression.value = value || Object;
            return expression;
        }
    }, {
        key: "null",
        value: function _null(value) {
            var expression = new ValueExpression("null");
            expression.value = value;
            return expression;
        }
    }, {
        key: "undefined",
        value: function undefined(value) {
            var expression = new ValueExpression("undefined");
            expression.value = value;
            return expression;
        }
    }, {
        key: "array",
        value: function array(value) {
            var expression = new ValueExpression("array");
            expression.value = value;
            return expression;
        }
    }, {
        key: "queryable",
        value: function queryable(leftExpression, rightExpression) {
            var expression = new OperationExpression("queryable");
            expression.children.push(leftExpression, rightExpression);
            return expression;
        }

        //
        // OperationExpression helpers
        //

    }, {
        key: "equalTo",
        value: function equalTo() {
            var expression = new OperationExpression("equalTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "notEqualTo",
        value: function notEqualTo() {
            var expression = new OperationExpression("notEqualTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "or",
        value: function or() {
            var expression = new OperationExpression("or");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "and",
        value: function and() {
            var expression = new OperationExpression("and");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "where",
        value: function where() {
            var expression = new OperationExpression("where");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "greaterThan",
        value: function greaterThan() {
            var expression = new OperationExpression("greaterThan");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "lessThan",
        value: function lessThan() {
            var expression = new OperationExpression("lessThan");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "greaterThanOrEqualTo",
        value: function greaterThanOrEqualTo() {
            var expression = new OperationExpression("greaterThanOrEqualTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "lessThanOrEqualTo",
        value: function lessThanOrEqualTo() {
            var expression = new OperationExpression("lessThanOrEqualTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "orderBy",
        value: function orderBy() {
            var expression = new OperationExpression("orderBy");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "descending",
        value: function descending() {
            var expression = new OperationExpression("descending");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "ascending",
        value: function ascending() {
            var expression = new OperationExpression("ascending");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "skip",
        value: function skip(value) {
            var expression = new OperationExpression("skip");
            var valueExpression = Expression.constant(value);
            expression.children.push(valueExpression);

            return expression;
        }
    }, {
        key: "take",
        value: function take(value) {
            var expression = new OperationExpression("take");
            var valueExpression = Expression.constant(value);
            expression.children.push(valueExpression);

            return expression;
        }
    }, {
        key: "buildOperatorExpression",
        value: function buildOperatorExpression(name) {
            var expression = new OperationExpression(name);
            var args = Array.prototype.slice.call(arguments, 1);
            args.forEach(function (arg) {
                expression.children.push(arg);
            });

            return expression;
        }
    }, {
        key: "guid",
        value: function guid() {
            var expression = new OperationExpression("guid");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "substring",
        value: function substring() {
            var expression = new OperationExpression("substring");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "substringOf",
        value: function substringOf() {
            var expression = new OperationExpression("substringOf");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "startsWith",
        value: function startsWith() {
            var expression = new OperationExpression("startsWith");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "endsWith",
        value: function endsWith() {
            var expression = new OperationExpression("endsWith");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "isIn",
        value: function isIn(property, array) {
            var expression = new OperationExpression("isIn");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(property, array) {
            var expression = new OperationExpression("isNotIn");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "include",
        value: function include() {
            var expression = new OperationExpression("include");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "any",
        value: function any(propertyAccessExpression, expression) {
            var anyExpression = new OperationExpression("any");
            var expressionExpression = Expression.expression(expression);

            anyExpression.children.push(propertyAccessExpression, expressionExpression);
            return anyExpression;
        }
    }, {
        key: "all",
        value: function all(propertyAccessExpression, expression) {
            var allExpression = new OperationExpression("all");
            var expressionExpression = Expression.expression(expression);

            allExpression.children.push(propertyAccessExpression, expressionExpression);
            return allExpression;
        }
    }, {
        key: "expression",
        value: function expression(value) {
            var expresssionExpression = new ValueExpression("expression", value);

            return expresssionExpression;
        }
    }, {
        key: "propertyAccess",
        value: function propertyAccess(leftExpression, propertyName) {
            var propertyExpression = Expression.property(propertyName);
            var propertyAccessExpression = new OperationExpression("propertyAccess");
            propertyAccessExpression.children.push(leftExpression, propertyExpression);

            return propertyAccessExpression;
        }
    }, {
        key: "contains",
        value: function contains(type, namespace, expression) {
            var containsExpression = new OperationExpression("contains");
            var ofTypeExpression = new ValueExpression("ofType", type);
            var propertyExpression = new ValueExpression("property", namespace);

            containsExpression.children.push(ofTypeExpression, propertyExpression, expression);

            return containsExpression;
        }
    }, {
        key: "intersects",
        value: function intersects(type, namespace, expression) {
            var intersectsExpression = new OperationExpression("intersects");
            var ofTypeExpression = new ValueExpression("ofType", type);
            var propertyExpression = new ValueExpression("property", namespace);

            intersectsExpression.children.push(ofTypeExpression, propertyExpression, expression);

            return intersectsExpression;
        }
    }]);

    return Expression;
}();

var ValueExpression = function (_Expression) {
    _inherits(ValueExpression, _Expression);

    function ValueExpression(nodeName, value) {
        _classCallCheck(this, ValueExpression);

        var _this = _possibleConstructorReturn(this, (ValueExpression.__proto__ || Object.getPrototypeOf(ValueExpression)).call(this));

        _this.value = value;
        _this.nodeName = nodeName;
        return _this;
    }

    _createClass(ValueExpression, [{
        key: "copy",
        value: function copy() {
            return new ValueExpression(this.nodeName, this.value);
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo(node) {
            if (node && this.nodeName === node.nodeName && this.value === node.value) {
                return true;
            }
            return false;
        }
    }, {
        key: "contains",
        value: function contains(node) {
            return this.isEqualTo(node);
        }
    }]);

    return ValueExpression;
}(Expression);

var OperationExpression = function (_Expression2) {
    _inherits(OperationExpression, _Expression2);

    function OperationExpression(nodeName) {
        _classCallCheck(this, OperationExpression);

        var _this2 = _possibleConstructorReturn(this, (OperationExpression.__proto__ || Object.getPrototypeOf(OperationExpression)).call(this));

        var args = Array.prototype.slice.call(arguments, 0);

        _this2.nodeName = nodeName;
        _this2.children = args.slice(1);
        return _this2;
    }

    _createClass(OperationExpression, [{
        key: "copy",
        value: function copy() {
            var children = [];
            var copy = new OperationExpression(this.nodeName);

            this.children.forEach(function (expression) {
                copy.children.push(expression.copy());
            });

            return copy;
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo() {
            if (!Array.isArray(node.children) || this.nodeName !== node.nodeName) {
                return false;
            }

            if (node.children.length !== this.children.length) {
                return false;
            }

            return this.children.every(function (expression, index) {
                return expression.isEqualTo(node.children[index]);
            });
        }
    }, {
        key: "contains",
        value: function contains(node) {
            var _this3 = this;

            if (node.nodeName === this.nodeName && Array.isArray(node.children)) {
                var matched = node.children.every(function (childNode, index) {
                    return childNode.contains(_this3.children[index]);
                });

                if (matched) {
                    return true;
                }
            }

            return this.children.some(function (childNode) {
                return childNode.contains(node);
            });
        }
    }, {
        key: "getMatchingNodes",
        value: function getMatchingNodes(node, matchedNodes) {
            var _this4 = this;

            matchedNodes = Array.isArray(matchedNodes) ? matchedNodes : [];

            if (node.nodeName === this.nodeName && Array.isArray(node.children)) {
                var matched = node.children.every(function (childNode, index) {
                    return childNode.contains(_this4.children[index], matchedNodes);
                });

                if (matched) {
                    matchedNodes.push(this);
                }
            }

            this.children.forEach(function (childNode) {
                if (Array.isArray(childNode.children)) {
                    childNode.getMatchingNodes(node, matchedNodes);
                }
            }, matchedNodes);

            return matchedNodes;
        }
    }]);

    return OperationExpression;
}(Expression);

exports.Expression = Expression;
exports.ValueExpression = ValueExpression;
exports.OperationExpression = OperationExpression;
//# sourceMappingURL=Expression.js.map