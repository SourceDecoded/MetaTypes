import dataTypeMapping from "./dataTypeMapping";

const defaultRelationships = {
    oneToOne: [],
    oneToMany: []
}

export default class TableStatementBuilder {
    constructor(table, options) {
        this.dataTypeMapping = dataTypeMapping;
        this.table = table;
        this.edm = options.edm;
        this.schema = options.schema;
    }

    _escapeName(name) {
        return `[${name}]`;
    }

    _wrapIfTableExists(table, query) {
        return `IF NOT (EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = '${this.schema}' AND TABLE_NAME = '${this._getDbTableName(table.name)}'))
            BEGIN
            ${query}
            END`
    }

    _getDbTableName(table) {
        return `${table}__${this.edm.version.replace(/\./g, "_")}`;
    }

    _getQualifiedDbTableName(table) {
        return `[${this.schema}].[${this._getDbTableName(table)}]`;
    }

    getQualifiedDbTableName() {
        return _getQualifiedDbTableName(table.name);
    }

    createDropTableStatement() {
        return `IF OBJECT_ID('${this.schema}.${this._getDbTableName(this.table.name)}', 'U') IS NOT NULL DROP TABLE ${this._getQualifiedDbTableName(this.table.name)};`
    }

    createInsertStatement(entity) {
        if (entity == null) {
            throw new Error("Null Argument Exception: entity cannot be null or undefined.");
        }

        const values = [];
        const columns = [];

        this.filterRelevantColumns(this.table.columns).forEach((column) => {
            var columnName = column.name;
            var defaultValue = this.getDefaultValue(column);

            if (typeof entity[columnName] !== "undefined" && entity[columnName] !== null) {
                columns.push(this._escapeName(columnName));

                if (entity[columnName] === null) {
                    values.push(defaultValue);
                } else {
                    values.push(entity[columnName]);
                }
            }
        });

        const columnsStatement = columns.join(",");

        const valuesStatement = values.map((value, index) => {
            return "@v"+index;
        });

        if (values.length === 0) {
            return {
                statement: `INSERT INTO ${this._getQualifiedDbTableName(this.table.name)} () VALUES (); SELECT SCOPE_IDENTITY() AS id;`,
                values: values
            };
        }

        return {
            statement: `INSERT INTO ${this._getQualifiedDbTableName(this.table.name)} (${columnsStatement}) VALUES (${valuesStatement}); SELECT SCOPE_IDENTITY() AS id;`,
            values: values
        };

    }

    createUpdateStatement(entity, delta) {
        let values = [];
        const primaryKeyExpr = [];
        const primaryKeyValues = [];
        const columnSet = [];
        const columns = this.table.columns;

        if (entity == null) {
            throw new Error("Null Argument Exception: entity cannot be null or undefined.");
        }

        if (delta == null) {
            throw new Error("Null Argument Exception: delta cannot be null or undefined.");
        }

        if (Object.keys(delta).length === 0) {
            throw new Error("Invalid Argument: delta cannot an empty object.");
        }

        let primaryKeys = this.getPrimaryKeys(columns);

        this.filterRelevantColumns(columns).filter((column) => {
            return primaryKeys.indexOf(column.name) === -1;
        }).forEach((column) => {
            var columnName = column.name;
            if (typeof delta[columnName] !== "undefined") {
                columnSet.push(this._escapeName(columnName) + `=@v${values.length}`);
                values.push(delta[columnName]);
            }
        });

        primaryKeys.forEach((key, index) => {
            primaryKeyExpr.push(this._escapeName(key) + `=@k${index}`);
            primaryKeyValues.push(entity[key]);
        });

        return {
            statement: `UPDATE ${this._getQualifiedDbTableName(this.table.name)} SET ${columnSet.join(", ")} WHERE ${primaryKeyExpr.join(" AND ")}`,
            values: values,
            keys: primaryKeyValues
        };
    }

    createDeleteStatement(entity) {
        if (entity == null) {
            throw new Error("Null Argument Exception: entity cannot be null or undefined.");
        }

        const primaryKeysExpr = [];
        const keys = [];
        const primaryKeys = this.getPrimaryKeys(this.table.columns);

        primaryKeys.forEach((primaryKey, index) => {

            if (entity[primaryKey] === null) {
                primaryKeysExpr.push(this._escapeName(primaryKey) + " IS NULL");
            } else {
                primaryKeysExpr.push(this._escapeName(primaryKey) + `=@k${keys.length}`);
                keys.push(entity[primaryKey]);
            }

        });

        return {
            statement: `DELETE FROM ${this._getQualifiedDbTableName(this.table.name)} WHERE ${primaryKeysExpr.join(" AND ")}`,
            keys: keys
        };
    }

    createColumnDefinitionStatement(column) {
        const sqlDataType = this.dataTypeMapping[column.type];
        const primaryKeyStatment = "";
        const primaryKeys = this.getPrimaryKeys(this.table.columns);

        if (sqlDataType != null) {
            let primaryKey = "";

            if (column.isPrimaryKey) {

                if (primaryKeys.length === 1) {
                    primaryKey = " PRIMARY KEY";
                }

                if (column.isAutoIncrement) {
                    primaryKey += " IDENTITY(1,1)";
                }
            }

            return `${this._escapeName(column.name)} ${this.dataTypeMapping[column.type] + primaryKey}`

        } else {
            return null;
        }
    }

