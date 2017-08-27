"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Expression = require("./Expression");

var _Expression2 = _interopRequireDefault(_Expression);

var _OperationExpressionBuilder = require("./OperationExpressionBuilder");

var _OperationExpressionBuilder2 = _interopRequireDefault(_OperationExpressionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExpressionBuilder = function () {
    function ExpressionBuilder(Type) {
        _classCallCheck(this, ExpressionBuilder);

        this.Type = Type || Object;
    }

    _createClass(ExpressionBuilder, [{
        key: "property",
        value: function property(_property) {
            return new _OperationExpressionBuilder2.default(function () {
                return _Expression2.default.propertyAccess(_Expression2.default.type(this.Type), _property);
            });
        }
    }, {
        key: "and",
        value: function and() {
            return _Expression2.default.and.apply(_Expression2.default, arguments);
        }
    }, {
        key: "or",
        value: function or() {
            return _Expression2.default.or.apply(_Expression2.default, arguments);
        }
    }, {
        key: "any",
        value: function any(filter) {
            var expressionBuilder = new ExpressionBuilder();
            var expression = filter(expressionBuilder);
            return setExpression(_Expression2.default.any("", expression));
        }
    }, {
        key: "all",
        value: function all(filter) {
            var expressionBuilder = new ExpressionBuilder();
            var expression = filter(expressionBuilder);
            return setExpression(_Expression2.default.all("", expression));
        }
    }, {
        key: "value",
        value: function value() {
            return new _OperationExpressionBuilder2.default(function () {
                return _Expression2.default.type(this.Type);
            });
        }
    }]);

    return ExpressionBuilder;
}();

exports.default = ExpressionBuilder;
//# sourceMappingURL=ExpressionBuilder.js.map