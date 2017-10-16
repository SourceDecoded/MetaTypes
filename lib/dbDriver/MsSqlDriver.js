"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // SqlServerDriver.js


var _mssql = require("mssql");

var _mssql2 = _interopRequireDefault(_mssql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

generateEdmCreateSql = function generateEdmCreateSql(options) {
    return "CREATE TABLE " + options.edmSchema + "." + options.edmTable + "(\n        [id] [int] IDENTITY(1,1) NOT NULL,\n        [json] [text] NOT NULL,\n        [name] [varchar](100) NOT NULL,\n        [version] [int],\n     CONSTRAINT [PK_edm.edm] PRIMARY KEY CLUSTERED \n    (\n        [id] ASC\n    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]\n    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]";
};

generateGetEdmsQuery = function generateGetEdmsQuery(options) {
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

        this._edmPoolPromse = _mssql2.default.connect({
            user: options.user,
            password: options.password,
            server: options.server,
            database: options.edmDb
        });

        this._dataPoolPromise = _mssql2.default.connect({
            user: options.user,
            password: options.password,
            server: options.server,
            database: options.edmDb
        });
    }

    _createClass(_class, [{
        key: "getEdmDbAsync",
        value: function getEdmDbAsync() {
            return this._edmPoolPromse;
        }
    }, {
        key: "getDataDbAsync",
        value: function getDataDbAsync() {
            return this._dataPoolPromise;
        }
    }, {
        key: "getEdmListAsync",
        value: function getEdmListAsync() {
            var _this = this;

            return _verifyEdmTableAsync().then(function (pool) {
                return pool.query(generateGetEdmsQuery(_this.options));
            }).then(function (result) {
                return result.recordset;
            });
        }
    }, {
        key: "getDatabaseForEdmAsync",
        value: function getDatabaseForEdmAsync(edm) {
            return this.getDataDbAsync().then(function (pool) {
                return new MsSqlDatabase({
                    edm: edm,
                    mssqlDatabase: pool
                });
            });
        }
    }, {
        key: "_checkEdmDbExistsAsync",
        value: function _checkEdmDbExistsAsync(pool) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                pool.query("SELECT * FROM INFORMATION_SCHEMA.TABLES \n            WHERE TABLE_SCHEMA = " + _this2.options.edmSchema + " \n            AND  TABLE_NAME = " + _this2.options.edmTable).then(function (result) {
                    if (result.length === 1) {
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
            var _this3 = this;

            return this.getEdmDbAsync().then(function (pool) {
                _this3._checkEdmDbExistsAsync(pool).then(function (exists) {
                    if (exists) {
                        return pool;
                    } else {
                        return pool.query(generateEdmCreateSql(_this3.options)).then(function () {
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