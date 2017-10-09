"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Guid = require("./Guid");

var _Guid2 = _interopRequireDefault(_Guid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaDatabaseCommand = function MetaDatabaseCommand(id) {
    _classCallCheck(this, MetaDatabaseCommand);

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

exports.default = MetaDatabaseCommand;
//# sourceMappingURL=MetaDatabaseCommand.js.map