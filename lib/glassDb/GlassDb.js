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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

supportedDrivers = {
    "sqlite": "../dbDriver/SqliteDriver",
    "mssql": "../dbDriver/MsSqlDriver"
};

supportedFilesystems = {};

supportedDoors = {
    "express": "../glassDoor/ExpressDoor"
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
    }
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
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, _class);

        this.glassPanes = {};
        this.glassDoors = [];

        if (!options.dbDriver) {
            throw new Error("Need dbDriver info");
        }

        var dbDriver = options.dbDriver;

        if (Object.keys(supportedDrivers).find(dbDriver.name) === -1) {
            throw new Error("Unsupported dbDriver: " + dbDriver.name);
        }

        var driver = new require(supportedDrivers[dbDriver.name])(dbDriver.options);

        driver.getEdmListAsync().then(function (edms) {
            return _buildPanesAsync(edms);
        }).then(function () {
            return _openDoorsAsync(options.doors);
        });
    }

    _createClass(_class, [{
        key: "_buildPanesAsync",
        value: function _buildPanesAsync(edms) {
            var _this = this;

            return edms.reduce(function (previous, current) {
                return previous.then(function () {
                    return driver.getDatabaseForEdmAsync(current).then(function (db) {
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
                            migrationRunner: new _Runner2.default({ migrator: driver.getMigrator() }),
                            edm: current
                        };
                        _this.glassPanes[edm.name + edm.version] = new _GlassPane2.default(paneOptions);
                    });
                });
            }, Promise.resolve());
        }
    }, {
        key: "_openDoorsAsync",
        value: function _openDoorsAsync(doorsConfig) {
            var _this2 = this;

            if (doorsConfig.length === 0) {
                console.warn("GlassDB is running, but there is no way to access it. Include one or more doors in the options.");
            }
            doorsConfig.forEach(function (doorConfig) {
                doorConfig.options['glass'] = _this2;
                var door = new require(supportedDoors[door.name])(door.options);
                _this2.glassDoors.push(door);
            });
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=GlassDb.js.map