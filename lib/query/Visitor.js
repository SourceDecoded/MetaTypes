"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Expression = require("./Expression");

var _Expression2 = _interopRequireDefault(_Expression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Visitor = function () {
    function Visitor() {
        _classCallCheck(this, Visitor);
    }

    _createClass(Visitor, [{
        key: "parse",
        value: function parse(expression) {
            var _this = this;

            var children = [];

            if (!expression) {
                return null;
            }

            expression.children.forEach(function (expression) {
                if (!expression.children) {
                    children.push(expression);
                } else {
                    children.push(_this.parse(expression));
                }
            });

            var func = this[expression.nodeName];

            if (!func) {
                throw new Error("The builder doesn't support the \"" + expression.nodeName + '" expression.');
            }

            children.forEach(function (child, index) {
                if (child instanceof _Expression2.default) {
                    var func = _this[child.nodeName];
                    if (!func) {
                        throw new Error("The builder doesn't support the \"" + child.nodeName + '" expression.');
                    }
                    children[index] = func.call(_this, child);
                }
            });

            return func.apply(this, children);
        }
    }]);

    return Visitor;
}();

exports.default = Visitor;
//# sourceMappingURL=Visitor.js.map