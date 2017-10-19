import dataTypeMapping from "./dataTypeMapping";

const defaultRelationships = {
    oneToOne: [],
    oneToMany: []
}

export default class TableStatementBuilder {
    constructor() {
        this.dataTypeMapping = dataTypeMapping;
    }

    _escapeName(name) {
        return `[${name}]`;
    }

    createDropTableStatment(schema, table) {
        return `IF OBJECT_ID('${schema}.${table.name}', 'U') IS NOT NULL DROP TABLE ${schema}.${table.name};`
    }

    createInsertStatement(schema, table, entity) {
        if (table == null) {
            throw new Error("null Argument Exception: schema cannot be null or undefined.");
        }

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
                    values.push(this.toMssqlValue(defaultValue));
                } else {
                    values.push(this.toMssqlValue(entity[columnName]));
                }
            }
        });

        const columnsStatement = columns.join(", ");
        const valuesStatement = new Array(values.length).fill("?").join(", ");

        if (values.length === 0) {
            return {
                statement: `INSERT INTO ${this._escapeName(schema+"."+table.name)} () VALUES (); SELECT SCOPE_IDENTITY() AS id;`,
                values: values
            };
        }

        return {
            statement: `INSERT INTO ${this._escapeName(schema+"."+table.name)} (${columnsStatement}) VALUES (${valuesStatement}); SELECT SCOPE_IDENTITY() AS id`,
            values: values
        };

    }

    createUpdateStatement(schema, table, entity, delta) {
        let values = [];
        const primaryKeyExpr = [];
        const primaryKeyValues = [];
        const columnSet = [];
        const columns = table.columns;

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
            statement: `UPDATE ${this._escapeName(schema+"."+table.name)} SET ${columnSet.join(", ")} WHERE ${primaryKeyExpr.join(" AND ")}`,
            values: values
        };
    }

    createDeleteStatement(schema, table, entity) {
        if (schema == null) {
            throw new Error("Null Argument Exception: schema cannot be null or undefined.");
        }

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
            statement: `DELETE FROM ${this._escapeName(schema+"."+table.name)} WHERE ${primaryKeysExpr.join(" AND ")}`,
            values: values
        };
    }

    createColumnDefinitionStatement(table, column) {
        const sqliteDataType = this.dataTypeMapping[column.type];
        const primaryKeyStatment = "";
        const primaryKeys = this.getPrimaryKeys(table.columns);

        if (sqliteDataType != null) {
            let primaryKey = "";

            if (column.isPrimaryKey) {

                if (primaryKeys.length === 1) {
                    primaryKey = " PRIMARY KEY";
                }

                if (column.isAutoIncrement) {
                    primaryKey += " AUTOINCREMENT";
                }
            }

            return `${this._escapeName(column.name)} ${this.dataTypeMapping[column.type] + primaryKey}`

        } else {
            return null;
        }
    }

    createColumnsDefinitionStatement(table) {
        const columns = table.columns;
        const columnsDefinition = columns.map((column) => {
            return this.createColumnDefinitionStatement(table, column);
        }).filter((value) => {
            return value != null;
        }).join(", ")

        return columnsDefinition;
    }

    createIndexStatement(schema, table, column) {
        return `IF NOT EXISTS (SELECT * FROM sys.index WHERE object_id = OBJECT_ID(N'${this._escapeName(schema+"."+table)}') AND name = N'index_${column.replace(/\"/g, "")}'
                  CREATE INDEX index_${column.replace(/\"/g, "")} ON ${this._escapeName(schema+"."+table)} (${this._escapeName(column)})`;
    }

    // TODO: Update for mssql
    createTableIndexesStatements(schema, table, relationships) {
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
            return this.createIndexStatement(schema, table.name, columnName);
        });

    }

    createForeignKeysStatement(schema, table, relationships) {
        const tableRelationships = this.getTablesRelationshipsAsTargets(table, relationships);

        return tableRelationships.map((relationship) => {
            return this.createForeignKeyStatement(relationship);
        }).join("/n/t");
    }

    createForeignKeyStatement(schema, relationship) {
        return `CONSTRAINT (${this._escapeName(schema+"."+relationship.withForeignKey)}) REFERENCES ${this._escapeName(schema+"."+relationship.type)} (${this._escapeName(relationship.hasKey)})`;
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

    // TODO: Update for mssql
    createTableStatement(schema, table, relationships) {
        relationships = Object.assign({}, defaultRelationships, relationships);

        const columnDefinitionsStatement = this.createColumnsDefinitionStatement(table);
        const foreignKeysStatement = this.createForeignKeysStatement(schema, table, relationships);

        if (columnDefinitionsStatement && foreignKeysStatement) {
            return `CREATE TABLE IF NOT EXISTS ${this._escapeName(schema+"."+table)} (${columnDefinitionsStatement}, ${foreignKeysStatement})`;
        } else if (columnDefinitionsStatement) {
            return `CREATE TABLE IF NOT EXISTS ${this._escapeName(schema+"."+table)} (${columnDefinitionsStatement})`;
        } else {
            return `CREATE TABLE IF NOT EXISTS ${this._escapeName(schema+"."+table)}`;
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

    // TODO: update for MSSQL
    toMssqlValue(value) {
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