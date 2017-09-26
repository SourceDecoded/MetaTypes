"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Guid = require("./Guid");

var _Guid2 = _interopRequireDefault(_Guid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaDatabaseAction = function MetaDatabaseAction(id) {
    _classCallCheck(this, MetaDatabaseAction);

    this.id = id || _Guid2.default.create();

    this.execute = {
        action: null,
        options: null
    };

    this.revert = {
        action: null,
        options: null
    };
};

exports.default = MetaDatabaseAction;
//# sourceMappingURL=MetaDatabaseAction.js.map