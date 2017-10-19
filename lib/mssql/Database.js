"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Table = require("./Table");

var _Table2 = _interopRequireDefault(_Table);

var _Validator = require("./../edm/Validator");

var _Validator2 = _interopRequireDefault(_Validator);

var _dataTypeMapping = require("./dataTypeMapping");

var _dataTypeMapping2 = _interopRequireDefault(_dataTypeMapping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var edmValidator = new _Validator2.default(_dataTypeMapping2.default);

var Database = function () {
    function Database() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Database);

        var mssqlDatabase = options.mssqlDatabase;
        var edm = options.edm;
        var schema = options.schema;

        if (mssqlDatabase == null) {
            throw new Error("Database needs to have an mssqlDatabase.");
        }
        if (edm == null) {
            throw new Error("Database needs to have an edm.");
        }

        this.schema = schema;
        this.name = edm.name;
        this.edm = edm;
        this.mssqlDatabase = mssqlDatabase;
        this.tables = {};

        edmValidator.validate(edm);
        this._createTables();
    }

    _createClass(Database, [{
        key: "_createTables",
        value: function _createTables() {
            var _this = this;

            var options = {
                mssqlDatabase: this.mssqlDatabase,
                edm: this.edm,
                schema: this.schema
            };

            this.edm.tables.forEach(function (table) {
                _this.tables[table.name] = new _Table2.default(table.name, options);
            });
        }
    }, {
        key: "_getTableFromEdm",
        value: function _getTableFromEdm(name) {
            return this.edm.tables.find(function (table) {
                return table.name = name;
            });
        }
    }, {
        key: "_getTableBuildOrder",
        value: function _getTableBuildOrder() {
            var _this2 = this;

            var walkedTables = [];

            this.edm.tables.forEach(function (table) {
                _this2._walkRelationships(table, walkedTables);
            });

            return walkedTables;
        }
    }, {
        key: "_walkRelationships",
        value: function _walkRelationships(table, tablesWalked) {
            var _this3 = this;

            if (tablesWalked.indexOf(table) > -1) {
                return;
            }

            var forEachRelationship = function forEachRelationship(relationship) {
                var sourceTable = _this3._getTableFromEdm(relationship.type);
                _this3._walkRelationships(sourceTable, tablesWalked);
            };

            this.edm.relationships.oneToOne.filter(function (relationship) {
                relationship.ofType === table.name;
            }).forEach(forEachRelationship);

            this.edm.relationships.oneToMany.filter(function (relationship) {
                relationship.ofType === table.name;
            }).forEach(forEachRelationship);

            tablesWalked.push(table);
        }
    }, {
        key: "createAsync",
        value: function createAsync() {
            var _this4 = this;

            var buildOrder = this._getTableBuildOrder();

            return buildOrder.reduce(function (promise, table) {
                return promise.then(function () {
                    var sqliteDatabaseTable = _this4.tables[table.name];
                    return sqliteDatabaseTable.createAsync();
                });
            }, Promise.resolve());
        }
    }, {
        key: "dropAsync",
        value: function dropAsync() {
            var _this5 = this;

            var buildOrder = this._getTableBuildOrder().reverse();

            return buildOrder.reduce(function (promise, table) {
                return promise.then(function () {
                    var sqliteDatabaseTable = _this5.tables[table.name];
                    return sqliteDatabaseTable.dropAsync();
                });
            }, Promise.resolve());
        }
    }, {
        key: "getTable",
        value: function getTable(name) {
            return this.tables[name];
        }
    }, {
        key: "getTables",
        value: function getTables() {
            var _this6 = this;

            return Object.keys(this.tables).map(function (name) {
                return _this6.tables[name];
            });
        }
    }]);

    return Database;
}();

exports.default = Database;
//# sourceMappingURL=Database.js.map