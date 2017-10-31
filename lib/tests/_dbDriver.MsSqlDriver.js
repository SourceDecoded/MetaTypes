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
    user: process.env.META_DB_TEST_USER,
    password: process.env.META_DB_TEST_PW,
    server: process.env.META_DB_TEST_SERVER,
    database: process.env.META_DB_TEST_DB,
    dataDb: process.env.META_DB_TEST_DB_DATA,
    edmDb: process.env.META_DB_TEST_DB_EDM,
    edmSchema: "dbo",
    dataSchema: "dbo",
    edmTable: "edm"
};

var cleanEdmDbAsync = function cleanEdmDbAsync(dbDriver) {
    return dbDriver.getEdmDbAsync().then(function (pool) {
        return pool.request().query("DELETE FROM [" + dbConfig.edmSchema + "].[" + dbConfig.edmTable + "]");
    });
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

exports["dbDriver.MsSqlDriver()"] = function () {
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

exports["dbDriver.MsSqlDriver add and get EDM"] = function () {
    var dbDriver = new _MsSqlDriver2.default(dbConfig);
    cleanEdmDbAsync(dbDriver).then(function () {
        dbDriver.addEdmAsync("testEDM", "0.0.1", "a label").then(function () {
            return dbDriver.getEdmAsync("testEDM", "0.0.1").then(function (edm) {
                (0, _assert2.default)(edm);
            });
        }).catch(function (e) {
            _assert2.default.fail(e.message);
        }).then(function () {
            dbDriver.deleteEdmAsync("testEDM", "0.0.1").then(function () {
                dbDriver.dispose();
            });
        });
    });
};

exports["dbDriver.MsSqlDriver add duplicate EDM"] = function () {
    var dbDriver = new _MsSqlDriver2.default(dbConfig);
    dbDriver.addEdmAsync("dupetest", "0.0.1", "label").then(function () {
        return dbDriver.addEdmAsync("dupetest", "0.0.1").then(function () {});
    }).then(function () {
        _assert2.default.fail("Duplicate EDM allowed to be added");
    }).catch(function (e) {
        _assert2.default.equal(e.message, "An EDM with that name and version already exists");
    }).then(function () {
        return dbDriver.deleteEdmAsync("dupetest", "0.0.1");
    }).then(function () {
        dbDriver.dispose();
    });
};
//# sourceMappingURL=_dbDriver.MsSqlDriver.js.map