    createColumnsDefinitionStatement() {
        const columns = this.table.columns || [];
        const columnsDefinition = columns.map((column) => {
            return this.createColumnDefinitionStatement(column);
        }).filter((value) => {
            return value != null;
        }).join(", ")

        return columnsDefinition;
    }

    createIndexStatement(column) {
        return `IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'${this._getQualifiedDbTableName(this.table.name)}') AND name = N'index_${column.replace(/\"/g, '""')}')
                  CREATE INDEX index_${column.replace(/\"/g, '""')} ON ${this._getQualifiedDbTableName(this.table.name)} (${this._escapeName(column)})`;
    }

    createTableIndexesStatements(relationships) {
        if (relationships == null) {
            throw new Error("Null Argument Exception: relationships cannot be null or undefined.");
        }

        const indexedColumns = {};

        const foreignKeyIndexes = this.getTablesRelationshipsAsTargets(relationships).forEach((relationship) => {
            indexedColumns[relationship.withForeignKey] = true;
        });

        const primaryKeys = this.getPrimaryKeys(this.table.columns);

        this.getTablesRelationshipsAsSources(relationships).filter((relationship) => {
            return primaryKeys.indexOf(relationship.hasKey) === -1;
        }).forEach((relationship) => {
            return indexedColumns[relationship.hasKey] = true;
        });

        primaryKeys.forEach((name) => {
            indexedColumns[name] = true;
        });

        this.table.columns.filter((column) => {
            return column.isIndexed;
        }).map((column) => {
            return indexedColumns[column.name]
        });

        return Object.keys(indexedColumns).map((columnName) => {
            return this.createIndexStatement(columnName);
        });

    }

    createForeignKeysStatement(relationships) {
        const tableRelationships = this.getTablesRelationshipsAsTargets(relationships);

        return tableRelationships.map((relationship) => {
            return this.createForeignKeyStatement(relationship);
        }).join("/n/t");
    }

    createForeignKeyStatement(relationship) {
        return `CONSTRAINT [c_${relationship.ofType}.${this._getDbTableName(relationship.withForeignKey)}_to_${this._getDbTableName(relationship.type)}.${relationship.hasKey}] FOREIGN KEY([${this._getDbTableName(relationship.withForeignKey)}]) REFERENCES ${this._getQualifiedDbTableName(relationship.type)} ([${relationship.hasKey}])`;
    }

    createPrimaryKeyStatement() {
        const primaryKeys = this.getPrimaryKeys(this.table.columns).map((primaryKey) => {
            return this._escapeName(primaryKey);
        });

        if (primaryKeys.length === 0) {
            return "";
        } else {
            return `PRIMARY KEY (${primaryKeys.join(", ")})`;
        }
    }

    createTableStatement(relationships = {}) {
        relationships = Object.assign({}, defaultRelationships, relationships);


        const columnDefinitionsStatement = this.createColumnsDefinitionStatement();
        // not sure we want to be enforcing these in the DB.
        //const foreignKeysStatement = this.createForeignKeysStatement(relationships);
        const foreignKeysStatement = "";

        if (columnDefinitionsStatement && foreignKeysStatement) {
            return this._wrapIfTableExists(this.table,
                `CREATE TABLE ${this._getQualifiedDbTableName(this.table.name)} (${columnDefinitionsStatement}, ${foreignKeysStatement})`);
        } else if (columnDefinitionsStatement) {
            return this._wrapIfTableExists(this.table,
                `CREATE TABLE ${this._getQualifiedDbTableName(this.table.name)} (${columnDefinitionsStatement})`);
        } else {
            return this._wrapIfTableExists(this.table,
                `CREATE TABLE ${this._getQualifiedDbTableName(this.table.name)}`);
        }

    }

    filterRelevantColumns(columns) {
        return columns.filter((column) => {
            return this.dataTypeMapping[column.type] != null;
        });
    }

    getTablesRelationshipsAsTargets(relationships) {
        const foreignKeyNames = {};

        const filter = (relationship) => {
            const foreignKey = relationship.withForeignKey;

            if (relationship.ofType === this.table.name && foreignKeyNames[foreignKey] == null) {
                foreignKeyNames[foreignKey];
                return true;
            }
            return false;
        }

        const oneToOne = relationships.oneToOne.filter(filter);
        const oneToMany = relationships.oneToMany.filter(filter);

        return oneToOne.concat(oneToMany);
    }

    getTablesRelationshipsAsSources(relationships) {
        const keyNames = {};

        const filter = (relationship) => {
            const key = relationship.hasKey;

            if (relationship.type === this.table.name && keyNames[key] == null) {
                keyNames[key];
                return true;
            }
            return false;
        }

        const oneToOne = relationships.oneToOne.filter(filter);
        const oneToMany = relationships.oneToMany.filter(filter);

        return oneToOne.concat(oneToMany);
    }

    getColumn(name) {
        return this.table.columns.find((column) => {
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

}