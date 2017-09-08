"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Database = require("./sqlite/Database");

var _Database2 = _interopRequireDefault(_Database);

var _MetaDatabase = require("./MetaDatabase");

var _MetaDatabase2 = _interopRequireDefault(_MetaDatabase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaSystem = function () {
    function MetaSystem() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$decorators = _ref.decorators,
            decorators = _ref$decorators === undefined ? [] : _ref$decorators,
            _ref$edmDatabase = _ref.edmDatabase,
            edmDatabase = _ref$edmDatabase === undefined ? null : _ref$edmDatabase,
            _ref$fileSystem = _ref.fileSystem,
            fileSystem = _ref$fileSystem === undefined ? null : _ref$fileSystem,
            _ref$sqlite = _ref.sqlite,
            sqlite = _ref$sqlite === undefined ? null : _ref$sqlite;

        _classCallCheck(this, MetaSystem);

        if (edmDatabase == null) {
            throw new Error("Null Argument exception: edmDatabase is needed to run MetaDatabaseManager.");
        }

        if (fileSystem == null) {
            throw new Error("Null Argument Excepetion: fileSystem is needed to run MetaDatabaseManager.");
        }

        this.edmDatabase = edmDatabase;
        this.decorators = decorators;
        this.fileSystem = fileSystem;
        this.sqlite = sqlite;
        this.metaDatabases = [];
        this.readyPromise = this._createMetaDatabasesAsync();
    }

    _createClass(MetaSystem, [{
        key: "_createMetaDatabasesAsync",
        value: function _createMetaDatabasesAsync(edm) {
            var _this = this;

            return this.getAllEdmsAsync().then(function (edms) {
                return edms.reduce(function (promise, edm) {
                    return promise.then(function () {
                        var metaDatabase = new _MetaDatabase2.default({
                            edm: edm,
                            sqlite: _this.sqlite,
                            databasePath: _this._getPathForDatabase(edm.name, edm.version),
                            decorators: _this.decorators
                        });

                        return metaDatabase.initializeAsync();
                    });
                }, Promise.resolve());
            });
        }
    }, {
        key: "_getPathForDatabase",
        value: function _getPathForDatabase(name, version) {
            return name + "_" + version;
        }
    }, {
        key: "addDatabaseAsync",
        value: function addDatabaseAsync(user, edm) {
            var _this2 = this;

            var path = this._getPathForDatabase(edm.name, edm.version);

            this.fileSystem.access(path, this.fileSystem.constants.F_OK).then(function () {
                throw new Error("Database already exists.");
            }).then(function () {
                var metaDatabase = new _MetaDatabase2.default({
                    database: database,
                    decorators: _this2.decorators
                });

                _this2.metaDatabases.push(metaDatabase);

                return metaDatabase.initializeAsync().then(function () {
                    return metaDatabase;
                });
            }).then(function (metaDatabase) {
                return _this2.edmDatabase.getTable("Edm").addEntityAsync({
                    name: edm.name,
                    version: edm.version,
                    edm: edm,
                    decoratedEdm: metaDatabase.edm,
                    createdBy: user.id
                });
            });
        }
    }, {
        key: "getAllEdmsAsync",
        value: function getAllEdmsAsync() {
            return this.getAllDatabaseInformationAsync().then(function (results) {
                return results.map(function (information) {
                    return JSON.parse(information.decoratedEdm);
                });
            });
        }
    }, {
        key: "getDatabaseAsync",
        value: function getDatabaseAsync(name, version) {
            var _this3 = this;

            return this.readyPromise.then(function () {
                return _this3.metaDatabases.find(function (metaDatabase) {
                    return metaDatabase.name === name && metaDatabase.version === version;
                });
            });
        }
    }, {
        key: "getEdmAsync",
        value: function getEdmAsync(name, version) {
            return this.getDatabaseInformationAsync(name, version).toArrayAsync(function (result) {
                if (result == null) {
                    return null;
                } else {
                    return JSON.parse(result.decoratedEdm);
                }
            });
        }
    }, {
        key: "getAllDatabaseInformationAsync",
        value: function getAllDatabaseInformationAsync() {
            return this.edmDatabase.getTable("Edm").asQueryable().toArrayAsync();
        }
    }, {
        key: "getDatabaseInformationAsync",
        value: function getDatabaseInformationAsync(name, version) {
            return this.edmDatabase.getTable("Edm").asQueryable().where(function (expBuilder) {
                return expBuilder.and(expBuilder.property("name").isEqualTo(name), expBuilder.property("version").isEqualTo(version));
            }).toArrayAsync(function (results) {
                return results[0] || null;
            });
        }
    }, {
        key: "removeDatabaseAsync",
        value: function removeDatabaseAsync(user, name, version) {
            var _this4 = this;

            return this.readyPromise.then(function () {
                return _this4.edmDatabase.getTable("Edm").asQueryable().where(function (expBuilder) {
                    return expBuilder.and(expBuilder.property("name").isEqualTo(name), expBuilder.property("version").isEqualTo(version));
                }).toArrayAsync().then(function (results) {
                    var information = results[0];

                    if (information == 0) {
                        throw new Error("Couldn't find database information for " + name + ":" + version + ".");
                    }

                    if (information.createdBy !== user.id) {
                        throw new Error("You do not have permission to delete this database.");
                    }

                    return Promise.all([_this4.edmDatabase.removeEntityAsync(information), _this4.fileSystem.unlink(_this4._getPathForDatabase(name, version))]);
                });
            });
        }
    }]);

    return MetaSystem;
}();

exports.default = MetaSystem;
//# sourceMappingURL=MetaSystem.js.map