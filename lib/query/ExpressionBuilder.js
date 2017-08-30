"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationExpressionBuilder = exports.ExpressionBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Expression = require("./Expression");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var returnExpression = function returnExpression(expression) {
    return expression;
};

var OperationExpressionBuilder = function () {
    function OperationExpressionBuilder(getLeftExpression) {
        _classCallCheck(this, OperationExpressionBuilder);

        this.getLeftExpression = getLeftExpression || returnExpression;
    }

    _createClass(OperationExpressionBuilder, [{
        key: "any",
        value: function any(fn) {
            var expressionBuilder = new ExpressionBuilder();
            var expression = fn(expressionBuilder);
            return _Expression.Expression.any(this.getLeftExpression(), expression);
        }
    }, {
        key: "where",
        value: function where(fn) {
            var propertyAccessExpression = this.getLeftExpression();

            this.getLeftExpression = function () {
                var expressionBuilder = new ExpressionBuilder(Object);
                var expression = fn(expressionBuilder);

                return _Expression.Expression.queryable(propertyAccessExpression, _Expression.Expression.expression(_Expression.Expression.where(expression)));
            };

            return this;
        }
    }, {
        key: "all",
        value: function all(fn) {
            var expressionBuilder = new ExpressionBuilder();
            var expression = fn(expressionBuilder);
            return _Expression.Expression.all(this.getLeftExpression(), expression);
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.equalTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "isNotEqualTo",
        value: function isNotEqualTo(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.notEqualTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "contains",
        value: function contains(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.substringOf(this.getLeftExpression(), constant);
        }
    }, {
        key: "isIn",
        value: function isIn(array) {
            if (Array.isArray(array)) {
                return _Expression.Expression.isIn(this.getLeftExpression(), _Expression.Expression.array(array));
            } else {
                throw new Error("isIn is expecting to be passed an array!");
            }
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(array) {
            if (Array.isArray(array)) {
                return _Expression.Expression.isNotIn(this.getLeftExpression(), _Expression.Expression.array(array));
            } else {
                throw new Error("isNotIn is expecting to be passed an array!");
            }
        }
    }, {
        key: "isGreaterThan",
        value: function isGreaterThan(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.greaterThan(this.getLeftExpression(), constant);
        }
    }, {
        key: "isGreaterThanOrEqualTo",
        value: function isGreaterThanOrEqualTo(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.greaterThanOrEqualTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "isLessThanOrEqualTo",
        value: function isLessThanOrEqualTo(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.lessThanOrEqualTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "isLessThan",
        value: function isLessThan(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.lessThan(this.getLeftExpression(), constant);
        }
    }, {
        key: "endsWith",
        value: function endsWith(value) {
            return _Expression.Expression.endsWith(this.getLeftExpression(), _Expression.Expression.string(value));
        }
    }, {
        key: "startsWith",
        value: function startsWith(value) {
            return _Expression.Expression.startsWith(this.getLeftExpression(), _Expression.Expression.string(value));
        }
    }, {
        key: "property",
        value: function property(value) {
            var _this = this;

            return new OperationExpressionBuilder(function () {
                return _Expression.Expression.propertyAccess(_this.getLeftExpression(), value);
            });
        }
    }, {
        key: "getExpression",
        value: function getExpression() {
            return this.getLeftExpression();
        }
    }]);

    return OperationExpressionBuilder;
}();

var ExpressionBuilder = function () {
    function ExpressionBuilder(type) {
        _classCallCheck(this, ExpressionBuilder);

        this.type = type || Object;
    }

    _createClass(ExpressionBuilder, [{
        key: "property",
        value: function property(_property) {
            var _this2 = this;

            return new OperationExpressionBuilder(function () {
                return _Expression.Expression.propertyAccess(_Expression.Expression.type(_this2.type), _property);
            });
        }
    }, {
        key: "and",
        value: function and() {
            return _Expression.Expression.and.apply(_Expression.Expression, arguments);
        }
    }, {
        key: "or",
        value: function or() {
            return _Expression.Expression.or.apply(_Expression.Expression, arguments);
        }
    }, {
        key: "value",
        value: function value() {
            var _this3 = this;

            return new OperationExpressionBuilder(function () {
                return _Expression.Expression.type(_this3.type);
            });
        }
    }]);

    return ExpressionBuilder;
}();

exports.ExpressionBuilder = ExpressionBuilder;
exports.OperationExpressionBuilder = OperationExpressionBuilder;
//# sourceMappingURL=ExpressionBuilder.js.map