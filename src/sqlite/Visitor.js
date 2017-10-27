import { ExpressionVisitor, Queryable } from "queryablejs";

class SqlParts {
    constructor() {
        this.select = null;
        this.where = null;
        this.orderBy = null;
        this.skip = 0;
        this.take = Infinity;
    }

    toString() {
        let parts = [];

        parts.push(
            this.select,
            this.where,
            this.orderBy,
            this.take,
            this.skip
        );

        parts = parts.filter((part) => {
            return typeof part === "string" && part.length > 0;
        });

        return parts.join(" ");
    }
}

export default class Visitor extends ExpressionVisitor {
    constructor(name, edm) {
        super();
        this.name = name;
        this.edm = edm;
        this.table = this._getTable(name);

        this.dataConverter = {
            convertString: (value) => {
                return `'${this._escape(value)}'`;
            },
            convertContainsString: (value) => {
                return `'%${this._escape(value)}%'`;
            },
            convertStartsWithString: (value) => {
                return `'${this._escape(value)}%'`;
            },
            convertEndsWithString: (value) => {
                return `'%${this._escape(value)}'`;
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

    _escape(value) {
        if (value == null) {
            return value;
        }

        return `${value.replace(/'/g, "''")}`;
    }

    _escapeIdentifier(value) {
        if (value == null) {
            return value;
        }

        return `"${value.replace(/\"/g, '""')}"`;
    }

    _createSelectStatement(query) {
        let mapping = query.select.value;
        let keys = Object.keys(mapping);

        if (keys.length === 0) {
            return `SELECT * FROM ${this._escapeIdentifier(this.table.name)}`;
        } else {
            let columns = keys.map((key) => {
                return `${this._escapeIdentifier(key)} AS ${this._escapeIdentifier(mapping[key])}`;
            }).join(", ");

            return `SELECT ${columns} FROM ${this._escapeIdentifier(this.table.name)}`;
        }
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
        return `${this._escapeIdentifier(table)}.${this._escapeIdentifier(column)}`;
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

    ascending(left) {
        return `${left} ASC`;
    }

    array(expression) {
        let array = expression.value;
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

    createSqlWithCount(query) {
        let queryParts = [];
        let countAlias = "count";

        let sql = new SqlParts();
        sql.select = `SELECT COUNT(*) AS count FROM ${this._escapeIdentifier(this.name)}`;
        sql.where = this.parse(query.where);

        return sql.toString();
    }

    createSql(query) {
        let sql = new SqlParts();
        sql.select = this._createSelectStatement(query);
        sql.where = this.parse(query.where);
        sql.orderBy = this.parse(query.orderBy);
        sql.skip = this.skip(query.skip.value);
        sql.take = this.take(query.take.value);

        return sql.toString();
    };

    date(expression) {
        return expression.value;
    }

    descending(left) {
        return `${left} DESC`;
    }

    endsWith(left, right) {
        return `${left} LIKE ${this.dataConverter.convertEndsWithString(right)}`;
    }

    isEqualTo(left, right) {
        if (right === null) {
            return `${left} IS NULL`;
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

        return `(${result})`;
    }

    orderBy() {
        let result = Array.from(arguments).join(", ");

        if (result === "") {
            return "";
        }

        return `ORDER BY ${result}`;
    }

    property(expression) {
        return expression.value;
    }

    propertyAccess(type, property) {
        return this._writeTableProperty(this.table.name, property);
    }

    queryable(expression) {
        let query = expression.value;
        let visitor = new Visitor(queryable.type, this.edm);

        return `(${visitor.createSql(query)})`;
    };

    skip(value) {
        return `OFFSET ${value}`
    }

    startsWith(left, value) {
        return `${left} LIKE ${this.dataConverter.convertStartsWithString(value)}`;
    }

    string(expression) {
        return expression.value;
    }

    contains(left, value) {
        return `${left} LIKE ${this.dataConverter.convertContainsString(value)}`;
    }

    take(value) {
        if (value === Infinity) {
            return `LIMIT -1`;
        } else {
            return `LIMIT ${value}`;
        }
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


