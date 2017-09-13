"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Database = require("./sqlite/Database");

var _Database2 = _interopRequireDefault(_Database);

var _MetaTable = require("./MetaTable");

var _MetaTable2 = _interopRequireDefault(_MetaTable);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaDatabase = function () {
    function MetaDatabase() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$decorators = _ref.decorators,
            decorators = _ref$decorators === undefined ? [] : _ref$decorators,
            _ref$sqlite = _ref.sqlite,
            sqlite = _ref$sqlite === undefined ? null : _ref$sqlite,
            _ref$databasePath = _ref.databasePath,
            databasePath = _ref$databasePath === undefined ? null : _ref$databasePath,
            _ref$edm = _ref.edm,
            edm = _ref$edm === undefined ? null : _ref$edm,
            _ref$fileSystem = _ref.fileSystem,
            fileSystem = _ref$fileSystem === undefined ? null : _ref$fileSystem;

        _classCallCheck(this, MetaDatabase);

        if (!Array.isArray(decorators)) {
            throw new Error("Invalid Argument: decorators needs to be an array.");
        }

        if (sqlite == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a sqlite.");
        }

        if (databasePath == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a databasePath.");
        }

        if (edm == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a edm.");
        }

        if (fileSystem == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a fileSystem.");
        }

        this.decorators = decorators;
        this.databasePath = databasePath;
        this.sqlite = sqlite;
        this.edm = edm;
        this.name = this.edm.name;
        this.version = this.edm.version;
        this.fileSystem = fileSystem;
        this.tables = {};
        this.readyPromise = null;

        this._initializeAsync();
    }

    _createClass(MetaDatabase, [{
        key: "_createDatabaseAsync",
        value: function _createDatabaseAsync(edm) {
            var path = this.databasePath;

            return this.sqlite.open(path).then(function (sqliteDatabase) {
                var database = new _Database2.default({
                    edm: edm,
                    sqliteDatabase: sqliteDatabase
                });

                return database;
            });
        }
    }, {
        key: "_initializeEdmAsync",
        value: function _initializeEdmAsync(edm) {
            var decoratedEdm = JSON.parse(JSON.stringify(edm));

            if (edm.isInitialized) {
                this.edm = this.decoratedEdm;
                return Promise.resolve(decoratedEdm);
            } else {
                return this._invokeOnDecoratorsAsync("prepareEdmAsync", [decoratedEdm]).then(function () {
                    return decoratedEdm;
                });
            }
        }
    }, {
        key: "_initializeAsync",
        value: function _initializeAsync() {
            var _this = this;

            if (this.readyPromise == null) {
                var database = null;

                return this.readyPromise = this._initializeEdmAsync(this.edm).then(function (edm) {
                    _this.edm = edm;
                    var databasePromise = _this._createDatabaseAsync(edm);

                    if (!edm.isInitialized) {
                        databasePromise = databasePromise.then(function (newDatabase) {
                            database = newDatabase;
                            return newDatabase.createAsync();
                        }).then(function () {
                            _this.edm.isInitialized = true;
                        });
                    }

                    return databasePromise;
                }).then(function () {

                    return _this.decorators.reduce(function (promise, decorator) {
                        return promise.then(function () {
                            return _this._invokeOnDecoratorsAsync("activatedAsync", [_this]);
                        });
                    }, Promise.resolve());
                }).then(function () {

                    database.getTables().forEach(function (table) {
                        _this.tables[table.name] = new _MetaTable2.default({
                            table: table,
                            decorators: _this.decorators,
                            fileSystem: _this.fileSystem
                        });
                    });
                });
            }

            return this.readyPromise;
        }
    }, {
        key: "_invokeOnDecoratorsAsync",
        value: function _invokeOnDecoratorsAsync(methodName, args) {
            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    if (typeof decorator[methodName] === "function") {
                        var value = decorator[methodName].apply(decorator, args);
                        if (!(value instanceof Promise)) {
                            return Promise.resolve(value);
                        }
                        return value;
                    }
                });
            }, Promise.resolve());
        }
    }, {
        key: "getTableAsync",
        value: function getTableAsync(name) {
            var _this2 = this;

            return this.readyPromise.then(function () {
                return _this2.tables[name] || null;
            });
        }
    }, {
        key: "getTablesAsync",
        value: function getTablesAsync() {
            var _this3 = this;

            return this.readyPromise.then(function () {
                return Object.keys(_this3.tables).map(function (name) {
                    return _this3.tables[name];
                });
            });
        }
    }, {
        key: "initializeAsync",
        value: function initializeAsync() {
            return this.readyPromise;
        }
    }]);

    return MetaDatabase;
}();

exports.default = MetaDatabase;
//# sourceMappingURL=MetaDatabase.js.map