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
            return "\"" + name.replace(/\"/g, '"') + "\"";
        }
    }, {
        key: "createDropTableStatment",
        value: function createDropTableStatment(table) {
            return "DROP TABLE IF EXISTS " + this._escapeName(table.name);
        }
    }, {
        key: "createInsertStatement",
        value: function createInsertStatement(table, entity) {
            var _this = this;

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
                        values.push(_this.toSqliteValue(defaultValue));
                    } else {
                        values.push(_this.toSqliteValue(entity[columnName]));
                    }
                }
            });

            var columnsStatement = columns.join(", ");
            var valuesStatement = new Array(values.length).fill("?").join(", ");

            if (values.length === 0) {
                return {
                    statement: "INSERT INTO " + this._escapeName(table.name) + " DEFAULT VALUES",
                    values: values
                };
            }

            return {
                statement: "INSERT INTO " + this._escapeName(table.name) + " (" + columnsStatement + ") VALUES (" + valuesStatement + ")",
                values: values
            };
        }
    }, {
        key: "createUpdateStatement",
        value: function createUpdateStatement(table, entity, delta) {
            var _this2 = this;

            var values = [];
            var primaryKeyExpr = [];
            var primaryKeyValues = [];
            var columnSet = [];
            var columns = table.columns;

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
                statement: "UPDATE " + this._escapeName(table.name) + " SET " + columnSet.join(", ") + " WHERE " + primaryKeyExpr.join(" AND "),
                values: values
            };
        }
    }, {
        key: "createDeleteStatement",
        value: function createDeleteStatement(table, entity) {
            var _this3 = this;

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
                statement: "DELETE FROM " + this._escapeName(table.name) + " WHERE " + primaryKeysExpr.join(" AND "),
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
        value: function createIndexStatement(table, column) {
            return "CREATE INDEX IF NOT EXISTS " + this._escapeName(column) + " ON " + this._escapeName(table) + " (" + this._escapeName(column) + ")";
        }
    }, {
        key: "createTableIndexesStatements",
        value: function createTableIndexesStatements(table, relationships) {
            var _this5 = this;

            var foreignKeyIndexes = this.getTablesRelationshipsAsTargets(table, relationships).map(function (relationship) {
                return _this5.createIndexStatement(relationship.ofType, relationship.withForeignKey);
            });

            var primaryKeys = this.getPrimaryKeys(table.columns);

            var keyIndexes = this.getTablesRelationshipsAsSources(table, relationships).filter(function (relationship) {
                return primaryKeys.indexOf(relationship.hasKey) === -1;
            }).map(function (relationship) {
                return _this5.createIndexStatement(relationship.type, relationship.hasKey);
            });

            var primaryKeysIndexes = primaryKeys.map(function (name) {
                return _this5.createIndexStatement(table.name, name);
            });

            return primaryKeysIndexes.concat(foreignKeyIndexes);
        }
    }, {
        key: "createForeignKeysStatement",
        value: function createForeignKeysStatement(table, relationships) {
            var _this6 = this;

            var tableName = table.name;
            var tableRelationships = this.getTablesRelationshipsAsTargets(table, relationships);

            return tableRelationships.map(function (relationship) {
                return _this6.createForeignKeyStatement(relationship);
            }).join("/n/t");
        }
    }, {
        key: "createForeignKeyStatement",
        value: function createForeignKeyStatement(relationship) {
            return "FOREIGN KEY (" + this._escapeName(relationship.withForeignKey) + ") REFERENCES " + this._escapeName(relationship.type) + " (" + this._escapeName(relationship.hasKey) + ")";
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
    }, {
        key: "createTableStatement",
        value: function createTableStatement(table, relationships) {
            relationships = Object.assign({}, defaultRelationships, relationships);

            var columnDefinitionsStatement = this.createColumnsDefinitionStatement(table);
            var foreignKeysStatement = this.createForeignKeysStatement(table, relationships);

            if (columnDefinitionsStatement && foreignKeysStatement) {
                return "CREATE TABLE IF NOT EXISTS " + this._escapeName(table.name) + " (" + columnDefinitionsStatement + ", " + foreignKeysStatement + ")";
            } else if (columnDefinitionsStatement) {
                return "CREATE TABLE IF NOT EXISTS " + this._escapeName(table.name) + " (" + columnDefinitionsStatement + ")";
            } else {
                return "CREATE TABLE IF NOT EXISTS " + this._escapeName(table.name);
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
    }, {
        key: "toSqliteValue",
        value: function toSqliteValue(value) {
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