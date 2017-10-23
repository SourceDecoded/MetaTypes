"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // SqlServerDriver.js


var _mssql = require("mssql");

var _mssql2 = _interopRequireDefault(_mssql);

var _Database = require("../mssql/Database");

var _Database2 = _interopRequireDefault(_Database);

var _Migrator = require("../mssql/Migrator");

var _Migrator2 = _interopRequireDefault(_Migrator);

var _Edm = require("../edm/Edm");

var _Edm2 = _interopRequireDefault(_Edm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var generateEdmCreateSql = function generateEdmCreateSql(options) {
    return "CREATE TABLE " + options.edmSchema + "." + options.edmTable + "(\n        [id] [int] IDENTITY(1,1) NOT NULL,\n        [json] [text] NOT NULL,\n        [name] [varchar](100) NOT NULL,\n        [version] [varchar](10),\n     CONSTRAINT [PK_edm.edm] PRIMARY KEY CLUSTERED \n    (\n        [id] ASC\n    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]\n    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]";
};

var generateGetEdmsQuery = function generateGetEdmsQuery(options) {
    return "SELECT [id], [json], [name], [version] \n    FROM " + options.edmSchema + "." + options.edmTable;
};

var _class = function () {
    function _class() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, _class);

        if (!options.user) {
            throw new Error("MsSqlDriver requires a user");
        }
        if (!options.password) {
            throw new Error("MsSqlDriver requires a password");
        }
        if (!options.server) {
            throw new Error("MsSqlDriver requires a server");
        }

        options.edmDb = options.edmDb || "GLASS_edm";
        options.edmSchema = options.edmSchema || "dbo";
        options.edmTable = options.edmTable || "edm";
        options.dataSchema = options.dataSchema || "dbo";
        options.dataDb = options.dataDb || "GLASS_data";

        this.options = options;

        this._edmPool = new _mssql2.default.ConnectionPool({
            user: options.user,
            password: options.password,
            server: options.server,
            database: options.edmDb
        });
        this._edmPool.on("error", function (e) {
            console.error(e);
        });
        this._edmPoolPromise = this._edmPool.connect();

        this._dataPool = new _mssql2.default.ConnectionPool({
            user: options.user,
            password: options.password,
            server: options.server,
            database: options.dataDb
        });
        this._dataPool.on("error", function (e) {
            console.error(e);
        });
        this._dataPoolPromise = this._dataPool.connect();
    }

    _createClass(_class, [{
        key: "getEdmDbAsync",
        value: function getEdmDbAsync() {
            var _this = this;

            return this._edmPoolPromise.then(function () {
                return _this._edmPool;
            });
        }
    }, {
        key: "getDataDbAsync",
        value: function getDataDbAsync() {
            var _this2 = this;

            return this._dataPoolPromise.then(function () {
                return _this2._dataPool;
            });
        }
    }, {
        key: "getEdmListAsync",
        value: function getEdmListAsync() {
            var _this3 = this;

            return this._verifyEdmTableAsync().then(function (pool) {
                return pool.request().query(generateGetEdmsQuery(_this3.options));
            }).then(function (result) {
                return result.recordset;
            });
        }
    }, {
        key: "getEdmAsync",
        value: function getEdmAsync(name, version) {
            var _this4 = this;

            return this._getEdmDbAsync().then(function (pool) {
                return pool.request().query("SELECT * FROM [" + _this4.options.edmSchema + "].[" + _this4.options.edmTable + "] WHERE\n            [version]=" + version + " AND [name]='" + name + "'").then(function (result) {
                    return result.recordset[0];
                });
            });
        }
    }, {
        key: "addEdmAsync",
        value: function addEdmAsync(name, version) {
            var _this5 = this;

            var newEdm = new _Edm2.default();
            return this._getEdmDbAsync().then(function (pool) {
                return pool.request().query("INSERT INTO [" + _this5.options.edmSchema + "].[" + _this5.options.edmTable + "] \n            (name, version, json) VALUES ('" + name + "', '" + version + "', '" + JSON.stringify(newEdm) + "')").then(function (result) {
                    return;
                });
            });
        }
    }, {
        key: "deleteEdmAsync",
        value: function deleteEdmAsync(name, version) {
            var _this6 = this;

            return this._getEdmDbAsync().then(function (pool) {
                return pool.request().query("DELETE FROM [" + _this6.options.edmSchema + "].[" + _this6.options.edmTable + "]\n            WHERE [version]=" + version + " AND [name]='" + name + "'").then(function () {
                    return;
                });
            });
        }
    }, {
        key: "getDatabaseForEdmAsync",
        value: function getDatabaseForEdmAsync(edm) {
            var _this7 = this;

            return this.getDataDbAsync().then(function (pool) {
                return new _Database2.default({
                    edm: edm,
                    mssqlDatabase: pool,
                    schema: _this7.options.dataSchema
                });
            });
        }
    }, {
        key: "getMigrator",
        value: function getMigrator() {
            return new _Migrator2.default(this._edmPoolPromise);
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this.getEdmDbAsync().then(function (pool) {
                pool.close();
            });
            this.getDataDbAsync().then(function (pool) {
                pool.close();
            });
        }
    }, {
        key: "_checkEdmDbExistsAsync",
        value: function _checkEdmDbExistsAsync(pool) {
            var _this8 = this;

            return new Promise(function (resolve, reject) {
                var q = "SELECT * FROM INFORMATION_SCHEMA.TABLES \n            WHERE TABLE_SCHEMA = '" + _this8.options.edmSchema + "' \n            AND TABLE_NAME = '" + _this8.options.edmTable + "'";
                pool.request().query(q).then(function (result) {
                    if (result.recordset.length === 1) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: "_verifyEdmTableAsync",
        value: function _verifyEdmTableAsync() {
            var _this9 = this;

            return this.getEdmDbAsync().then(function (pool) {
                return _this9._checkEdmDbExistsAsync(pool).then(function (exists) {
                    if (exists) {
                        return pool;
                    } else {
                        var q = generateEdmCreateSql(_this9.options);
                        return pool.request().query(q).then(function () {
                            return pool;
                        });
                    }
                });
            });
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=MsSqlDriver.js.map