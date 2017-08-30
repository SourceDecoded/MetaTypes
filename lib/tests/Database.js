"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Database = require("./../sqlite/Database");

var _Database2 = _interopRequireDefault(_Database);

var _edm = require("./../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["Database._getTableBuildOrder"] = function () {
    var database = new _Database2.default({
        sqlite: {
            exec: function exec() {},
            run: function run() {}
        },
        edm: _edm2.default
    });

    var buildOrder = database._getTableBuildOrder();
};
//# sourceMappingURL=Database.js.map