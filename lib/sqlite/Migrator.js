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
    function Migrator(sqliteDatabase) {
        _classCallCheck(this, Migrator);

        if (sqliteDatabase == null) {
            throw new Error("Null Argument Exception: sqliteDatabase cannot be null or undefined.");
        }

        this.sqliteDatabase = sqliteDatabase;
        this.tableStatementBuilder = new _TableStatementBuilder2.default();
    }

    _createClass(Migrator, [{
        key: "addColumnAsync",
        value: function addColumnAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var statement = this.tableStatementBuilder.createAddColumnStatement(options.tableName, options.column);
            return this.sqliteDatabase.run(statement);
        }
    }, {
        key: "addDecoratorAsync",
        value: function addDecoratorAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "addOneToOneRelationshipAsync",
        value: function addOneToOneRelationshipAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "addOneToManyRelationshipAsync",
        value: function addOneToManyRelationshipAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "addTableAsync",
        value: function addTableAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var statement = this.tableStatementBuilder.createTableStatement(options);
            return this.sqliteDatabase.run(statement);
        }
    }, {
        key: "removeColumnAsync",
        value: function removeColumnAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "removeDecoratorAsync",
        value: function removeDecoratorAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "removeOneToOneRelationshipCommand",
        value: function removeOneToOneRelationshipCommand(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "removeOneToManyRelationshipCommand",
        value: function removeOneToManyRelationshipCommand(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "removeTableAsync",
        value: function removeTableAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "updateColumnAsync",
        value: function updateColumnAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "updateDecoratorAsync",
        value: function updateDecoratorAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }, {
        key: "updateTableAsync",
        value: function updateTableAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        }
    }]);

    return Migrator;
}();

exports.default = Migrator;
//# sourceMappingURL=Migrator.js.map