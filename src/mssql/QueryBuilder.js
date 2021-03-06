import Visitor from "./Visitor";
import TableNameHelper from "./TableNameHelper";

export default class QueryBuilder {
    constructor(edm, schema) {
        this.edm = edm;
        this.schema = schema;
        this.namer = new TableNameHelper({edm:edm, schema:schema});
    }

    _createAscendingExpression(columns) {
        let ascending = columns.map((column) => {
            return "[" + column + "] ASC";
        }).join(", ");

        return ascending;
    }

    _createDescendingExpression(columns) {
        let desceding = columns.map((column) => {
            return "[" + column + "] DESC";
        }).join(", ");

        return desceding;
    }

    _createLimitClause(value) {
        if (value === Infinity) {
            return "";
        } else if (typeof value === "number") {
            return `FETCH NEXT (${value}) ROWS ONLY`;
        } else {
            return "";
        }
    }

    _createOffsetClause(value) {
        if (typeof value !== "number") {
            value = 0;
        }
        return `OFFSET ${value} ROWS`;
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
            return 'ORDER BY (SELECT NULL)';
        }

    }

    _createSelectStatement(query) {
        let tableName = query.type;
        let mapping = query.select;
        let keys = Object.keys(mapping);

        if (keys.length === 0) {
            return `SELECT * FROM ${this.namer.getQualifiedTableName(tableName)}`;
        } else {
            let columns = keys.map((key) => {
                return `${this._escapeIdentifier(key)} AS ${this._escapeIdentifier(mapping[key])}`;
            }).join(", ");

            return `SELECT ${columns} FROM ${this.namer.getQualifiedTableName(tableName)}`;
        }
    }

    _createSelectStatementWithCount(query) {
        return `SELECT COUNT(*) AS count FROM ${this.namer.getQualifiedTableName(tableName)}`;
    }

    _createWhereClause(query) {
        let visitor = new Visitor(query.type, this.edm, this.schema);

        return visitor.parse(query.where);
    }

    _escapeIdentifier(value) {
        if (value == null) {
            return value;
        }

        return `[${value.replace(/\"/g, '""')}]`;
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
            offset,
            limit
        );

        parts = parts.filter(this._isNotEmptyFilter);

        return parts.join(" ");

    }

    createCountStatement(query) {
        let parts = [];
        let select = this._createSelectStatementWithCount(query);
        let where = this._createWhereClause(query);

        parts.push(
            select,
            where
        );

        parts = parts.filter(this._isNotEmptyFilter);

        return parts.join(" ");

    }
}