import Validator from "./Validator";

const resolvedPromise = Promise.resolve;

export default class Migrator {
    constructor() {
        this.validator = new Validator();
    }

    _doesTableHavePrimaryKey(table) {
        return table.columns.find((column) => {
            return column.isPrimaryKey;
        }) != null;
    }

    _getColumn(columns, name) {
        return columns.find((column) => {
            return column.name === name;
        });
    }

    _getDecorator(table, decoratorName) {
        return table.decorators.find((decorator) => {
            return decorator.name === decoratorName;
        })
    }

    _getTable(tables, name) {
        return tables.find((table) => {
            return table.name === name;
        });
    }

    _hasDecorator(table, decoratorName) {
        return this._getDecorator(table, decoratorName) != null;
    }

    _isEmptyString(string) {
        return string == null || typeof string !== "string" || string === "";
    }

    _throwIfColumnExist(edm, columns, columnName) {
        let column = this._getColumn(columns, columnName);

        if (column != null) {
            throw new Error(`'${columnName}' column already exists.`);
        }
    }

    _throwIfColumnDoesNotExist(edm, columns, columnName) {
        let column = this._getColumn(columns, columnName);

        if (column == null) {
            throw new Error(`'${columnName}' column doesn't exists.`);
        }
    }

    _throwIfTableExist(edm, name) {
        let table = this._getTable(edm.tables, name);

        if (table != null) {
            throw new Error(`'${name}' table already exists.`);
        }
    }

    _throwIfTableDoesNotExist(edm, name) {
        let table = this._getTable(edm.tables, name);

        if (table == null) {
            throw new Error(`'${name}' table doesn't exists.`);
        }
    }

    addColumnAsync(edm, options = {}) {
        let table = this._getTable(edm.tables, options.tableName);
        this._throwIfColumnExist(edm, table.columns, options.column.name);

        this.validator.validateColumn(options.column);

        if (table.columns.length === 0 && !options.column.isPrimaryKey) {
            throw new Error("First column to a table needs to be a primary key.");
        }

        if (this._doesTableHavePrimaryKey(table) && options.column.isPrimaryKey) {
            throw new Error(`The ${options.table} can only have one primary key.`);
        }

        table.columns.push(options.column);

        return resolvedPromise;
    }

    addDecoratorAsync(edm, options = {}) {
        let table = this._getTable(edm.tables, options.tableName);
        this._throwIfTableDoesNotExist(edm, options.tableName);

        this.validator.validateDecorator(options.decorator);

        if (this._hasDecorator(table, options.decorator.name)) {
            throw new Error(`The '${options.decorator.name}' decorator already exists on the '${options.tableName}' table.`);
        }

        table.decorators.push(options.decorator);

        return resolvedPromise;
    }

    addTableAsync(edm, options = {}) {
        this.validator.validateTableDescriptors(options);
        this._throwIfTableExist(edm, options.name);

        edm.tables.push({
            name: options.name,
            label: options.label,
            pluralLabel: options.pluralLabel,
            decorators: [],
            columns: []
        });

        return resolvedPromise;
    }

    removeColumnAsync(edm, options = {}) {
        let table = this._getTable(edm.tables, options.tableName);
        this._throwIfTableDoesNotExist(edm, table.columns, options.columnName);

        let column = this._getColumn(table.columns, options.columnName);

        if (column.isPrimaryKey) {
            throw new Error("Cannot remove the primary key.");
        }

        return resolvedPromise;
    }

    removeDecoratorAsync(edm, options = {}) {
        let table = this._getTable(edm.tables, options.tableName);
        this._throwIfTableDoesNotExist(edm, options.tableName);

        let decorator = this._getDecorator(table, options.decoratorName);

        if (decorator == null) {
            throw new Error(`The ${options.tableName} doesn't have the ${options.decorator.name} to update.`);
        }

        let index = table.decorators.findIndex((decorator) => {
            return decorator.name === options.decoratorName;
        });

        table.decorators.splice(index, 1);

        return resolvedPromise;
    }

    removeTableAsync(edm, options = {}) {
        this._throwIfTableDoesNotExist(edm, options.name);

        let index = edm.tables.findIndex((table) => {
            return table.name === options.name;
        });

        edm.tables.splice(index, 1);

        return resolvedPromise;
    }

    updateColumnAsync(edm, options = {}) {
        let table = this._getTable(edm.tables, options.tableName);
        this._throwIfTableDoesNotExist(edm, table.columns, options.columnName);

        let column = this._getColumn(table.columns, options.columnName);
        let updatedColumn = Object.assign({}, column, options.column);

        this.validator.validateColumn(updatedColumn);

        if (typeof column.isPrimaryKey === "boolean" && column.isPrimaryKey !== updatedColumn.isPrimaryKey) {
            throw new Error("Once a primary key has been set, you cannot remove it as a primary key. You can however rename its name, label, and pluralLabel.");
        }

        Object.assign(column, updatedColumn);

        return resolvedPromise;
    }

    updateDecoratorAsync(edm, options = {}) {
        let table = this._getTable(edm.tables, options.tableName);
        this._throwIfTableDoesNotExist(edm, options.tableName);

        this.validator.validateDecorator(options.decorator);

        let decorator = this._getDecorator(table, options.decorator.name);

        if (decorator == null) {
            throw new Error(`The ${options.tableName} doesn't have the ${options.decorator.name} to update.`);
        }

        Object.assign(decorator, options.decorator);

        return resolvedPromise;
    }

    updateTableAsync(edm, options = {}) {
        this._throwIfTableDoesNotExist(edm, options.name);

        let table = this._getTable(edm.tables, options.name);
        this.validator.validateTableDescriptors(Object.assign({}, table, options));

        // We want to make sure that the developer doesn't change the columns and decorators here.
        Object.assign(table, options, { decorators: table.decorators, columns: table.columns });

        return resolvedPromise;
    }

}