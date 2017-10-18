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
    user: "home_user",
    password: "3XV%t*oMeVF$79qZuW",
    server: "lgutsql01",
    database: "Home"
};

exports["mssql.Database can connect"] = function () {

    _mssql2.default.connect(dbConfig).then(function (pool) {
        return true;
    }).catch(function (e) {
        return false;
    }).then(function (connected) {
        (0, _assert2.default)(connected);
    });
};

exports["mssql.Database"] = function () {
    var dbDriver = new _MsSqlDriver2.default(dbConfig);
    dbDriver.getDatabaseForEdmAsync(_edm2.default).then(function (dbConnection) {
        var config = {
            mssqlDatabase: dbConnection,
            edm: _edm2.default,
            schema: "dbo"
        };

        var db = new _Database2.default();

        (0, _assert2.default)(db);
    });
};

exports["mssql.Database._getTableBuildOrder"] = function () {
    var db = MsSqlDatabase;
    var options = {
        mssqlDatabase: "",
        edm: _edm2.default,
        schema: "dbo"
    };
};
//# sourceMappingURL=mssql.Database.js.map