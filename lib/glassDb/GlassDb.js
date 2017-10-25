"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // GlassDb
// Manages a set of GlassPanes


var _GlassPane = require("../glassPane/GlassPane");

var _GlassPane2 = _interopRequireDefault(_GlassPane);

var _Runner = require("../migration/Runner");

var _Runner2 = _interopRequireDefault(_Runner);

var _Database = require("../meta/Database");

var _Database2 = _interopRequireDefault(_Database);

var _MsSqlDriver = require("../dbDriver/MsSqlDriver");

var _MsSqlDriver2 = _interopRequireDefault(_MsSqlDriver);

var _SqliteDriver = require("../dbDriver/SqliteDriver");

var _SqliteDriver2 = _interopRequireDefault(_SqliteDriver);

var _GlassExpressDoor = require("../glassDoor/GlassExpressDoor");

var _GlassExpressDoor2 = _interopRequireDefault(_GlassExpressDoor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var supportedDrivers = {
    "sqlite": _SqliteDriver2.default,
    "mssql": _MsSqlDriver2.default
};

var supportedFilesystems = {};

var supportedDoors = {
    "express": _GlassExpressDoor2.default
};

/*
{
    "dbDriver": {
        "name": "mssql" || "sqlite",
        "options": {(driver-specific options)}
    },
    "fileSystem": {
        "name": "fsDriverName",
        "options": {(fs driver-specific options)}
    },
    "doors": [
        {
            "name": "express",
            "options": {
                "address":"0.0.0.0",
                "port":"9000"
            }
        }
    ]
}
*/

var _class = function () {
    function _class() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, _class);

        this.glassPanes = {};
        this.glassDoors = [];

        if (!options.dbDriver) {
            throw new Error("Need dbDriver info");
        }

        var dbDriver = options.dbDriver;

        if (Object.keys(supportedDrivers).indexOf(dbDriver.name) === -1) {
            throw new Error("Unsupported dbDriver: " + dbDriver.name);
        }

        this._driver = new supportedDrivers[dbDriver.name](dbDriver.options);

        this._driver.getEdmListAsync().then(function (edms) {
            return _this._buildPanesAsync(edms);
        }).then(function () {
            return _this._openDoorsAsync(options.doors);
        });
    }

    _createClass(_class, [{
        key: "dispose",
        value: function dispose() {
            var _this2 = this;

            this.glassDoors.forEach(function (door) {
                if (typeof door.dispose === "function") {
                    door.dispose();
                }
            });

            Object.keys(this.glassPanes).forEach(function (key) {
                _this2.glassPanes[key].dispose();
            });
        }
    }, {
        key: "getEdmAsync",
        value: function getEdmAsync(name, version) {
            return this._driver.getEdmAsync(name, version);
        }
    }, {
        key: "addEdmAsync",
        value: function addEdmAsync(name, version, label) {
            var _this3 = this;

            return this._driver.addEdmAsync(name, version, label).then(function () {
                return _this3._driver.getEdmAsync(name, version);
            }).then(function (edm) {
                return _this3._buildPaneAsync(edm);
            }).then(function (pane) {
                Object.keys(_this3.glassDoors).map(function (key) {
                    return _this3.glassDoors[key];
                }).forEach(function (door) {
                    door.addPane(pane);
                });
            });
        }
    }, {
        key: "deleteEdmAsync",
        value: function deleteEdmAsync(name, version) {
            var _this4 = this;

            var thePane = this.glassPanes[name + version];
            if (!thePane) {
                return Promise.reject("Not an active EDM: " + name + " " + version);
            }
            return this._driver.deleteEdmAsync(name, version).then(function () {
                _this4.glassPanes[name + version].dispose();
                delete _this4.glassPanes[name + version];
            });
        }
    }, {
        key: "_buildPanesAsync",
        value: function _buildPanesAsync(edms) {
            var _this5 = this;

            return edms.reduce(function (previous, current) {
                return previous.then(function () {
                    return _this5._buildPaneAsync(current);
                });
            }, Promise.resolve());
        }
    }, {
        key: "_buildPaneAsync",
        value: function _buildPaneAsync(edm) {
            var _this6 = this;

            return this._driver.getDatabaseForEdmAsync(edm).then(function (db) {
                // TODO: instantiate decorators
                var decorators = [];

                // TODO: instantiate filesystem
                var fileSystem = {};

                var metaOptions = {
                    database: db,
                    decorators: decorators,
                    fileSystem: fileSystem
                };

                var metaDatabase = new _Database2.default(metaOptions);

                var paneOptions = {
                    metaDatabase: metaDatabase,
                    migrationRunner: new _Runner2.default({ edm: edm, migrator: _this6._driver.getMigrator(db) }),
                    edm: edm
                };

                var pane = new _GlassPane2.default(paneOptions);
                _this6.glassPanes[edm.name + edm.version] = pane;
                return pane;
            });
        }
    }, {
        key: "_openDoorsAsync",
        value: function _openDoorsAsync(doorsConfig) {
            var _this7 = this;

            if (doorsConfig.length === 0) {
                console.warn("GlassDB is running, but there is no way to access it. Include one or more doors in the options.");
            }
            doorsConfig.forEach(function (doorConfig) {
                doorConfig.options['glass'] = _this7;
                var door = new supportedDoors[doorConfig.name](doorConfig.options);
                Object.keys(_this7.glassPanes).map(function (key) {
                    return _this7.glassPanes[key];
                }).forEach(function (pane) {
                    door.addPane(pane);
                });
                _this7.glassDoors.push(door);
            });
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=GlassDb.js.map