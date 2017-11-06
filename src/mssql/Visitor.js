import { ExpressionVisitor, QueryConverter } from "queryablejs";
import QueryBuilder from "./QueryBuilder";

export default class Visitor extends ExpressionVisitor {
    constructor(name, edm, schema) {
        super();
        this.name = name;
        this.edm = edm;
        this.table = this._getTable(name);
        this.schema = schema;
        this.queryConverter = new QueryConverter();

    }

    _convertString(value) {
        return `N'${this._escape(value)}'`;
    }

    _convertContainsString(value) {
        return `'%${this._escape(value)}%'`;
    }

    _convertStartsWithString(value) {
        return `'${this._escape(value)}%'`;
    }

    _convertEndsWithString(value) {
        return `'%${this._escape(value)}'`;
    }

    _convertNumber(value) {
        return value.toString();
    }

    _convertBoolean(value) {
        return value ? 1 : 0;
    }

    _convertDate(value) {
        return value.getTime();
    }

    _escape(value) {
        return `${value.replace(/'/g, "''")}`;
    }

    _escapeIdentifier(value) {
        if (value == null) {
            return value;
        }

        return `[${value}]`;
    }

    _getQualifiedDbTableName() {
        return `[${this.schema}].[${this._getDbTableName(this.table.name)}]`;
    }

    _getTable(name) {
        return this.edm.tables.find((table) => {
            return table.name === name;
        });
    }

    _getDbTableName(table) {
        return `${table}__${this.edm.version.replace(/\./g, "_")}`;
    }

    _sqlizePrimitive(value) {
        if (typeof value === "string") {
            return this._convertString(value);
        } else if (typeof value === "number") {
            return this._convertNumber(value);
        } else if (typeof value === "boolean") {
            return this._convertBoolean(value);
        } else if (value instanceof Date) {
            return this._convertDate(value);
        } else if (value == null) {
            return "NULL";
        } else {
            throw new Error("Unknown primitive type.");
        }
    }

    _writeTableProperty(table, column) {
        return `[${this.schema}].[${table}__${this.edm.version.replace(/\./g, "_")}].[${column}]`;
    }

    and() {
        let children = Array.from(arguments);
        let result = children.join(" AND ");

        if (result.length === 0) {
            return "";
        }

        if (children.length === 1) {
            return result;
        }

        return `(${result})`;
    }

    array(expression) {
        let array = expression.value;

        if (!Array.isArray(array)) {
            throw new Error("Invalid query: The array value node needs to be an array.");
        }

        let result = array.map((value) => {
            return this._sqlizePrimitive(value);
        }).join(", ");

        return `(${result})`;
    }

    boolean(expression) {
        return expression.value;
    }

    constant(expression) {
        return expression.value;
    }

    contains(left, value) {
        return `${left} LIKE ${this._convertContainsString(value)}`;
    }

    date(expression) {
        return expression.value;
    }

    endsWith(left, right) {
        return `${left} LIKE ${this._convertEndsWithString(right)}`;
    }

    isEqualTo(left, right) {
        if (right === null) {
            return `${left} IS NULL`;
        } else if (typeof right === "string") {
            return `${left} LIKE ${this._sqlizePrimitive(right)}`;
        } else {
            return `${left} = ${this._sqlizePrimitive(right)}`;
        }
    }

    expression(expression) {
        return expression.value;
    }

    isGreaterThan(left, right) {
        return `${left} > ${this._sqlizePrimitive(right)}`;
    }

    isGreaterThanOrEqualTo(left, right) {
        return `${left} >= ${this._sqlizePrimitive(right)}`;
    }

    isIn(left, results) {
        return `${left} IN ${results}`;
    }

    isNotIn(left, results) {
        return `${left} NOT IN ${results}`;
    }

    isLessThan(left, right) {
        return `${left} < ${this._sqlizePrimitive(right)}`;
    }

    isLessThanOrEqualTo(left, right) {
        return `${left} <= ${this._sqlizePrimitive(right)}`;
    }

    not(left, right) {
        return `${left} NOT ${right}`;
    }

    isNotEqualTo(left, right) {
        if (right === "NULL") {
            return `${left} IS NOT NULL`;
        } else {
            return `${left} <> ${this._sqlizePrimitive(right)}`;
        }
    }

    null(expression) {
        return expression.value;
    }

    number(expression) {
        return expression.value;
    }

    or() {
        let children = Array.from(arguments);
        let result = children.join(" OR ");

        if (result === "") {
            return "";
        }

        if (children.length === 1) {
            return result;
        }

        return `(${result})`;
    }

    property(expression) {
        let property = expression.value;
        return property;
    }

    propertyAccess(type, property) {
        return this._writeTableProperty(this.table.name, property);
    }

    queryable(expression) {
        let query = this.queryConverter.convert(JSON.stringify(expression.value));
        let queryBuilder = new QueryBuilder(this.edm, this.schema);

        return `(${queryBuilder.createStatement(query)})`;
    };

    startsWith(left, value) {
        return `${left} LIKE ${this._convertStartsWithString(value)}`;
    }

    string(expression) {
        return expression.value;
    }

    type(expression) {
        return expression.value;
    }

    where(expression) {
        if (!expression) {
            return "";
        }

        return `WHERE ${this["and"].apply(this, arguments)}`;
    }

}
