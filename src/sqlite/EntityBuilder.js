
let flattenMultiKeyMap = function (multiKeyMap) {
    let keys = multiKeyMap.getKeys();
    return keys.reduce(function (array, key) {
        return array.concat(multiKeyMap.get(key).getValues());
    }, []);
}

export default class EntityBuilder {
    constructor(name, edm) {
        this.name = name;
        this.edm = edm;
        this.relationships = this.edm.relationships;
        this.table = this._getTable(name);
        this.delimiter = "___";
    }

    _attachEntityRelationships(tableName, entity, entityMap, attachedEntities) {
        let table = this._getTable(tableName);

        let sourceRelationships = this._getTablesRelationshipsAsSources(table, this.relationships);
        let targetRelationships = this._getTablesRelationshipsAsTargets(table, this.relationships);

        let oneToOneRelationships = sourceRelationships.filter((relationship) => {
            return relationship.hasOne != null;
        });

        let oneToManyRelationships = sourceRelationships.filter((relationship) => {
            return relationship.hasMany != null;
        });

        oneToOneRelationships.forEach((relationship) => {
            let foreignTableName = relationship.ofType;
            let foreignKey = relationship.withForeignKey;
            let key = relationship.hasKey;
            let hasOne = relationship.hasOne;

            let target = Object.values(entityMap[foreignTableName]).find((target) => {
                return target[foreignKey] === entity[key];
            });

            if (target != null && attachedEntities.indexOf(target) === -1) {
                entity[hasOne] = target;

                attachedEntities(foreignTableName, target, entityMap, attachedEntities.concat([entity]));
            }
        });

        oneToManyRelationships.forEach((relationship) => {
            let foreignTableName = relationship.ofType;
            let foreignKey = relationship.withForeignKey;
            let key = relationship.hasKey;
            let hasMany = relationship.hasMany;

            let targets = Object.values(entityMap[foreignTableName]).filter((target) => {
                return target[foreignKey] === entity[key];
            });

            entity[hasOne] = [];

            targets.forEach((target) => {
                if (attachedEntities.indexOf(target) === -1) {
                    entity[hasOne].push(target);
                    attachedEntities(foreignTableName, target, entityMap, attachedEntities.concat([entity]));
                }
            });
        });

        targetRelationships.forEach((relationship) => {
            let sourceTableName = relationship.type;
            let foreignKey = relationship.withForeignKey;
            let key = relationship.hasKey;
            let withOne = relationship.withOne;

            let source = Object.values(entityMap[sourceTableName]).find((source) => {
                return source[key] === entity[foreignKey];
            });

            if (source != null && attachedEntities.indexOf(source) === -1) {
                entity[withOne] = source;

                attachedEntities(sourceTableName, source, entityMap, attachedEntities.concat([entity]));
            }
        });
    }

    _convertRow(row, entityMap) {
        let edm = this.edm;
        let name = this.name;
        let key = this._getKeyForEntity(entity);
        let entity = entityMap[this.name][key];

        if (entity == null) {
            entityMap[this.name][key] = this._createEntity(name, row);
        }

        Object.keys(row).forEach((key) => {
            let parts = key.split("___");
            let tableName = parts[0];
            let columnName = parts[1];

            let entity = this._createEntity(tableName, row);

            if (entity == null) {
                entityMap[tableName][key] = entity;
            }

        });

        return entity;
    }

    _convertValue(type, value) {
        if (value == null) {
            return null;
        }

        if (type === "String") {
            return value;
        } else if (type === "Numeric") {
            return parseFloat(value);
        } else if (type === "Boolean") {
            return type == "1" ? true : false;
        } else if (type === "Float") {
            return parseFloat(value);
        } else if (type === "Decimal") {
            return parseFloat(value);
        } else if (type === "Double") {
            return parseFloat(value);
        } else if (type === "Integer") {
            return parseInt(value, 10);
        } else if (type === "Date") {
            return new Date(value);
        } else if (type === "Enum") {
            return parseInt(value, 10);
        } else {
            throw new Error("Unknown type.");
        }
    }

    _createEntity(type, row) {
        let entity = {};
        let columns = this._getTable(type).columns;
        let delimiter = this.delimiter;

        columns.forEach((column) => {
            entity[column.name] = this._convertValue(row[`${type}${delimiter}${column.name}`]);
        });

        return entity;
    }

    _createEntityMap() {
        return this.edm.tables.reduce((accumulator, table) => {
            accumulator[table.name] = {};
            return accumulator;
        }, {});
    }

    _getKeyForEntity(entity) {
        return this._getPrimaryKeys(type).map((key) => {
            return entity[key];
        }).join("|");
    }

    _getPrimaryKeys(type) {
        return this._getTable(type).columns.filter((column) => {
            return column.isPrimaryKey;
        }).map((column) => {
            return column.name;
        });
    }

    _getTable(name) {
        return this.edm.tables.find((table) => {
            return table.name === name;
        });
    }

    _getTablesRelationshipsAsTargets(table, relationships) {
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

    _getTablesRelationshipsAsSources(table, relationships) {
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

    convert(sqlResults) {
        let name = this.name;

        if (sqlResults.length > 0) {
            let entityMap = this._createEntityMap();

            let results = sqlResults.map((row) => {
                return this.convertRow(row, entityMap);
            });

            Object.keys(entityMap).forEach((key) => {
                let parts = key.split("_|_");
                let tableName = parts[0];
                let entity = entityMap[key];

                this._attachEntityRelationships(tableName, entity, entityMap, []);
            });

            return results;
        } else {
            return [];
        }
    }


}