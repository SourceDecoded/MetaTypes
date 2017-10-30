"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryablejs = require("queryablejs");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Visitor = function (_ExpressionVisitor) {
    _inherits(Visitor, _ExpressionVisitor);

    function Visitor(name, edm, schema) {
        _classCallCheck(this, Visitor);

        var _this = _possibleConstructorReturn(this, (Visitor.__proto__ || Object.getPrototypeOf(Visitor)).call(this));

        _this.name = name;
        _this.edm = edm;
        _this.table = _this._getTable(name);
        _this.currentNavigationTable = _this.table;
        _this.joinClauses = [];
        _this.tableTypes = new Map();
        _this.isParsingInclude = false;
        _this.schema = schema;

        _this.dataConverter = {
            convertString: function convertString(value) {
                return "'" + _this._escape(value) + "'";
            },
            convertContainsString: function convertContainsString(value) {
                return "'%" + _this._escape(value) + "%'";
            },
            convertStartsWithString: function convertStartsWithString(value) {
                return "'" + _this._escape(value) + "%'";
            },
            convertEndsWithString: function convertEndsWithString(value) {
                return "'%" + _this._escape(value) + "'";
            },
            convertNumber: function convertNumber(value) {
                return value.toString();
            },
            convertBoolean: function convertBoolean(value) {
                return value ? 1 : 0;
            },
            convertDate: function convertDate(value) {
                return value.getTime();
            }
        };

        return _this;
    }

    _createClass(Visitor, [{
        key: "_getDbTableName",
        value: function _getDbTableName(table) {
            return table + "__" + this.edm.version.replace(/\./g, "_");
        }
    }, {
        key: "_getQualifiedDbTableName",
        value: function _getQualifiedDbTableName() {
            return "[" + this.schema + "].[" + this._getDbTableName(this.table.name) + "]";
        }
    }, {
        key: "_addJoinClause",
        value: function _addJoinClause(clause) {
            var index = this.joinClauses.indexOf(clause);
            if (index === -1) {
                this.joinClauses.push(clause);
            }
        }
    }, {
        key: "_escape",
        value: function _escape(value) {
            return "" + value.replace(/'/g, "''");
        }
    }, {
        key: "_escapeIdentifier",
        value: function _escapeIdentifier(value) {
            return "[" + value + "]";
        }
    }, {
        key: "_buildLeftJoinStatementFromSource",
        value: function _buildLeftJoinStatementFromSource(relationship) {
            return "LEFT JOIN [" + this.schema + "].[" + relationship.ofType + "] ON [" + this.schema + "].[" + relationship.type + "].[" + relationship.hasKey + "] = [" + this.schema + "].[" + relationship.ofType + "].[" + relationship.withForeignKey + "]";
        }
    }, {
        key: "_buildLeftJoinStatementFromTarget",
        value: function _buildLeftJoinStatementFromTarget(relationship) {
            return "LEFT JOIN [" + this.schema + "].[" + relationship.type + "] ON [" + this.schema + "].[" + relationship.ofType + "].[" + relationship.withForeignKey + "] = [" + this.schema + "].[" + relationship.type + "].[" + relationship.hasKey + "]";
        }
    }, {
        key: "_getNavigationProperties",
        value: function _getNavigationProperties(edm, table) {
            var _this2 = this;

            var properties = {};
            var relationships = edm.relationships;

            var sourceRelationships = this._getRelationshipsAsSource(table, relationships);
            var targetRelationships = this._getRelationshipsAsTarget(table, relationships);

            sourceRelationships.forEach(function (relationship) {
                var property = void 0;

                if (relationship.hasOne != null) {
                    property = relationship.hasOne;
                } else {
                    property = relationship.hasMany;
                }

                properties[property] = {
                    relationship: relationship,
                    table: _this2._getTable(relationship.ofType),
                    joinClause: _this2._buildLeftJoinStatementFromSource(relationship)
                };
            });

            targetRelationships.forEach(function (relationship) {
                properties[relationship.withOne] = {
                    relationship: relationship,
                    table: _this2._getTable(relationship.type),
                    joinClause: _this2._buildLeftJoinStatementFromTarget(relationship)
                };
            });

            return properties;
        }
    }, {
        key: "_getRelationshipsAsSource",
        value: function _getRelationshipsAsSource(table, relationships) {
            var filter = function filter(relationship) {
                return relationship.type === table.name;
            };

            var oneToOneRelationships = relationships.oneToOne.filter(filter);
            var oneToManyRelationships = relationships.oneToMany.filter(filter);

            return oneToOneRelationships.concat(oneToManyRelationships);
        }
    }, {
        key: "_getRelationshipsAsTarget",
        value: function _getRelationshipsAsTarget(table, relationships) {
            var filter = function filter(relationship) {
                return relationship.ofType === table.name;
            };

            var oneToOneRelationships = relationships.oneToOne.filter(filter);
            var oneToManyRelationships = relationships.oneToMany.filter(filter);

            return oneToOneRelationships.concat(oneToManyRelationships);
        }
    }, {
        key: "_getTable",
        value: function _getTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "_sqlizePrimitive",
        value: function _sqlizePrimitive(value) {
            if (typeof value === "string") {
                return this.dataConverter.convertString(value);
            } else if (typeof value === "number") {
                return this.dataConverter.convertNumber(value);
            } else if (typeof value === "boolean") {
                return this.dataConverter.convertBoolean(value);
            } else if (value instanceof Date) {
                return this.dataConverter.convertDate(value);
            } else if (value == null) {
                return "NULL";
            } else {
                throw new Error("Unknown primitive type.");
            }
        }
    }, {
        key: "_writeTableProperty",
        value: function _writeTableProperty(table, column) {
            return "[" + this.schema + "].[" + table + "__" + this.edm.version.replace(/\./g, "_") + "].[" + column + "]";
        }
    }, {
        key: "and",
        value: function and() {
            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];

            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(" AND ");
                }
            });

            var joined = result.join("");

            if (joined === "") {
                return "";
            }

            return "(" + joined + ")";
        }
    }, {
        key: "any",
        value: function any(property, expression) {
            var table = property.table;
            var visitor = new Visitor(table.name, this.edm);
            var result = vistor.parse(expression);

            return visitor.parse(expression);
        }
    }, {
        key: "ascending",
        value: function ascending(propertyAccessor) {
            var namespace = propertyAccessor.value;
            return namespace + " ASC";
        }
    }, {
        key: "array",
        value: function array(expression) {
            return expression.value;
        }
    }, {
        key: "boolean",
        value: function boolean(expression) {
            return expression.value;
        }
    }, {
        key: "countAsync",
        value: function countAsync(left, right) {
            throw new Error("Not yet implemented.");
        }
    }, {
        key: "constant",
        value: function constant(expression) {
            return expression.value;
        }
    }, {
        key: "createSelectStatementWithCount",
        value: function createSelectStatementWithCount(query, countAlias) {
            var queryParts = [];
            countAlias = countAlias || "count";

            this.joinClauses = [];
            this.tableTypes = new Map();

            this.tableTypes.set(this.table.name, this.table);

            var where = this.parse(query.where);

            queryParts.push("SELECT COUNT(*) AS \"" + countAlias + "\" FROM " + this._escapeIdentifier(this.schema + "." + this.table.name), this.joinClauses.join(" "), where);

            return queryParts.join(" ");
        }
    }, {
        key: "createCustomSelectStatement",
        value: function createCustomSelectStatement(query, properties) {}
    }, {
        key: "createSelectStatement",
        value: function createSelectStatement(query) {
            var queryParts = [];

            this.joinClauses = [];
            this.tableTypes = new Map();

            this.tableTypes.set(this.table.name, this.table);

            var where = this.parse(query.where);
            // let orderBy = this.parse(query.orderBy);
            var orderBy = '';
            // let skip = this.parse(query.skip);
            var skip = '';
            // let take = this.parse(query.take);
            var take = '';

            // this.isParsingInclude = true;
            // let include = this.parse(query.include);
            var include = '';
            this.isParsingInclude = false;

            var columnAliases = this.makeColumnAliases(this.tableTypes);
            var joinClause = this.joinClauses.length > 0 ? this.joinClauses.join(" ") : "";

            if (where && include) {
                where = where + " AND " + include;
            } else if (!where && include) {
                where = include;
            }

            queryParts.push("SELECT " + take + " " + columnAliases + " FROM " + this._getQualifiedDbTableName(), joinClause, where, orderBy);

            return queryParts.filter(function (part) {
                return part != null && part != "";
            }).join(" ");
        }
    }, {
        key: "date",
        value: function date(expression) {
            return this._sqlizePrimitive(expression.value);
        }
    }, {
        key: "descending",
        value: function descending(propertyAccessor) {
            var namespace = propertyAccessor.value;
            return namespace + " DESC";
        }
    }, {
        key: "endsWith",
        value: function endsWith(propertyAccessor, value) {
            var namespace = propertyAccessor.value;
            return namespace + " LIKE " + this.dataConverter.convertEndsWithString(value);
        }
    }, {
        key: "equalTo",
        value: function equalTo(propertyAccessor, right) {
            var left = propertyAccessor.value;
            if (right === null) {
                return left + " IS NULL";
            } else {
                return left + " = " + this._sqlizePrimitive(right);
            }
        }
    }, {
        key: "expression",
        value: function expression(_expression) {
            return _expression.value;
        }
    }, {
        key: "greaterThan",
        value: function greaterThan(propertyAccessor, right) {
            var left = propertyAccessor.value;
            return left + " > " + this._sqlizePrimitive(right);
        }
    }, {
        key: "greaterThanOrEqualTo",
        value: function greaterThanOrEqualTo(propertyAccessor, right) {
            var left = propertyAccessor.value;
            return left + " >= " + this._sqlizePrimitive(right);
        }
    }, {
        key: "include",
        value: function include(whereExpression) {
            return whereExpression;
        }
    }, {
        key: "isIn",
        value: function isIn(property, array) {
            var _this3 = this;

            return "(" + array.map(function (value) {
                return _this3.equalTo(property, value);
            }).join(" OR ") + ")";
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(property, array) {
            var _this4 = this;

            return "(" + array.map(function (value) {
                return _this4.notEqual(property, value);
            }).join(" AND ") + ")";
        }
    }, {
        key: "lessThan",
        value: function lessThan(propertyAccessor, right) {
            var left = propertyAccessor.value;
            return left + " < " + this._sqlizePrimitive(right);
        }
    }, {
        key: "lessThanOrEqualTo",
        value: function lessThanOrEqualTo(propertyAccessor, right) {
            var left = propertyAccessor.value;
            return left + " <= " + this._sqlizePrimitive(right);
        }
    }, {
        key: "makeColumnAliases",
        value: function makeColumnAliases(map) {
            var _this5 = this;

            var columns = [];

            map.forEach(function (table) {
                var tableName = table.name;

                table.columns.forEach(function (column) {
                    var columnName = column.name;

                    columns.push(_this5._getQualifiedDbTableName() + "." + _this5._escapeIdentifier(columnName) + " AS " + _this5._escapeIdentifier(tableName + "___" + columnName));
                });
            });

            return columns.join(", ");
        }
    }, {
        key: "not",
        value: function not(left, right) {
            return left + " NOT " + right;
        }
    }, {
        key: "notEqualTo",
        value: function notEqualTo(propertyAccessor, right) {
            var left = propertyAccessor.value;
            if (right === null) {
                return left + " IS NOT NULL";
            } else {
                return left + " <> " + this._sqlizePrimitive(right);
            }
        }
    }, {
        key: "null",
        value: function _null(expression) {
            return null;
        }
    }, {
        key: "number",
        value: function number(expression) {
            return expression.value;
        }
    }, {
        key: "or",
        value: function or() {
            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];
            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(" OR ");
                }
            });

            var joined = result.join("");

            if (joined === "") {
                return "";
            }

            return "(" + joined + ")";
        }
    }, {
        key: "orderBy",
        value: function orderBy() {
            var result = Array.prototype.slice.call(arguments, 0).join(", ");
            if (!result) {
                return "";
            }

            return "ORDER BY " + result;
        }
    }, {
        key: "property",
        value: function property(expression) {
            var property = expression.value;
            return property;
        }
    }, {
        key: "propertyAccess",
        value: function propertyAccess(tableMetaData, property) {
            var propertyData = tableMetaData.navigationProperties && tableMetaData.navigationProperties[property] || null;
            var propertyTable = propertyData && propertyData.table || null;
            var currentTableName = this.currentNavigationTable.name;

            var navigationProperties = null;

            if (propertyTable) {
                if (this.isParsingInclude) {
                    this.tableTypes.set(propertyTable.name, propertyTable);
                }
                this._addJoinClause(propertyData.joinClause);
                this.currentNavigationTable = propertyTable;
                navigationProperties = this._getNavigationProperties(this.edm, propertyTable);
            }

            return {
                table: propertyTable,
                value: this._writeTableProperty(currentTableName, property),
                navigationProperties: navigationProperties
            };
        }
    }, {
        key: "queryable",
        value: function queryable(property, expression) {
            var table = property.table;
            var visitor = new Visitor(table.name, this.edm);

            return visitor.parse(expression);
        }
    }, {
        key: "skip",
        value: function skip(value) {
            return "OFFSET " + value;
        }
    }, {
        key: "startsWith",
        value: function startsWith(propertyAccessor, value) {
            var namespace = propertyAccessor.value;
            var newValue = this._sqlizePrimitive(value);
            newValue = value.substring(1, value.length - 1);

            return namespace + " LIKE " + this.dataConverter.convertStartsWithString(value);
        }
    }, {
        key: "string",
        value: function string(expression) {
            return expression.value;
        }
    }, {
        key: "substringOf",
        value: function substringOf(propertyAccessor, value) {
            var namespace = propertyAccessor.value;
            return namespace + " LIKE " + this.dataConverter.convertContainsString(value);
        }
    }, {
        key: "take",
        value: function take(value) {
            if (value === Infinity) {
                return "";
            } else {
                return "TOP(" + value + ")";
            }
        }
    }, {
        key: "type",
        value: function type(_type) {
            this.currentNavigationTable = this.table;
            var navigationProperties = this._getNavigationProperties(this.edm, this.table);

            return {
                table: this.table,
                value: "",
                navigationProperties: navigationProperties
            };
        }
    }, {
        key: "where",
        value: function where(expression) {
            if (!expression) {
                return "";
            }
            return "WHERE " + this["and"].apply(this, arguments);
        }
    }]);

    return Visitor;
}(_queryablejs.ExpressionVisitor);

exports.default = Visitor;
//# sourceMappingURL=Visitor.js.map