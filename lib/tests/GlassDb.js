"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _edm = require("../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

var _GlassDb = require("../glassDb/GlassDb");

var _GlassDb2 = _interopRequireDefault(_GlassDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let testConfig = {
//     "dbDriver": {
//         "name": "sqlite",
//         "options": {
//             storageMode: "memory"
//         }
//     },
//     "fileSystem": {
//         "name": "not yet implemented",
//         "options": {}
//     },
//     "doors": [
//         {
//             "name": "express",
//             "options": {
//                 "address": "127.0.0.1",
//                 "port": "9000"
//             }
//         }
//     ]
// };

var testConfig = {
    "dbDriver": {
        "name": "mssql",
        "options": {
            user: process.env.META_DB_TEST_USER,
            password: process.env.META_DB_TEST_PW,
            server: process.env.META_DB_TEST_SERVER,
            database: process.env.META_DB_TEST_DB,
            dataDb: process.env.META_DB_TEST_DB_DATA,
            edmDb: process.env.META_DB_TEST_DB_EDM,
            edmSchema: "dbo",
            dataSchema: "dbo"
        }
    },
    "fileSystem": {
        "name": "not yet implemented",
        "options": {}
    },
    "doors": [
        // {
        //     "name": "express",
        //     "options": {
        //         "address": "127.0.0.1",
        //         "port": "9000"
        //     }
        // }
    ]
};

exports["GlassDb"] = function () {
    var glass = new _GlassDb2.default(testConfig);
    (0, _assert2.default)(glass);
    glass.dispose();
};

// finish the sqlite driver so we can test this without pounding the mssql server

exports["GlassDb add, get, delete edm"] = function () {
    var glass = new _GlassDb2.default(testConfig);
    glass.addEdmAsync("newEDM", "0.0.3", "A Test EDM").then(function () {
        return glass.getEdmAsync("newEdm", "0.0.3");
    }).then(function (edm) {
        (0, _assert2.default)(edm.name === "newEDM");
        return glass.deleteEdmAsync("newEDM", "0.0.3");
    }).then(function () {
        return glass.getEdmAsync("newEDM", "0.0.3");
    }).then(function (noEDM) {
        _assert2.default.equal(noEDM, null);
        glass.dispose();
    });
};
//# sourceMappingURL=GlassDb.js.map