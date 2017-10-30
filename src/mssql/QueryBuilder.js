import Visitor from "./Visitor";

export default class QueryBuilder {
    constructor(edm) {
        this.edm = edm;
    }

    _createAscendingExpression(columns) {
        let ascending = columns.join(", ");

        if (ascending.length > 0) {
            ascending = `${ascending} ASC`;
        }

        return ascending;
    }

    _createDescendingExpression(columns) {
        let desceding = columns.join(", ");

        if (desceding.length > 0) {
            desceding = `${desceding} DESC`;
        }

        return desceding;
    }

    _createLimitClause(value) {
        if (value === Infinity) {
            return `LIMIT -1`;
        } else if (typeof value === "number") {
            return `LIMIT ${value}`;
        } else {
            return "";
        }
    }

    _createOffsetClause(value) {
        return `OFFSET ${value}`;
    }

    _createOrderByClause(orderBy) {

        let accumulator = {
            ASC: [],
            DESC: []
        };

        orderBy.reduce((accumulator, orderBy) => {
            if (Array.isArray(accumulator[orderBy.type])) {
                accumulator[orderBy.type].push(orderBy.column);
            }
            return accumulator;
        }, accumulator);

        let ascending = this._createAscendingExpression(accumulator.ASC);
        let desceding = this._createDescendingExpression(accumulator.DESC);

        let orderByClause = [
            ascending,
            desceding
        ].filter(this._isNotEmptyFilter).join(",");

        if (orderByClause.length > 0) {
            return `ORDER BY ${orderByClause}`;
        } else {
            return orderByClause;
        }

    }

    _createSelectStatement(query) {
        let tableName = query.type;
        let mapping = query.select;
        let keys = Object.keys(mapping);

        if (keys.length === 0) {
            return `SELECT * FROM ${this._escapeIdentifier(tableName)}`;
        } else {
            let columns = keys.map((key) => {
                return `${this._escapeIdentifier(key)} AS ${this._escapeIdentifier(mapping[key])}`;
            }).join(", ");

            return `SELECT ${columns} FROM ${this._escapeIdentifier(tableName)}`;
        }
    }

    _createSelectStatementWithCount(tableName) {
        return `SELECT COUNT(*) AS count FROM ${this._escapeIdentifier(tableName)}`;
    }

    _createWhereClause(query) {
        let visitor = new Visitor(query.type, this.edm);

        return visitor.parse(query.where);
    }

    _escapeIdentifier(value) {
        if (value == null) {
            return value;
        }

        return `"${value.replace(/\"/g, '""')}"`;
    }

    _isNotEmptyFilter(part) {
        return typeof part === "string" && part.length > 0;
    }

    createStatement(query) {
        let parts = [];
        let select = this._createSelectStatement(query);
        let where = this._createWhereClause(query);
        let orderBy = this._createOrderByClause(query.orderBy);
        let limit = this._createLimitClause(query.take);
        let offset = this._createOffsetClause(query.skip);

        parts.push(
            select,
            where,
            orderBy,
            limit,
            offset
        );

        parts = parts.filter(this._isNotEmptyFilter);

        return parts.join(" ");

    }

    createCountStatement(query) {
        let parts = [];
        let select = this._createSelectStatementWithCount(query);
        let where = this._createWhereClause(query);
        let orderBy = this._createOrderByClause(query.orderBy);
        let limit = this._createLimitClause(query.take);
        let offset = this._createOffsetClause(query.skip);

        parts.push(
            select,
            where
        );

        parts = parts.filter(this._isNotEmptyFilter);

        return parts.join(" ");

    }
}