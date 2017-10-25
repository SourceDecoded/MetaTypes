"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TableStatementBuilder = require("./TableStatementBuilder");

var _TableStatementBuilder2 = _interopRequireDefault(_TableStatementBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Migrator = function () {
    function Migrator(iDb) {
        _classCallCheck(this, Migrator);

        this.schema = iDb.schema;
        this.iDb = iDb;
        this.connectionPool = iDb.connectionPool;
        this.name = "MsSqlMigrator";
    }

    _createClass(Migrator, [{
        key: "_getQualifiedDbTableName",
        value: function _getQualifiedDbTableName(table, version) {
            return "[" + this.schema + "].[" + table + "__" + version.replace(/\./g, "_") + "]";
        }
    }, {
        key: "addColumnAsync",
        value: function addColumnAsync(edm) {
            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var metaTable = this.iDb.getTable(command.options.tableName).table;
            var builder = new _TableStatementBuilder2.default(metaTable, {
                edm: edm,
                schema: this.schema
            });
            var query = "ALTER TABLE " + this._getQualifiedDbTableName(command.options.tableName, edm.version) + " ADD ";
            query += builder.createColumnDefinitionStatement(command.options.column);

            return this.connectionPool.request().query(query);
        }
    }, {
        key: "addDecoratorAsync",
        value: function addDecoratorAsync(edm) {
            // nothing to do here

            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "addOneToOneRelationshipAsync",
        value: function addOneToOneRelationshipAsync(edm) {
            // nothing to do here

            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "addOneToManyRelationshipAsync",
        value: function addOneToManyRelationshipAsync(edm) {
            // nothing to do here

            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "addTableAsync",
        value: function addTableAsync(edm) {
            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var table = command.options;
            var builder = new _TableStatementBuilder2.default(table, {
                edm: edm,
                schema: this.schema
            });
            var query = builder.createTableStatement();

            return this.connectionPool.request().query(query);
        }
    }, {
        key: "removeColumnAsync",
        value: function removeColumnAsync(edm) {
            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "removeDecoratorAsync",
        value: function removeDecoratorAsync(edm) {
            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "removeOneToOneRelationshipCommand",
        value: function removeOneToOneRelationshipCommand(edm) {
            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "removeOneToManyRelationshipCommand",
        value: function removeOneToManyRelationshipCommand(edm) {
            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "removeTableAsync",
        value: function removeTableAsync(edm) {
            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "updateColumnAsync",
        value: function updateColumnAsync(edm) {
            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "updateDecoratorAsync",
        value: function updateDecoratorAsync(edm) {
            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "updateTableAsync",
        value: function updateTableAsync(edm) {
            var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }]);

    return Migrator;
}();

exports.default = Migrator;
//# sourceMappingURL=Migrator.js.map