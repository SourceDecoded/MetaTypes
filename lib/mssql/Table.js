"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TableStatementBuilder = require("./TableStatementBuilder");

var _TableStatementBuilder2 = _interopRequireDefault(_TableStatementBuilder);

var _queryablejs = require("queryablejs");

var _Provider = require("./Provider");

var _Provider2 = _interopRequireDefault(_Provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Table = function () {
    function Table(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Table);

        this.mssqlDatabase = options.mssqlDatabase;
        this.edm = options.edm;
        this.name = name;
        this.schema = options.schema;

        if (this.name == null) {
            throw new Error("The table needs to have a name.");
        }

        if (this.mssqlDatabase == null) {
            throw new Error("The table needs to have a mssqlDatabase database.");
        }

        if (this.edm == null) {
            throw new Error("The table needs to have a edm.");
        }

        this.table = this._getTable(name);

        if (this.table == null) {
            throw new Error("Cannot find table called '" + name + "' within " + this.edm.name + ".");
        }

        this.tableStatementBuilder = new _TableStatementBuilder2.default(name, options);
        this.provider = new _Provider2.default(name, {
            edm: this.edm,
            mssqlDatabase: this.mssqlDatabase
        });
    }

    _createClass(Table, [{
        key: "_clone",
        value: function _clone(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }, {
        key: "_getPrimaryKeyName",
        value: function _getPrimaryKeyName() {
            var column = this.table.columns.find(function (column) {
                return column.isPrimaryKey;
            });

            return column && column.name || null;
        }
    }, {
        key: "_getTable",
        value: function _getTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "addEntityAsync",
        value: function addEntityAsync(entity) {
            var _this = this;

            var sql = this.tableStatementBuilder.createInsertStatement(this.schema, this.table, entity);

            return this.mssqlDatabase.query(sql.statement, sql.values).then(function (result) {
                var updatedEntity = _this._clone(entity);

                // TODO: might need to be recordsets[1][0].id;
                // This uses the SQL Server specific way to get an inserted id.
                updatedEntity[_this._getPrimaryKeyName()] = result.recordset[0].id;
                return updatedEntity;
            });
        }
    }, {
        key: "asQueryable",
        value: function asQueryable() {
            var queryable = new _queryablejs.Queryable(this.name);
            queryable.provider = this.provider;

            return queryable;
        }
    }, {
        key: "createAsync",
        value: function createAsync() {
            var tableStatement = this.tableStatementBuilder.createTableStatement(this.schema, this.table, this.edm.relationships);
            var indexesStatements = this.tableStatementBuilder.createTableIndexesStatements(this.schema, this.table, this.edm.relationships);

            indexesStatements.unshift(tableStatement);

            return this.mssqlDatabase.query(indexesStatements.join(";"));
        }
    }, {
        key: "dropAsync",
        value: function dropAsync() {
            var statement = this.tableStatementBuilder.createDropTableStatement(this.schema, this.table.name);

            return this.mssqlDatabase.query(statement);
        }
    }, {
        key: "getQueryProvider",
        value: function getQueryProvider() {
            return this.provider;
        }
    }, {
        key: "removeEntityAsync",
        value: function removeEntityAsync(entity) {
            var sql = this.tableStatementBuilder.createDeleteStatement(this.schema, this.table, entity);

            return this.mssqlDatabase.query(sql.statement, sql.values).then(function () {
                return entity;
            });
        }
    }, {
        key: "updateEntityAsync",
        value: function updateEntityAsync(entity, delta) {
            var sql = this.tableStatementBuilder.createUpdateStatement(this.schema, this.table, entity, delta);

            return this.mssqlDatabase.query(sql.statement, sql.values).then(function (statement) {
                return Object.assign({}, entity, delta);
            });
        }
    }]);

    return Table;
}();

exports.default = Table;
//# sourceMappingURL=Table.js.map