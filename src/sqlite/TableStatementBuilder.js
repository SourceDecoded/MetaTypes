import dataTypeMapping from "./dataTypeMapping";

const defaultRelationships = {
    oneToOne: [],
    oneToMany: []
}

export default class TableStatementBuilder {
    constructor() {
        this.dataTypeMapping = dataTypeMapping;
    }

    _createColumnDefinition(tableName, column) {
        const sqliteDataType = this.dataTypeMapping[column.type];

        if (sqliteDataType != null) {
            let primaryKey = "";
            
            if (column.isPrimaryKey) {
                primaryKey = " PRIMARY KEY";

                if (column.isAutoIncrement) {
                    primaryKey += " AUTOINCREMENT";
                }

            }

            return `${this._escapeName(column.name)} ${this.dataTypeMapping[column.type] + primaryKey}`

        } else {
            throw new Error("Could not make a column definition.");
        }
    }

    _escapeName(name) {
        return `"${name.replace(/\"/g, '""')}"`;
    }

    createAddColumnStatement(tableName, column) {
        let columnDefinition = this._createColumnDefinition(tableName, column);
        return `ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`;
    }

    createDropTableStatment(table) {
        return `DROP TABLE IF EXISTS ${this._escapeName(table.name)}`;
    }

    createInsertStatement(table, entity) {
        if (table == null) {
            throw new Error("Null Argument Exception: table cannot be null or undefined.");
        }

        if (entity == null) {
            throw new Error("Null Argument Exception: entity cannot be null or undefined.");
        }

        const sqliteEntity = {};
        const columns = [];
        const values = [];

        this.filterRelevantColumns(table.columns).forEach((column) => {
            var columnName = column.name;
            var defaultValue = this.getDefaultValue(column);

            if (typeof entity[columnName] !== "undefined" && entity[columnName] !== null) {
                columns.push(this._escapeName(columnName));

                if (entity[columnName] === null) {
                    values.push(this.toSqliteValue(defaultValue));
                } else {
                    values.push(this.toSqliteValue(entity[columnName]));
                }
            }
        });

        const columnsStatement = columns.join(", ");
        const valuesStatement = new Array(values.length).fill("?").join(", ");

        if (values.length === 0) {
            return {
                statement: `INSERT INTO ${this._escapeName(table.name)} DEFAULT VALUES`,
                values: values
            };
        }

        return {
            statement: `INSERT INTO ${this._escapeName(table.name)} (${columnsStatement}) VALUES (${valuesStatement})`,
            values: values
        };

    }

    createUpdateColumnTransaction(table, previousColumn, newColumn) {

    }

    createUpdateStatement(table, entity, delta) {
        let values = [];
        const primaryKeyExpr = [];
        const primaryKeyValues = [];
        const columnSet = [];
        const columns = table.columns;

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

        this.filterRelevantColumns(columns).forEach((column) => {
            var columnName = column.name;

            if (typeof delta[columnName] !== "undefined" && this.dataTypeMapping[column.type] != null) {
                columnSet.push(this._escapeName(columnName) + " = ?");
                values.push(this.toSqliteValue(delta[columnName]));
            }
        });

        this.getPrimaryKeys(columns).forEach((key) => {
            primaryKeyExpr.push(this._escapeName(key) + " = ?");
            primaryKeyValues.push(entity[key]);
        });

        values = values.concat(primaryKeyValues);

        return {
            statement: `UPDATE ${this._escapeName(table.name)} SET ${columnSet.join(", ")} WHERE ${primaryKeyExpr.join(" AND ")}`,
            values: values
        };
    }

    createDeleteStatement(table, entity) {
        if (table == null) {
            throw new Error("Null Argument Exception: table cannot be null or undefined.");
        }

        if (entity == null) {
            throw new Error("Null Argument Exception: entity cannot be null or undefined.");
        }

        const primaryKeysExpr = [];
        const values = [];
        const primaryKeys = this.getPrimaryKeys(table.columns);

        primaryKeys.forEach((primaryKey) => {

            if (entity[primaryKey] === null) {
                primaryKeysExpr.push(this._escapeName(primaryKey) + " IS NULL");
            } else {
                primaryKeysExpr.push(this._escapeName(primaryKey) + " = ?");
                values.push(this.toSqliteValue(entity[primaryKey]));
            }

        });

        return {
            statement: `DELETE FROM ${this._escapeName(table.name)} WHERE ${primaryKeysExpr.join(" AND ")}`,
            values: values
        };
    }

