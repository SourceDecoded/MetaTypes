"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var flattenMultiKeyMap = function flattenMultiKeyMap(multiKeyMap) {
    var keys = multiKeyMap.getKeys();
    return keys.reduce(function (array, key) {
        return array.concat(multiKeyMap.get(key).getValues());
    }, []);
};

var getValues = function getValues(object) {
    return Object.keys(object).map(function (key) {
        return object[key];
    });
};

var EntityBuilder = function () {
    function EntityBuilder(name, edm) {
        _classCallCheck(this, EntityBuilder);

        this.name = name;
        this.edm = edm;
        this.relationships = this.edm.relationships;
        this.table = this._getTable(name);
        this.delimiter = "___";
    }

    _createClass(EntityBuilder, [{
        key: "_attachEntityRelationships",
        value: function _attachEntityRelationships(tableName, entity, entityMap, attachedEntities) {
            var _this = this;

            var table = this._getTable(tableName);

            var sourceRelationships = this._getTablesRelationshipsAsSources(table, this.relationships);
            var targetRelationships = this._getTablesRelationshipsAsTargets(table, this.relationships);

            var oneToOneRelationships = sourceRelationships.filter(function (relationship) {
                return relationship.hasOne != null;
            });

            var oneToManyRelationships = sourceRelationships.filter(function (relationship) {
                return relationship.hasMany != null;
            });

            oneToOneRelationships.forEach(function (relationship) {
                var foreignTableName = relationship.ofType;
                var foreignKey = relationship.withForeignKey;
                var key = relationship.hasKey;
                var hasOne = relationship.hasOne;

                var target = getValues(entityMap[foreignTableName]).find(function (target) {
                    return target[foreignKey] === entity[key];
                });

                if (target != null && attachedEntities.indexOf(target) === -1) {
                    entity[hasOne] = target;

                    _this._attachEntityRelationships(foreignTableName, target, entityMap, attachedEntities.concat([entity]));
                }
            });

            oneToManyRelationships.forEach(function (relationship) {
                var foreignTableName = relationship.ofType;
                var foreignKey = relationship.withForeignKey;
                var key = relationship.hasKey;
                var hasMany = relationship.hasMany;

                var targets = getValues(entityMap[foreignTableName]).filter(function (target) {
                    return target[foreignKey] === entity[key];
                });

                entity[hasMany] = [];

                targets.forEach(function (target) {
                    if (attachedEntities.indexOf(target) === -1) {
                        entity[hasMany].push(target);
                        _this._attachEntityRelationships(foreignTableName, target, entityMap, attachedEntities.concat([entity]));
                    }
                });
            });

            targetRelationships.forEach(function (relationship) {
                var sourceTableName = relationship.type;
                var foreignKey = relationship.withForeignKey;
                var key = relationship.hasKey;
                var withOne = relationship.withOne;

                var source = getValues(entityMap[sourceTableName]).find(function (source) {
                    return source[key] === entity[foreignKey];
                });

                if (source != null && attachedEntities.indexOf(source) === -1) {
                    entity[withOne] = source;

                    _this._attachEntityRelationships(sourceTableName, source, entityMap, attachedEntities.concat([entity]));
                }
            });
        }
    }, {
        key: "_convertRow",
        value: function _convertRow(row, entityMap) {
            var _this2 = this;

            var edm = this.edm;
            var name = this.name;
            var key = this._getKeyForRow(row);
            var entity = entityMap[this.name][key];

            if (entity == null) {
                entity = entityMap[this.name][key] = this._createEntity(name, row);
            }

            Object.keys(row).forEach(function (key) {
                var parts = key.split("___");
                var tableName = parts[0];
                var columnName = parts[1];

                var entity = _this2._createEntity(tableName, row);

                if (entity == null) {
                    entityMap[tableName][key] = entity;
                }
            });

            return entity;
        }
    }, {
        key: "_convertValue",
        value: function _convertValue(type, value) {
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
    }, {
        key: "_createEntity",
        value: function _createEntity(type, row) {
            var _this3 = this;

            var entity = {};
            var columns = this._getTable(type).columns;
            var delimiter = this.delimiter;

            columns.forEach(function (column) {
                entity[column.name] = _this3._convertValue(column.type, row["" + type + delimiter + column.name]);
            });

            return entity;
        }
    }, {
        key: "_createEntityMap",
        value: function _createEntityMap() {
            return this.edm.tables.reduce(function (accumulator, table) {
                accumulator[table.name] = {};
                return accumulator;
            }, {});
        }
    }, {
        key: "_getKeyForEntity",
        value: function _getKeyForEntity(entity) {
            return this._getPrimaryKeys(this.name).map(function (key) {
                return entity[key];
            }).join("|");
        }
    }, {
        key: "_getKeyForRow",
        value: function _getKeyForRow(row) {
            var _this4 = this;

            return this._getPrimaryKeys(this.name).map(function (key) {
                return row["" + _this4.name + _this4.delimiter + key];
            }).join("|");
        }
    }, {
        key: "_getPrimaryKeys",
        value: function _getPrimaryKeys(name) {
            return this._getTable(name).columns.filter(function (column) {
                return column.isPrimaryKey;
            }).map(function (column) {
                return column.name;
            });
        }
    }, {
        key: "_getTable",
        value: function _getTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "_getTablesRelationshipsAsTargets",
        value: function _getTablesRelationshipsAsTargets(table, relationships) {
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
        key: "_getTablesRelationshipsAsSources",
        value: function _getTablesRelationshipsAsSources(table, relationships) {
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
        key: "convert",
        value: function convert(sqlResults) {
            var _this5 = this;

            var name = this.name;

            if (sqlResults.length > 0) {
                var entityMap = this._createEntityMap();

                var results = sqlResults.map(function (row) {
                    return _this5._convertRow(row, entityMap);
                });

                Object.keys(entityMap).forEach(function (key) {
                    var parts = key.split("_|_");
                    var tableName = parts[0];
                    var entity = entityMap[key];

                    _this5._attachEntityRelationships(tableName, entity, entityMap, []);
                });

                return results;
            } else {
                return [];
            }
        }
    }]);

    return EntityBuilder;
}();

exports.default = EntityBuilder;
//# sourceMappingURL=EntityBuilder.js.map