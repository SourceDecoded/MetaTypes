"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ExpressionBuilder = require("./ExpressionBuilder");

var _ExpressionBuilder2 = _interopRequireDefault(_ExpressionBuilder);

var _Expression = require("./Expression");

var _Expression2 = _interopRequireDefault(_Expression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var returnExpression = function returnExpression() {
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
            var expressionBuilder = new _ExpressionBuilder2.default();
            var expression = fn(expressionBuilder);
            return _Expression2.default.any(this.getLeftExpression(), expression);
        }
    }, {
        key: "where",
        value: function where(fn) {
            var propertyAccessExpression = this.getLeftExpression();

            this.getLeftExpression = function () {
                var expressionBuilder = new _ExpressionBuilder2.default(Object);
                var expression = fn(expressionBuilder);

                return _Expression2.default.queryable(propertyAccessExpression, _Expression2.default.expression(_Expression2.default.where(expression)));
            };

            return this;
        }
    }, {
        key: "all",
        value: function all(fn) {
            var expressionBuilder = new _ExpressionBuilder2.default();
            var expression = fn(expressionBuilder);
            return _Expression2.default.all(this.getLeftExpression(), expression);
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo(value) {
            var constant = _Expression2.default.getExpressionType(value);
            return _Expression2.default.equalTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "isNotEqualTo",
        value: function isNotEqualTo(value) {
            var constant = _Expression2.default.getExpressionType(value);
            return _Expression2.default.notEqualTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "contains",
        value: function contains(value) {
            var constant = _Expression2.default.getExpressionType(value);
            return _Expression2.default.substringOf(this.getLeftExpression(), constant);
        }
    }, {
        key: "isIn",
        value: function isIn(array) {
            if (Array.isArray(array)) {
                return _Expression2.default.isIn(this.getLeftExpression(), _Expression2.default.array(array));
            } else {
                throw new Error("isIn is expecting to be passed an array!");
            }
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(array) {
            if (Array.isArray(array)) {
                return _Expression2.default.isNotIn(this.getLeftExpression(), _Expression2.default.array(array));
            } else {
                throw new Error("isNotIn is expecting to be passed an array!");
            }
        }
    }, {
        key: "isSubstringOf",
        value: function isSubstringOf(value) {
            console.warn("isSubstringOf is deprecated, please us contains.");
            return _Expression2.default.substringOf(this.getLeftExpression(), _Expression2.default.string(value));
        }
    }, {
        key: "isGreaterThan",
        value: function isGreaterThan(value) {
            var constant = _Expression2.default.getExpressionType(value);
            return _Expression2.default.greaterThan(this.getLeftExpression(), constant);
        }
    }, {
        key: "isGreaterThanOrEqualTo",
        value: function isGreaterThanOrEqualTo(value) {
            var constant = _Expression2.default.getExpressionType(value);
            return _Expression2.default.greaterThanOrEqualTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "isLessThanOrEqualTo",
        value: function isLessThanOrEqualTo(value) {
            var constant = _Expression2.default.getExpressionType(value);
            return _Expression2.default.lessThanOrEqualTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "isLessThan",
        value: function isLessThan(value) {
            var constant = _Expression2.default.getExpressionType(value);
            return _Expression2.default.lessThan(this.getLeftExpression(), constant);
        }
    }, {
        key: "endsWith",
        value: function endsWith(value) {
            return _Expression2.default.endsWith(this.getLeftExpression(), _Expression2.default.string(value));
        }
    }, {
        key: "startsWith",
        value: function startsWith(value) {
            return _Expression2.default.startsWith(this.getLeftExpression(), _Expression2.default.string(value));
        }
    }, {
        key: "property",
        value: function property(value) {
            return new OperationExpressionBuilder(function () {
                return _Expression2.default.propertyAccess(this.getLeftExpression(), value);
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

exports.default = OperationExpressionBuilder;
//# sourceMappingURL=OperationExpressionBuilder.js.map