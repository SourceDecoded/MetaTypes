"use strict";

var _MigrationRunner = require("./../MigrationRunner");

var _MigrationRunner2 = _interopRequireDefault(_MigrationRunner);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["MigrationRunner.constructor: empty options"] = function () {
    _assert2.default.throws(function () {
        var runner = new _MigrationRunner2.default();
    });
};

exports["MigrationRunner.constructor: null edm."] = function () {
    _assert2.default.throws(function () {
        var runner = new _MigrationRunner2.default({
            edm: null
        });
    });
};

exports["MigrationRunner.constructor: invalid history."] = function () {
    _assert2.default.throws(function () {
        var runner = new _MigrationRunner2.default({
            history: "blah"
        });
    });
};
//# sourceMappingURL=MigrationRunner.js.map