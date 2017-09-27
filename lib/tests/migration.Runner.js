"use strict";

var _Runner = require("./../migration/Runner");

var _Runner2 = _interopRequireDefault(_Runner);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["migration.Runner.constructor: empty options"] = function () {
    _assert2.default.throws(function () {
        var runner = new _Runner2.default();
    });
};

exports["migration.Runner.constructor: null edm."] = function () {
    _assert2.default.throws(function () {
        var runner = new _Runner2.default({
            edm: null
        });
    });
};

exports["migration.Runner.constructor: invalid history."] = function () {
    _assert2.default.throws(function () {
        var runner = new _Runner2.default({
            history: "blah"
        });
    });
};
//# sourceMappingURL=migration.Runner.js.map