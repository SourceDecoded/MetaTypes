import ExpressionVisitor from "./../query/ExpressionVisitor";

export default class Visitor extends ExpressionVisitor {
    constructor(name, edm) {
        super();
        this.name = name;
        this.edm = edm;
        this.table = this._getTable(name);
        this.currentNavigationTable = this.table;
        this.joinClauses = [];
        this.tableTypes = new Map();

        this.dataConverter = {
            convertString: (value) => {
                return this._escape(value);
            },
            convertContainsString: (value) => {
                return "'%" + this._escape(value) + "%'";
            },
            convertStartsWithString: (value) => {
                return "'" + this._escape(value) + "%'";
            },
            convertEndsWithString: (value) => {
                return "'%" + this._escape(value) + "'";
            },
            convertNumber: (value) => {
                return value.toString();
            },
            convertBoolean: (value) => {
                return value ? 1 : 0;
            },
            convertDate: (value) => {
                return value.getTime();
            }
        }

    }

    _addJoinClause(clause) {
        let index = this.joinClauses.indexOf(clause);
        if (index === -1) {
            this.joinClauses.push(clause);
        }
    }

    _escape(value) {
        return `${value.replace(/'/g, "''")}`;
    }

    _escapeIdentifier(value){
        return `"${value.replace(/\"/g, '"')}"`; 
    }

    _buildLeftJoinStatementFromSource(relationship) {
        return `LEFT JOIN ${this._escapeIdentifier(relationship.ofType)} ON ${this._escapeIdentifier(relationship.type)}.${this._escapeIdentifier(relationship.hasKey)} = ${this._escapeIdentifier(relationship.ofType)}.${this._escapeIdentifier(relationship.withForeignKey)}`;
    }

    _buildLeftJoinStatementFromTarget(relationship) {
        return `LEFT JOIN ${this._escapeIdentifier(relationship.type)} ON ${this._escapeIdentifier(relationship.ofType)}.${this._escapeIdentifier(relationship.withForeignKey)} = ${this._escapeIdentifier(relationship.type)}.${this._escapeIdentifier(relationship.hasKey)}`;
    };

    _getNavigationProperties(edm, table) {
        let properties = {};
        let relationships = edm.relationships;

        let sourceRelationships = this._getRelationshipsAsSource(table, relationships);
        let targetRelationships = this._getRelationshipsAsTarget(table, relationships);

        sourceRelationships.forEach((relationship) => {
            let property;

            if (relationship.hasOne != null) {
                property = relationship.hasOne;
            } else {
                property = relationship.hasMany;
            }

            properties[property] = {
                relationship: relationship,
                table: this._getTable(relationship.ofType),
                joinClause: this._buildLeftJoinStatementFromSource(relationship)
            };
        });

        targetRelationships.forEach((relationship) => {
            properties[relationship.withOne] = {
                relationship: relationship,
                table: this._getTable(relationship.type),
                joinClause: this._buildLeftJoinStatementFromTarget(relationship)
            };
        });

        return properties;
    }

    _getRelationshipsAsSource(table, relationships) {
        const filter = (relationship) => {
            return relationship.type === table.name;
        };

        const oneToOneRelationships = relationships.oneToOne.filter(filter);
        const oneToManyRelationships = relationships.oneToMany.filter(filter);

        return oneToOneRelationships.concat(oneToManyRelationships);
    }

    _getRelationshipsAsTarget(table, relationships) {
        const filter = (relationship) => {
            return relationship.ofType === table.name;
        }

        const oneToOneRelationships = relationships.oneToOne.filter(filter);
        const oneToManyRelationships = relationships.oneToMany.filter(filter);

        return oneToOneRelationships.concat(oneToManyRelationships);
    }

    _getTable(name) {
        return this.edm.tables.find((table) => {
            return table.name === name;
        });
    }

