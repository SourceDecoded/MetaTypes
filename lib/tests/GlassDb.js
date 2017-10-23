"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _edm = require("../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

var _GlassDb = require("../glassDb/GlassDb");

var _GlassDb2 = _interopRequireDefault(_GlassDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testConfig = {
    "dbDriver": {
        "name": "sqlite",
        "options": {
            storageMode: "memory"
        }
    },
    "fileSystem": {
        "name": "not yet implemented",
        "options": {}
    },
    "doors": [{
        "name": "express",
        "options": {
            "address": "127.0.0.1",
            "port": "9000"
        }
    }]
};

exports["GlassDb"] = function () {
    var glass = new _GlassDb2.default(testConfig);
    (0, _assert2.default)(glass);
};
//# sourceMappingURL=GlassDb.js.map