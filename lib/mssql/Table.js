"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TableStatementBuilder = require("./TableStatementBuilder");

var _TableStatementBuilder2 = _interopRequireDefault(_TableStatementBuilder);

var _queryablejs = require("queryablejs");

var _Provider = require("./Provider");

var _Provider2 = _interopRequireDefault(_Provider);

var _mssql = require("mssql");

var _mssql2 = _interopRequireDefault(_mssql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Table = function () {
    function Table(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Table);

        this.connectionPool = options.connectionPool;
        this.edm = options.edm;
        this.name = name;
        this.schema = options.schema;

        if (this.name == null) {
            throw new Error("The table needs to have a name.");
        }

        if (this.connectionPool == null) {
            throw new Error("The table needs to have a connectionPool.");
        }

        if (this.edm == null) {
            throw new Error("The table needs to have a edm.");
        }

        this.table = this._getTable(name);

        if (this.table == null) {
            throw new Error("Cannot find table called '" + name + "' within " + this.edm.name + ".");
        }

        this.tableStatementBuilder = new _TableStatementBuilder2.default(this.table, options);
        this.provider = new _Provider2.default(name, {
            edm: this.edm,
            connectionPool: this.connectionPool,
            schema: this.schema
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

            var sql = this.tableStatementBuilder.createInsertStatement(entity);
            var request = this.connectionPool.request();

            sql.values.forEach(function (value, index) {
                request.input("v" + index, _this._getMsSqlType(value), value);
            });

            return request.query(sql.statement).then(function (result) {
                var updatedEntity = _this._clone(entity);
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
            var tableStatement = this.tableStatementBuilder.createTableStatement(this.edm.relationships);
            var indexesStatements = this.tableStatementBuilder.createTableIndexesStatements(this.edm.relationships);

            indexesStatements.unshift(tableStatement);
            var fullStatement = indexesStatements.join(";");
            return this.connectionPool.request().query(fullStatement);
        }
    }, {
        key: "dropAsync",
        value: function dropAsync() {
            var statement = this.tableStatementBuilder.createDropTableStatement();

            return this.connectionPool.request().query(statement);
        }
    }, {
        key: "getQueryProvider",
        value: function getQueryProvider() {
            return this.provider;
        }
    }, {
        key: "removeEntityAsync",
        value: function removeEntityAsync(entity) {
            var _this2 = this;

            var sql = this.tableStatementBuilder.createDeleteStatement(entity);

            var request = this.connectionPool.request();

            sql.keys.forEach(function (key, index) {
                request.input("k" + index, _this2._getMsSqlType(key), key);
            });

            return request.query(sql.statement).then(function () {
                return entity;
            });
        }
    }, {
        key: "updateEntityAsync",
        value: function updateEntityAsync(user, entity, delta) {
            var _this3 = this;

            var sql = this.tableStatementBuilder.createUpdateStatement(entity, delta);

            var request = this.connectionPool.request();

            sql.values.forEach(function (value, index) {
                request.input("v" + index, _this3._getMsSqlType(value), value);
            });

            sql.keys.forEach(function (key, index) {
                request.input("k" + index, _this3._getMsSqlType(key), key);
            });

            return request.query(sql.statement).then(function (statement) {
                return Object.assign({}, entity, delta);
            });
        }
    }, {
        key: "_getMsSqlType",
        value: function _getMsSqlType(value) {
            var type = typeof value === "undefined" ? "undefined" : _typeof(value);
            if (type === "string") {
                return _mssql2.default.NVarChar;
            } else if (type === "number") {
                if (value % 1 === 0) {
                    return _mssql2.default.Int;
                } else {
                    return _mssql2.default.Float;
                }
            } else if (type === "boolean") {
                return _mssql2.default.Bit;
            } else if (value instanceof Date) {
                return _mssql2.default.DateTime;
            } else if (value == null) {
                return _mssql2.default.NVarChar;
            } else {
                throw new Error("Unknown value.");
            }
        }
    }]);

    return Table;
}();

exports.default = Table;
//# sourceMappingURL=Table.js.map