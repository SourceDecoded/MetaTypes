"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _LocalFileSystem = require("../util/LocalFileSystem");

var _LocalFileSystem2 = _interopRequireDefault(_LocalFileSystem);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // GlassDb
// Manages a set of GlassPanes


var supportedDrivers = {
    "sqlite": _SqliteDriver2.default,
    "mssql": _MsSqlDriver2.default
};

var supportedFileSystems = {
    "localFileSystem": _LocalFileSystem2.default
};

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
    ],
    "authenticator": (iAuthenticator),
    "actions":[
        {
            "name":"actionName",
            "scope": "api" || "edm" || "table" || "entity",
            "match": {
                "edm":"edmName",
                "version":"versionString" || "*",
                "table":"post"
            },
            "executeAsync":(actionOptions)
        }
    ]
}

actionOptions {
    "metaDatabase": metaDatabase || undefined,
    "edm":edm || undefined,
    "tableName": "name" || undefined,
    "entity": entity || undefined,
    "body": requestBody || undefined,
    "query": requestQuery || undefined,
    "user": user
}
*/

var _class = function (_EventEmitter) {
    _inherits(_class, _EventEmitter);

    function _class() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

        _this.glassPanes = {};
        _this.glassDoors = [];
        _this.authenticator = options.authenticator;
        _this.decorators = options.decorators || [];
        _this.actions = { "api": {}, "edm": {}, "table": {}, "entity": {} };

        if (!options.dbDriver) {
            throw new Error("Need dbDriver info");
        }

        var dbDriver = options.dbDriver;

        if (Object.keys(supportedDrivers).indexOf(dbDriver.name) === -1) {
            throw new Error("Unsupported dbDriver: " + dbDriver.name);
        }

        _this._driver = new supportedDrivers[dbDriver.name](dbDriver.options);

        _this._fileSystem = new supportedFileSystems[options.fileSystem.name](options.fileSystem.options);

        if (options.actions) {
            options.actions.forEach(function (action) {
                _this.registerAction(action);
            });
        }

        _this._driver.getEdmListAsync().then(function (edms) {
            return _this._buildPanesAsync(edms);
        }).then(function () {
            return _this._openDoorsAsync(options.doors);
        }).then(function () {
            _this.emit("ready");
        }).catch(function (error) {
            _this.emit("error", error);
        });
        return _this;
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
        key: "updateEdmAsync",
        value: function updateEdmAsync(newEdm) {
            var name = newEdm.name,
                version = newEdm.version;

            var thePane = this.glassPanes[name + version];
            if (!thePane) {
                return Promise.reject("Not an active EDM: " + name + " " + version);
            }
            return this._driver.updateEdmAsync(newEdm);
        }
    }, {
        key: "registerAction",
        value: function registerAction(action) {
            if (action.scope === "api") {
                this.actions.api[action.name] = action;
            } else if (action.scope === "edm") {
                this.actions.edm[action.match.edm] = this.actions.edm[action.match.edm] || {};
                this.actions.edm[action.match.edm][action.match.version] = this.actions.edm[action.match.edm][action.match.version] || {};
                this.actions.edm[action.match.edm][action.match.version][action.name] = action;
            } else if (action.scope === "table") {
                this.actions.table[action.match.edm] = this.actions.table[action.match.edm] || {};
                this.actions.table[action.match.edm][action.match.version] = this.actions.table[action.match.edm][action.match.version] || {};
                this.actions.table[action.match.edm][action.match.version][action.match.table] = this.actions.table[action.match.edm][action.match.version][action.match.table] || {};
                this.actions.table[action.match.edm][action.match.version][action.match.table][action.name] = action;
            } else if (action.scope === "entity") {
                this.actions.entity[action.match.edm] = this.actions.table[action.match.edm] || {};
                this.actions.entity[action.match.edm][action.match.version] = this.actions.entity[action.match.edm][action.match.version] || {};
                this.actions.entity[action.match.edm][action.match.version][action.match.table] = this.actions.entity[action.match.edm][action.match.version][action.match.table] || {};
                this.actions.entity[action.match.edm][action.match.version][action.match.table][action.name] = action;
            }
        }
    }, {
        key: "executeApiActionAsync",
        value: function executeApiActionAsync(actionName, options) {
            if (!this.actions.api[actionName]) {
                return Promise.reject("API action not found: " + actionName);
            }
            return this.actions.api[actionName].executeAsync(options);
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
                var actions = { "edm": {}, "table": {}, "entity": {} };

                if (_this6.actions.edm[edm.name] && _this6.actions.edm[edm.name][edm.version]) {
                    Object.assign(actions.edm, _this6.actions.edm[edm.name][edm.version]);
                }
                if (_this6.actions.edm[edm.name] && _this6.actions.edm[edm.name]["*"]) {
                    Object.assign(actions.edm, _this6.actions.edm[edm.name]["*"]);
                }

                if (_this6.actions.table[edm.name] && _this6.actions.table[edm.name][edm.version]) {
                    Object.assign(actions.table, _this6.actions.table[edm.name][edm.version]);
                }
                if (_this6.actions.table[edm.name] && _this6.actions.table[edm.name]["*"]) {
                    Object.assign(actions.table, _this6.actions.table[edm.name]["*"]);
                }

                if (_this6.actions.entity[edm.name] && _this6.actions.entity[edm.name][edm.version]) {
                    Object.assign(actions.entity, _this6.actions.entity[edm.name][edm.version]);
                }
                if (_this6.actions.entity[edm.name] && _this6.actions.entity[edm.name]["*"]) {
                    Object.assign(actions.entity, _this6.actions.entity[edm.name]["*"]);
                }

                var metaOptions = {
                    database: db,
                    decorators: _this6.decorators,
                    fileSystem: _this6._fileSystem
                };

                var metaDatabase = new _Database2.default(metaOptions);

                var paneOptions = {
                    metaDatabase: metaDatabase,
                    migrationRunner: new _Runner2.default({ edm: edm, migrator: db.getMigrator() }),
                    edm: edm,
                    actions: actions
                };

                var pane = new _GlassPane2.default(paneOptions);
                _this6.glassPanes[edm.name + edm.version] = pane;
                return pane;
            });
        }
    }, {
        key: "_openDoorsAsync",
        value: function _openDoorsAsync() {
            var _this7 = this;

            var doorsConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

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
}(_events2.default);

exports.default = _class;
//# sourceMappingURL=GlassApi.js.map