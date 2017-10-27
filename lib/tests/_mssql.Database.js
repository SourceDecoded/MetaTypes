"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Database = require("../mssql/Database");

var _Database2 = _interopRequireDefault(_Database);

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
    dataSchema: "dbo"
};

var setupAsync = function setupAsync() {
    return new Promise(function (resolve, reject) {
        var dbDriver = new _MsSqlDriver2.default(dbConfig);
        dbDriver.getDatabaseForEdmAsync(_edm2.default).then(function (db) {
            resolve({
                dbDriver: dbDriver,
                instance: db
            });
        });
    });
};

exports["mssql.Database constructor"] = function () {
    setupAsync().then(function (setup) {
        (0, _assert2.default)(setup.instance);
        setup.dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};

exports["mssql.Database._createTables"] = function () {
    setupAsync().then(function (setup) {
        setup.instance._createTables();
        setup.dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};

exports["mssql.Database._getTableFromEdm"] = function () {
    setupAsync().then(function (setup) {
        var table = setup.instance._getTableFromEdm("Source");
        (0, _assert2.default)(table);
        setup.dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};

exports["mssql.Database._getTableBuildOrder"] = function () {
    setupAsync().then(function (setup) {
        var buildOrder = setup.instance._getTableBuildOrder();
        (0, _assert2.default)(buildOrder.length > 0);
        setup.dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};

exports["mssql.Database.createAsync"] = function () {
    setupAsync().then(function (setup) {
        setup.instance.createAsync().then(function () {
            (0, _assert2.default)(true);
        }).catch(function (e) {
            _assert2.default.fail(e.message);
        }).then(function () {
            setup.dbDriver.dispose();
        });
    }).catch(function () {
        _assert2.default.fail(e.message);
    });
};

exports["mssql.Database.dropAsync"] = function () {
    setupAsync().then(function (setup) {
        setup.instance.dropAsync().then(function () {
            (0, _assert2.default)(true);
        }).catch(function (e) {
            _assert2.default.fail(e.message); //
        }).then(function () {
            setup.dbDriver.dispose();
        });
    }).catch(function () {
        _assert2.default.fail(e.message);
    });
};

exports["mssql.Database.getTable"] = function () {
    setupAsync().then(function (setup) {
        var table = setup.instance.getTable("Source");
        (0, _assert2.default)(table);
        setup.dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};

exports["mssql.Database.getTables"] = function () {
    setupAsync().then(function (setup) {
        var tables = setup.instance.getTables();
        (0, _assert2.default)(tables.length > 0);
        setup.dbDriver.dispose();
    }).catch(function (e) {
        _assert2.default.fail(e.message);
    });
};
//# sourceMappingURL=_mssql.Database.js.map