    _sqlizePrimitive(value) {
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

    _writeTableProperty(table, column) {
        return this._escapeIdentifier(table) + "." + this._escapeIdentifier(column);
    }

    and() {
        let children = Array.prototype.slice.call(arguments, 0);
        let result = [];

        children.forEach((expression, index) => {
            result.push(expression);
            if (index !== children.length - 1) {
                result.push(" AND ");
            }
        });

        let joined = result.join("");

        if (joined === "") {
            return "";
        }

        return "(" + joined + ")";
    }

    any(property, expression) {
        let table = property.table;
        let visitor = new Visitor(table.name, this.edm);

        return visitor.parse(expression);
    }

    ascending(propertyAccessor) {
        let namespace = propertyAccessor.value;
        return namespace + " ASC";
    }

    array(expression) {
        return expression.value;
    }

    boolean(expression) {
        return expression.value;
    }

    countAsync(left, right) {
        throw new Error("Not yet implemented.");
    }

    constant(expression) {
        return expression.value;
    }

    createSelectStatementWithCount(query, countAlias) {
        let queryParts = [];
        countAlias = countAlias || "count";

        this.joinClauses = [];
        this.tableTypes = new Map();

        this.tableTypes.set(this.table.name, this.table);

        let where = this.parse(query.where);
        let orderBy = this.parse(query.orderBy);
        let include = this.parse(query.include);

        if (where && include) {
            where = where + " AND " + include;
        } else if (!where && include) {
            where = include;
        }

        queryParts.push(
            "SELECT COUNT(*) AS \"" + countAlias + "\" FROM " + this._escapeIdentifier(this.table.name),
            this.joinClauses.join(" "),
            where,
            orderBy
        );

        return queryParts.join(" ");
    }

    createSelectStatement(query) {
        let queryParts = [];

        this.joinClauses = [];
        this.tableTypes = new Map();

        this.tableTypes.set(this.table.name, this.table);

        let where = this.parse(query.where);
        let orderBy = this.parse(query.orderBy);
        let include = this.parse(query.include);
        let skip = this.parse(query.skip);
        let take = this.parse(query.take);
        let columnAliases = this.makeColumnAliases(this.tableTypes);
        let joinClause = this.joinClauses.length > 0 ? this.joinClauses.join(" ") : "";

        if (where && include) {
            where = where + " AND " + include;
        } else if (!where && include) {
            where = include;
        }

        queryParts.push(
            "SELECT " + columnAliases + " FROM " + this._escapeIdentifier(this.table.name),
            joinClause,
            where,
            orderBy,
            take,
            skip
        );

        return queryParts.filter((part) => {
            return part != null && part != "";
        }).join(" ");
    };

    date(expression) {
        return this._sqlizePrimitive(expression.value);
    }

    descending(propertyAccessor) {
        let namespace = propertyAccessor.value;
        return namespace + " DESC";
    }

    endsWith(propertyAccessor, value) {
        let namespace = propertyAccessor.value;
        return namespace + " LIKE " + this.dataConverter.convertEndsWithString(value);
    }

    equalTo(propertyAccessor, right) {
        let left = propertyAccessor.value;
        if (right === null) {
            return left + " IS NULL";
        } else {
            return left + " = " + this._sqlizePrimitive(right);
        }
    }

    expression(expression) {
        return expression.value;
    }

    greaterThan(propertyAccessor, right) {
        let left = propertyAccessor.value;
        return left + " > " + this._sqlizePrimitive(right);
    }

    greaterThanOrEqualTo(propertyAccessor, right) {
        let left = propertyAccessor.value;
        return left + " >= " + this._sqlizePrimitive(right);
    }

    include(whereExpression) {
        return whereExpression;
    }

    isIn(property, array) {
        return "(" + array.map((value) => {
            return this.equalTo(property, value);
        }).join(" OR ") + ")";
    }

    isNotIn(property, array) {
        return "(" + array.map((value) => {
            return this.notEqual(property, value);
        }).join(" AND ") + ")";
    }

    lessThan(propertyAccessor, right) {
        let left = propertyAccessor.value;
        return left + " < " + this._sqlizePrimitive(right);
    }

    lessThanOrEqualTo(propertyAccessor, right) {
        let left = propertyAccessor.value;
        return left + " <= " + this._sqlizePrimitive(right);
    }

    makeColumnAliases(map) {
        let columns = [];

        map.forEach((table) => {
            let tableName = table.name;

            table.columns.forEach((column) => {
                let columnName = column.name;

                columns.push(this._escapeIdentifier(tableName) + "." + this._escapeIdentifier(columnName) + " AS " + this._escapeIdentifier(tableName + "___" + columnName));
            });

        });

        return columns.join(", ");
    }

    not(left, right) {
        return left + " NOT " + right;
    }

    notEqualTo(propertyAccessor, right) {
        let left = propertyAccessor.value;
        if (right === null) {
            return left + " IS NOT NULL";
        } else {
            return left + " <> " + this._sqlizePrimitive(right);
        }
    }

    null(expression) {
        return null;
    }

    number(expression) {
        return expression.value;
    }

    or() {
        let children = Array.prototype.slice.call(arguments, 0);
        let result = [];
        children.forEach((expression, index) => {
            result.push(expression);
            if (index !== children.length - 1) {
                result.push(" OR ");
            }
        });

        let joined = result.join("");

        if (joined === "") {
            return "";
        }

        return "(" + joined + ")";
    }

    orderBy() {
        let result = Array.prototype.slice.call(arguments, 0).join(", ");
        if (!result) {
            return "";
        }

        return "ORDER BY " + result;
    }

    property(expression) {
        let property = expression.value;
        return property;
    }

    propertyAccess(tableMetaData, property) {
        let propertyData = tableMetaData.navigationProperties && tableMetaData.navigationProperties[property] || null;
        let propertyTable = propertyData && propertyData.table || null;
        let currentTableName = this.currentNavigationTable.name;

        let navigationProperties = null;

        if (propertyTable) {
            this.tableTypes.set(propertyTable.name, propertyTable);
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

    queryable(property, expression) {
        let table = property.table;
        let visitor = new Visitor(table.name, this.edm);

        return visitor.parse(expression);
    };

    skip(value) {
        return "OFFSET " + value;
    }

    startsWith(propertyAccessor, value) {
        let namespace = propertyAccessor.value;
        let newValue = this._sqlizePrimitive(value);
        newValue = value.substring(1, value.length - 1);

        return namespace + " LIKE " + this.dataConverter.convertStartsWithString(value);
    }

    string(expression) {
        return expression.value;
    }

    substringOf(propertyAccessor, value) {
        let namespace = propertyAccessor.value;
        return namespace + " LIKE " + this.dataConverter.convertContainsString(value);
    }

    take(value) {
        if (value === Infinity) {
            return "LIMIT -1";
        } else {
            return "LIMIT" + value;
        }
    }

    type(type) {
        this.currentNavigationTable = this.table;
        let navigationProperties = this._getNavigationProperties(this.edm, this.table)

        return {
            table: this.table,
            value: "",
            navigationProperties: navigationProperties
        };
    }

    where(expression) {
        if (!expression) {
            return "";
        }
        return "WHERE " + this["and"].apply(this, arguments);
    }

}