    createColumnDefinitionStatement(tableName, column) {
        return this._createColumnDefinition(tableName, column);
    }

    createColumnsDefinitionStatement(table) {
        const columns = table.columns;
        const columnDefinitions = columns.map((column) => {
            return this.createColumnDefinitionStatement(table.name, column);
        }).filter((value) => {
            return value != null;
        });

        return columnDefinitions.join(", ");
    }

    createIndexStatement(table, column) {
        return `CREATE INDEX IF NOT EXISTS ${this._escapeName(column)} ON ${this._escapeName(table)} (${this._escapeName(column)})`;
    }

    createTableIndexesStatements(table, relationships) {
        if (relationships == null) {
            throw new Error("Null Argument Exception: relationships cannot be null or undefined.");
        }

        const indexedColumns = {};

        const foreignKeyIndexes = this.getTablesRelationshipsAsTargets(table, relationships).forEach((relationship) => {
            indexedColumns[relationship.withForeignKey] = true;
        });

        const primaryKeys = this.getPrimaryKeys(table.columns);

        this.getTablesRelationshipsAsSources(table, relationships).filter((relationship) => {
            return primaryKeys.indexOf(relationship.hasKey) === -1;
        }).forEach((relationship) => {
            return indexedColumns[relationship.hasKey] = true;
        });

        primaryKeys.forEach((name) => {
            indexedColumns[name] = true;
        });

        table.columns.filter((column) => {
            return column.isIndexed;
        }).map((column) => {
            return indexedColumns[column.name]
        });

        return Object.keys(indexedColumns).map((columnName) => {
            return this.createIndexStatement(table.name, columnName);
        });

    }

    createForeignKeysStatement(table, relationships) {
        const tableName = table.name;
        const tableRelationships = this.getTablesRelationshipsAsTargets(table, relationships);

        return tableRelationships.map((relationship) => {
            return this.createForeignKeyStatement(relationship);
        }).join("/n/t");
    }

    createForeignKeyStatement(relationship) {
        return `FOREIGN KEY (${this._escapeName(relationship.withForeignKey)}) REFERENCES ${this._escapeName(relationship.type)} (${this._escapeName(relationship.hasKey)})`;
    }

    createPrimaryKeyStatement(table) {
        const primaryKeys = this.getPrimaryKeys(table.columns).map((primaryKey) => {
            return this._escapeName(primaryKey);
        });

        if (primaryKeys.length === 0) {
            return "";
        } else {
            return `PRIMARY KEY (${primaryKeys.join(", ")})`;
        }
    }

    createTableStatement(table, relationships) {
        relationships = Object.assign({}, defaultRelationships, relationships);

        const columnDefinitionsStatement = this.createColumnsDefinitionStatement(table);

        if (columnDefinitionsStatement) {
            return `CREATE TABLE IF NOT EXISTS ${this._escapeName(table.name)} (${columnDefinitionsStatement})`;
        } else {
            return `CREATE TABLE IF NOT EXISTS ${this._escapeName(table.name)}`;
        }

    }

    filterRelevantColumns(columns) {
        return columns.filter((column) => {
            return this.dataTypeMapping[column.type] != null;
        });
    }

    getTablesRelationshipsAsTargets(table, relationships) {
        const foreignKeyNames = {};

        const filter = (relationship) => {
            const foreignKey = relationship.withForeignKey;

            if (relationship.ofType === table.name && foreignKeyNames[foreignKey] == null) {
                foreignKeyNames[foreignKey];
                return true;
            }
            return false;
        }

        const oneToOne = relationships.oneToOne.filter(filter);
        const oneToMany = relationships.oneToMany.filter(filter);

        return oneToOne.concat(oneToMany);
    }

    getTablesRelationshipsAsSources(table, relationships) {
        const keyNames = {};

        const filter = (relationship) => {
            const key = relationship.hasKey;

            if (relationship.type === table.name && keyNames[key] == null) {
                keyNames[key];
                return true;
            }
            return false;
        }

        const oneToOne = relationships.oneToOne.filter(filter);
        const oneToMany = relationships.oneToMany.filter(filter);

        return oneToOne.concat(oneToMany);
    }

    getColumn(table, name) {
        return table.columns.find((column) => {
            return column.name === name;
        });
    }

    getDefaultValue(column) {
        return column[`default${column.type}Value`] || null;
    }

    getPrimaryKeys(columns) {
        return columns.filter((column) => {
            return column.isPrimaryKey;
        }).map((column) => {
            return column.name;
        });
    }

    toSqliteValue(value) {
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
}