"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // SqliteDriver.js


var _sqlite = require("sqlite");

var _sqlite2 = _interopRequireDefault(_sqlite);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _Database = require("../sqlite/Database");

var _Database2 = _interopRequireDefault(_Database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var generateCreateSql = function generateCreateSql() {
    return "CREATE TABLE IF NOT EXISTS edm \n    (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\n     \"json\" TEXT,\n     \"name\" TEXT,\n     \"version\" INTEGER)";
};

/*
{
    storageMode: ["file" || "memory"]
    path: "path/to/data/dir/if/file",
    edmDb: "filenameIfFileMode.sqlite",
    dataDb: "filenameIfFileMode.sqlite"
}
*/

var _class = function () {
    function _class() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, _class);

        if (options.storageMode === "file" && typeof options.path !== "string") {
            throw new Error("SqliteDriver needs a path to the data folder");
        }

        options.edmDb = options.edmDb || "glassEDM.sqlite3";
        options.dataDb = options.dataDb || "data.sqlite3";
        options.storageMode = options.storageMode || "memory";

        this._edmDbPromise = null;
        this._dataDbPromise = null;

        this._storageMode = options.storageMode;
        this._storageModes = {
            "file": {
                getEdmDbAsync: function getEdmDbAsync() {
                    return _sqlite2.default.open(_path2.default.resolve(options.path, options.edmDb));
                },
                getDataDbAsync: function getDataDbAsync() {
                    return _sqlite2.default.open(_path2.default.resolve(options.path, options.dataDb));
                }
            },
            "memory": {
                "getEdmDbAsync": function getEdmDbAsync() {
                    return _sqlite2.default.open(":memory:");
                },
                "getDataDbAsync": function getDataDbAsync() {
                    return _sqlite2.default.open(":memory:");
                }
            }
        };

        if (options.path === ":memory:") {
            console.warn("SQLite using an in-memory databases, data will not persist");
        }
    }

    _createClass(_class, [{
        key: "getEdmDbAsync",
        value: function getEdmDbAsync() {
            if (!this._edmDbPromise) {
                this._edmDbPromise = this._storageModes[this._storageMode].getEdmDbAsync();
            }
            return this._edmDbPromise;
        }
    }, {
        key: "getDataDbAsync",
        value: function getDataDbAsync() {
            if (!this._dataDbPromise) {
                this._dataDbPromise = this._storageModes[this._storageMode].getDataDbAsync();
            }
            return this._dataDbPromise;
        }
    }, {
        key: "getEdmAsync",
        value: function getEdmAsync(name, version) {}
    }, {
        key: "addEdmAsync",
        value: function addEdmAsync(name, version) {}
    }, {
        key: "deleteEdmAsync",
        value: function deleteEdmAsync(name, version) {}
    }, {
        key: "getDatabaseForEdmAsync",
        value: function getDatabaseForEdmAsync(edm) {
            return this.getDataDbAsync().then(function (db) {
                return new _Database2.default({
                    edm: edm,
                    sqliteDatabase: db
                });
            });
        }
    }, {
        key: "getEdmListAsync",
        value: function getEdmListAsync() {
            return this._verifyEdmTableAsync().then(function (db) {
                return db.all("SELECT * FROM edm");
            });
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this.getEdmDbAsync().then(function (db) {
                db.close();
            });
            this.getDataDbAsync().then(function (db) {
                db.close();
            });
        }
    }, {
        key: "_verifyEdmTableAsync",
        value: function _verifyEdmTableAsync() {
            return this.getEdmDbAsync().then(function (db) {
                return db.run(generateCreateSql()).then(function () {
                    return db;
                });
            });
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=SqliteDriver.js.map