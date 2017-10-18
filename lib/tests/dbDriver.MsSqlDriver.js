"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _edm = require("../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

var _mssql = require("mssql");

var _mssql2 = _interopRequireDefault(_mssql);

var _MsSqlDriver = require("../dbDriver/MsSqlDriver");

var _MsSqlDriver2 = _interopRequireDefault(_MsSqlDriver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbConfig = {
    user: "home_user",
    password: "3XV%t*oMeVF$79qZuW",
    server: "lgutsql01",
    database: "Home",
    dataDb: "Home",
    edmDb: "Home",
    edmSchema: "dbo",
    dataSchema: "dbo"
};

exports["dbDriver.MsSqlDriver can connect"] = function () {

    _mssql2.default.connect(dbConfig).then(function (pool) {
        return true;
    }).catch(function (e) {
        return false;
    }).then(function (connected) {
        _mssql2.default.close();
        (0, _assert2.default)(connected);
    });
};

exports["dbDriver.MsSqlDriver"] = function () {
    var dbDriver = new _MsSqlDriver2.default(dbConfig);
    (0, _assert2.default)(dbDriver);
    dbDriver.dispose();
};

exports["dbDriver.MsSqlDriver.getEdmDbAsync"] = function () {
    var dbDriver = new _MsSqlDriver2.default(dbConfig);
    dbDriver.getEdmDbAsync().then(function (db) {
        (0, _assert2.default)(db);
        dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};

exports["dbDriver.MsSqlDriver.getDataDbAsync"] = function () {
    var dbDriver = new _MsSqlDriver2.default(dbConfig);
    dbDriver.getDataDbAsync().then(function (db) {
        (0, _assert2.default)(db);
        dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};

exports["dbDriver.MsSqlDriver._verifyEdmTableAsync"] = function () {
    var dbDriver = new _MsSqlDriver2.default(dbConfig);
    dbDriver._verifyEdmTableAsync().then(function (pool) {
        (0, _assert2.default)(pool);
        dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};

exports["dbDriver.MsSqlDriver.getEdmListAsync"] = function () {
    var dbDriver = new _MsSqlDriver2.default(dbConfig);
    dbDriver.getEdmListAsync().then(function (edmList) {
        (0, _assert2.default)(typeof edmList.length !== "undefined");
        dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};

exports["dbDriver.MsSqlDriver.getDatabaseForEdmAsync"] = function () {
    var dbDriver = new _MsSqlDriver2.default(dbConfig);
    dbDriver.getDatabaseForEdmAsync(_edm2.default).then(function (idb) {
        (0, _assert2.default)(idb);
        dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};
//# sourceMappingURL=dbDriver.MsSqlDriver.js.map