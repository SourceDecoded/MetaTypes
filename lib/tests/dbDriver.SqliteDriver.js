"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _SqliteDriver = require("../dbDriver/SqliteDriver");

var _SqliteDriver2 = _interopRequireDefault(_SqliteDriver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileConfig = {
    "storageMode": "file",
    "path": "",
    "edmDb": "edm.sqlite",
    "dataDb": "data.sqlite"
};

var memoryConfig = {
    "storageMode": "memory"
};

exports["SqliteDriver in memory mode"] = function () {
    var driver = new _SqliteDriver2.default(memoryConfig);
    (0, _assert2.default)(driver);
};

exports["SqliteDriver.getEdmDbAsync"] = function () {
    var driver = new _SqliteDriver2.default(memoryConfig);
    driver.getEdmDbAsync().then(function (db) {
        (0, _assert2.default)(db);
    }).catch(function (e) {
        _assert2.default.fail(e);
    }).then(function () {
        driver.dispose();
    });
};

exports["SqliteDriver.getDataDbAsync"] = function () {
    var driver = new _SqliteDriver2.default(memoryConfig);
    driver.getDataDbAsync().then(function (db) {
        (0, _assert2.default)(db);
    }).catch(function (e) {
        _assert2.default.fail(e);
    }).then(function () {
        driver.dispose();
    });
};

exports["SqliteDriver.getEdmListAsync"] = function () {
    var driver = new _SqliteDriver2.default(memoryConfig);
    driver.getEdmListAsync().then(function (edms) {
        (0, _assert2.default)(typeof edms.length !== "undefined");
    }).catch(function (e) {
        _assert2.default.fail(e);
    }).then(function () {
        driver.dispose();
    });
};
//# sourceMappingURL=dbDriver.SqliteDriver.js.map