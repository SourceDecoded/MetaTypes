"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TableStatementBuilder = require("./TableStatementBuilder");

var _TableStatementBuilder2 = _interopRequireDefault(_TableStatementBuilder);

var _Queryable = require("./../query/Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

var _Provider = require("./Provider");

var _Provider2 = _interopRequireDefault(_Provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Table = function () {
    function Table(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Table);

        this.sqlite = options.sqlite;
        this.edm = options.edm;
        this.name = name;

        if (this.name == null) {
            throw new Error("The table needs to have a name.");
        }

        if (this.sqlite == null) {
            throw new Error("The table needs to have a sqlite database.");
        }

        if (this.edm == null) {
            throw new Error("The table needs to have a edm.");
        }

        this.table = this._getTable(name);

        if (this.table == null) {
            throw new Error("Cannot find table called '" + name + "' with-in " + this.edm.name + ".");
        }

        this.tableStatementBuilder = new _TableStatementBuilder2.default(name, options);
        this.provider = new _Provider2.default(name, {
            edm: this.edm,
            sqlite: this.sqlite
        });
    }

    _createClass(Table, [{
        key: "_getTable",
        value: function _getTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "addEntityAsync",
        value: function addEntityAsync(entity) {
            var sql = this.tableStatementBuilder.createInsertStatement(this.table, entity);

            return this.sqlite.run(sql.statement, sql.values);
        }
    }, {
        key: "createAsync",
        value: function createAsync() {
            var tableStatement = this.tableStatementBuilder.createTableStatement(this.table, this.edm.relationships);
            var indexesStatements = this.tableStatementBuilder.createTableIndexesStatements(this.table, this.edm.relationships);

            indexesStatements.unshift(tableStatement);

            return this.sqlite.exec(indexesStatements.join(";"));
        }
    }, {
        key: "dropAsync",
        value: function dropAsync() {
            var statement = this.tableStatementBuilder.createDropTableStatement(this.table.name);

            return this.sqlite.run(statement);
        }
    }, {
        key: "removeEntityAsync",
        value: function removeEntityAsync(entity) {
            var sql = this.tableStatementBuilder.createDeleteStatement(this.table.name, entity);

            return this.sqlite.run(sql.statement, sql.values);
        }
    }, {
        key: "updateEntityAsync",
        value: function updateEntityAsync(entity, delta) {
            var sql = this.tableStatementBuilder.createUpdateStatement(this.table.name, entity, delta);

            return this.sqlite.run(sql.statement, sql.values);
        }
    }, {
        key: "asQueryable",
        value: function asQueryable() {
            var queryable = new _Queryable2.default(this.name);
            queryable.provider = provider;

            return queryable;
        }
    }, {
        key: "getQueryProvider",
        value: function getQueryProvider() {
            return this.provider;
        }
    }]);

    return Table;
}();

exports.default = Table;
//# sourceMappingURL=Table.js.map