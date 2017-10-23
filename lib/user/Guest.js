"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _User2 = require("./User");

var _User3 = _interopRequireDefault(_User2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Guest = function (_User) {
    _inherits(Guest, _User);

    function Guest(name) {
        _classCallCheck(this, Guest);

        var _this = _possibleConstructorReturn(this, (Guest.__proto__ || Object.getPrototypeOf(Guest)).call(this));

        _this.id = "guest";
        _this.name = "Guest";
        _this.isAdmin = false;
        return _this;
    }

    return Guest;
}(_User3.default);

exports.default = Guest;
//# sourceMappingURL=Guest.js.map