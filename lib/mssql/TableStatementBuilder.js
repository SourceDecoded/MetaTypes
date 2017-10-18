"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataTypeMapping = require("./dataTypeMapping");

var _dataTypeMapping2 = _interopRequireDefault(_dataTypeMapping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultRelationships = {
    oneToOne: [],
    oneToMany: []
};

var TableStatementBuilder = function () {
    function TableStatementBuilder() {
        _classCallCheck(this, TableStatementBuilder);

        this.dataTypeMapping = _dataTypeMapping2.default;
    }

    _createClass(TableStatementBuilder, [{
        key: "_escapeName",
        value: function _escapeName(name) {
            return "[" + name + "]";
        }
    }, {
        key: "createDropTableStatment",
        value: function createDropTableStatment(schema, table) {
            return "IF OBJECT_ID('" + schema + "." + table.name + "', 'U') IS NOT NULL DROP TABLE " + schema + "." + table.name + ";";
        }
    }, {
        key: "createInsertStatement",
        value: function createInsertStatement(schema, table, entity) {
            var _this = this;

            if (table == null) {
                throw new Error("null Argument Exception: schema cannot be null or undefined.");
            }

            if (table == null) {
                throw new Error("Null Argument Exception: table cannot be null or undefined.");
            }

            if (entity == null) {
                throw new Error("Null Argument Exception: entity cannot be null or undefined.");
            }

            var sqliteEntity = {};
            var columns = [];
            var values = [];

            this.filterRelevantColumns(table.columns).forEach(function (column) {
                var columnName = column.name;
                var defaultValue = _this.getDefaultValue(column);

                if (typeof entity[columnName] !== "undefined" && entity[columnName] !== null) {
                    columns.push(_this._escapeName(columnName));

                    if (entity[columnName] === null) {
                        values.push(_this.toMssqlValue(defaultValue));
                    } else {
                        values.push(_this.toMssqlValue(entity[columnName]));
                    }
                }
            });

            var columnsStatement = columns.join(", ");
            var valuesStatement = new Array(values.length).fill("?").join(", ");

            if (values.length === 0) {
                return {
                    statement: "INSERT INTO " + this._escapeName(schema + "." + table.name) + " () VALUES (); SELECT SCOPE_IDENTITY() AS id;",
                    values: values
                };
            }

            return {
                statement: "INSERT INTO " + this._escapeName(schema + "." + table.name) + " (" + columnsStatement + ") VALUES (" + valuesStatement + "); SELECT SCOPE_IDENTITY() AS id",
                values: values
            };
        }
    }, {
        key: "createUpdateStatement",
        value: function createUpdateStatement(schema, table, entity, delta) {
            var _this2 = this;

            var values = [];
            var primaryKeyExpr = [];
            var primaryKeyValues = [];
            var columnSet = [];
            var columns = table.columns;

            if (schema == null) {
                throw new Error("Null Argument Exception: schema cannot be null or undefined.");
            }

            if (table == null) {
                throw new Error("Null Argument Exception: table cannot be null or undefined.");
            }

            if (entity == null) {
                throw new Error("Null Argument Exception: entity cannot be null or undefined.");
            }

            if (delta == null) {
                throw new Error("Null Argument Exception: delta cannot be null or undefined.");
            }

            if (Object.keys(delta).length === 0) {
                throw new Error("Invalid Argument: delta cannot an empty object.");
            }

            this.filterRelevantColumns(columns).forEach(function (column) {
                var columnName = column.name;

                if (typeof delta[columnName] !== "undefined" && _this2.dataTypeMapping[column.type] != null) {
                    columnSet.push(_this2._escapeName(columnName) + " = ?");
                    values.push(_this2.toSqliteValue(delta[columnName]));
                }
            });

            this.getPrimaryKeys(columns).forEach(function (key) {
                primaryKeyExpr.push(_this2._escapeName(key) + " = ?");
                primaryKeyValues.push(entity[key]);
            });

            values = values.concat(primaryKeyValues);

            return {
                statement: "UPDATE " + this._escapeName(schema + "." + table.name) + " SET " + columnSet.join(", ") + " WHERE " + primaryKeyExpr.join(" AND "),
                values: values
            };
        }
    }, {
        key: "createDeleteStatement",
        value: function createDeleteStatement(schema, table, entity) {
            var _this3 = this;

            if (schema == null) {
                throw new Error("Null Argument Exception: schema cannot be null or undefined.");
            }

            if (table == null) {
                throw new Error("Null Argument Exception: table cannot be null or undefined.");
            }

            if (entity == null) {
                throw new Error("Null Argument Exception: entity cannot be null or undefined.");
            }

            var primaryKeysExpr = [];
            var values = [];
            var primaryKeys = this.getPrimaryKeys(table.columns);

            primaryKeys.forEach(function (primaryKey) {

                if (entity[primaryKey] === null) {
                    primaryKeysExpr.push(_this3._escapeName(primaryKey) + " IS NULL");
                } else {
                    primaryKeysExpr.push(_this3._escapeName(primaryKey) + " = ?");
                    values.push(_this3.toSqliteValue(entity[primaryKey]));
                }
            });

            return {
                statement: "DELETE FROM " + this._escapeName(schema + "." + table.name) + " WHERE " + primaryKeysExpr.join(" AND "),
                values: values
            };
        }
    }, {
        key: "createColumnDefinitionStatement",
        value: function createColumnDefinitionStatement(table, column) {
            var sqliteDataType = this.dataTypeMapping[column.type];
            var primaryKeyStatment = "";
            var primaryKeys = this.getPrimaryKeys(table.columns);

            if (sqliteDataType != null) {
                var primaryKey = "";

                if (column.isPrimaryKey) {

                    if (primaryKeys.length === 1) {
                        primaryKey = " PRIMARY KEY";
                    }

                    if (column.isAutoIncrement) {
                        primaryKey += " AUTOINCREMENT";
                    }
                }

                return this._escapeName(column.name) + " " + (this.dataTypeMapping[column.type] + primaryKey);
            } else {
                return null;
            }
        }
    }, {
        key: "createColumnsDefinitionStatement",
        value: function createColumnsDefinitionStatement(table) {
            var _this4 = this;

            var columns = table.columns;
            var columnsDefinition = columns.map(function (column) {
                return _this4.createColumnDefinitionStatement(table, column);
            }).filter(function (value) {
                return value != null;
            }).join(", ");

            return columnsDefinition;
        }
    }, {
        key: "createIndexStatement",
        value: function createIndexStatement(schema, table, column) {
            return "IF NOT EXISTS (SELECT * FROM sys.index WHERE object_id = OBJECT_ID(N'" + this._escapeName(schema + "." + table) + "') AND name = N'index_" + column.replace(/\"/g, "") + "'\n                  CREATE INDEX index_" + column.replace(/\"/g, "") + " ON " + this._escapeName(schema + "." + table) + " (" + this._escapeName(column) + ")";
        }

        // TODO: Update for mssql

    }, {
        key: "createTableIndexesStatements",
        value: function createTableIndexesStatements(schema, table, relationships) {
            var _this5 = this;

            if (relationships == null) {
                throw new Error("Null Argument Exception: relationships cannot be null or undefined.");
            }

            var indexedColumns = {};

            var foreignKeyIndexes = this.getTablesRelationshipsAsTargets(table, relationships).forEach(function (relationship) {
                indexedColumns[relationship.withForeignKey] = true;
            });

            var primaryKeys = this.getPrimaryKeys(table.columns);

            this.getTablesRelationshipsAsSources(table, relationships).filter(function (relationship) {
                return primaryKeys.indexOf(relationship.hasKey) === -1;
            }).forEach(function (relationship) {
                return indexedColumns[relationship.hasKey] = true;
            });

            primaryKeys.forEach(function (name) {
                indexedColumns[name] = true;
            });

            table.columns.filter(function (column) {
                return column.isIndexed;
            }).map(function (column) {
                return indexedColumns[column.name];
            });

            return Object.keys(indexedColumns).map(function (columnName) {
                return _this5.createIndexStatement(schema, table.name, columnName);
            });
        }
    }, {
        key: "createForeignKeysStatement",
        value: function createForeignKeysStatement(schema, table, relationships) {
            var _this6 = this;

            var tableRelationships = this.getTablesRelationshipsAsTargets(table, relationships);

            return tableRelationships.map(function (relationship) {
                return _this6.createForeignKeyStatement(relationship);
            }).join("/n/t");
        }
    }, {
        key: "createForeignKeyStatement",
        value: function createForeignKeyStatement(schema, relationship) {
            return "CONSTRAINT (" + this._escapeName(schema + "." + relationship.withForeignKey) + ") REFERENCES " + this._escapeName(schema + "." + relationship.type) + " (" + this._escapeName(relationship.hasKey) + ")";
        }
    }, {
        key: "createPrimaryKeyStatement",
        value: function createPrimaryKeyStatement(table) {
            var _this7 = this;

            var primaryKeys = this.getPrimaryKeys(table.columns).map(function (primaryKey) {
                return _this7._escapeName(primaryKey);
            });

            if (primaryKeys.length === 0) {
                return "";
            } else {
                return "PRIMARY KEY (" + primaryKeys.join(", ") + ")";
            }
        }

        // TODO: Update for mssql

    }, {
        key: "createTableStatement",
        value: function createTableStatement(schema, table, relationships) {
            relationships = Object.assign({}, defaultRelationships, relationships);

            var columnDefinitionsStatement = this.createColumnsDefinitionStatement(table);
            var foreignKeysStatement = this.createForeignKeysStatement(schema, table, relationships);

            if (columnDefinitionsStatement && foreignKeysStatement) {
                return "CREATE TABLE IF NOT EXISTS " + this._escapeName(schema + "." + table) + " (" + columnDefinitionsStatement + ", " + foreignKeysStatement + ")";
            } else if (columnDefinitionsStatement) {
                return "CREATE TABLE IF NOT EXISTS " + this._escapeName(schema + "." + table) + " (" + columnDefinitionsStatement + ")";
            } else {
                return "CREATE TABLE IF NOT EXISTS " + this._escapeName(schema + "." + table);
            }
        }
    }, {
        key: "filterRelevantColumns",
        value: function filterRelevantColumns(columns) {
            var _this8 = this;

            return columns.filter(function (column) {
                return _this8.dataTypeMapping[column.type] != null;
            });
        }
    }, {
        key: "getTablesRelationshipsAsTargets",
        value: function getTablesRelationshipsAsTargets(table, relationships) {
            var foreignKeyNames = {};

            var filter = function filter(relationship) {
                var foreignKey = relationship.withForeignKey;

                if (relationship.ofType === table.name && foreignKeyNames[foreignKey] == null) {
                    foreignKeyNames[foreignKey];
                    return true;
                }
                return false;
            };

            var oneToOne = relationships.oneToOne.filter(filter);
            var oneToMany = relationships.oneToMany.filter(filter);

            return oneToOne.concat(oneToMany);
        }
    }, {
        key: "getTablesRelationshipsAsSources",
        value: function getTablesRelationshipsAsSources(table, relationships) {
            var keyNames = {};

            var filter = function filter(relationship) {
                var key = relationship.hasKey;

                if (relationship.type === table.name && keyNames[key] == null) {
                    keyNames[key];
                    return true;
                }
                return false;
            };

            var oneToOne = relationships.oneToOne.filter(filter);
            var oneToMany = relationships.oneToMany.filter(filter);

            return oneToOne.concat(oneToMany);
        }
    }, {
        key: "getColumn",
        value: function getColumn(table, name) {
            return table.columns.find(function (column) {
                return column.name === name;
            });
        }
    }, {
        key: "getDefaultValue",
        value: function getDefaultValue(column) {
            return column["default" + column.type + "Value"] || null;
        }
    }, {
        key: "getPrimaryKeys",
        value: function getPrimaryKeys(columns) {
            return columns.filter(function (column) {
                return column.isPrimaryKey;
            }).map(function (column) {
                return column.name;
            });
        }

        // TODO: update for MSSQL

    }, {
        key: "toMssqlValue",
        value: function toMssqlValue(value) {
            if (typeof value === "string") {
                return value;
            } else if (typeof value === "number") {
                return value;
            } else if (typeof value === "boolean") {
                return value ? 1 : 0;
            } else if (value instanceof Date) {
                return value.getTime();
            } else if (value == null) {
                return null;
            } else {
                throw new Error("Unknown value.");
            }
        }
    }]);

    return TableStatementBuilder;
}();

exports.default = TableStatementBuilder;
//# sourceMappingURL=TableStatementBuilder.js.map