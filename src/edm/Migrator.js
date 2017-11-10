import Validator from "./Validator";

const resolvedPromise = Promise.resolve();

const isEqualTo = (left, right) => {
    let leftKeys = Object.keys(left);
    let rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    return leftKeys.every((key) => {
        left[key] === right[key];
    });
}

export default class Migrator {
    constructor(edm) {
        this.validator = new Validator();
        this.name = "Edm Migrator";
        this.edm = edm;
    }

    _doesTableHavePrimaryKey(tableName) {
        let table = this._getTable(tableName);

        return table.columns.find((column) => {
            return column.isPrimaryKey;
        }) != null;
    }

    _getColumn(tableName, columnName) {
        this._throwIfTableDoesNotExist(tableName);

        let columns = this._getTable(tableName).columns;

        return columns.find((column) => {
            return column.name === columnName;
        });
    }

    _getDecorator(tableName, decoratorName) {
        this._throwIfTableDoesNotExist(tableName);
        let table = this._getTable(tableName);

        return table.decorators.find((decorator) => {
            return decorator.name === decoratorName;
        })
    }

    _getTable(name) {
        let tables = this.edm.tables;

        return tables.find((table) => {
            return table.name === name;
        });
    }

    _hasDecorator(tableName, decoratorName) {
        return this._getDecorator(tableName, decoratorName) != null;
    }

    _isEmptyString(string) {
        return string == null || typeof string !== "string" || string === "";
    }

    _setColumn(tableName, columnName, column) {
        this._throwIfColumnDoesNotExist();
        let columns = this._getTable(table).column;

        let index = columns.findIndex((column) => {
            column.name === columnName;
        });

        columns.splice(index, 1, column);
    }

    _setDecorator(decorators, decoratorName, decorator) {
        let index = decorators.findIndex((decorator) => {
            decorator.name === decoratorName;
        });

        decorators.splice(index, 1, decorator);
    }

    _replaceOneToOneRelationship(oldRelationship, newRelationship) {

    }

    _replaceOneToManyRelationship(oldRelationship, newRelationship) {

    }

    _throwIfColumnExist(tableName, columnName) {
        let column = this._getColumn(tableName, columnName);

        if (column != null) {
            throw new Error(`'${columnName}' column already exists.`);
        }
    }

    _throwIfColumnDoesNotExist(tableName, columnName) {
        let column = this._getColumn(tableName, columnName);

        if (column == null) {
            throw new Error(`'${columnName}' column doesn't exists.`);
        }
    }

    _throwIfTableExist(name) {
        let table = this._getTable(name);

        if (table != null) {
            throw new Error(`'${name}' table already exists.`);
        }
    }

    _throwIfTableDoesNotExist(name) {
        let table = this._getTable(name);

        if (table == null) {
            throw new Error(`'${name}' table doesn't exists.`);
        }
    }

    addColumnAsync(options = {}) {
        let table = this._getTable(options.tableName);

        this._throwIfColumnExist(options.tableName, options.column.name);
        this.validator.validateColumn(options.column);

        if (table.columns.length === 0 && !options.column.isPrimaryKey) {
            throw new Error("First column to a table needs to be a primary key.");
        }

        if (this._doesTableHavePrimaryKey(options.tableName) && options.column.isPrimaryKey) {
            throw new Error(`The ${options.tableName} can only have one primary key.`);
        }

        table.columns.push(Object.assign({}, options.column));

        return resolvedPromise;
    }

    addDecoratorAsync(options = {}) {
        this._throwIfTableDoesNotExist(options.tableName);
        let table = this._getTable(options.tableName);

        this.validator.validateDecorator(options.decorator);

        if (this._hasDecorator(table.name, options.decorator.name)) {
            throw new Error(`The '${options.decorator.name}' decorator already exists on the '${options.tableName}' table.`);
        }

        return table.addDecoratorAsync(Object.assign({}, options.decorator));
    }

    addOneToOneRelationshipAsync(options) {
        this.validator.validateOneToOneRelationship(options.relationship);
        this.edm.relationships.oneToOne.push(Object.assign({}, options.relationship));
    }

    addOneToManyRelationshipAsync(options) {
        this.validator.validateOneToManyRelationship(options.relationship);
        this.edm.relationships.oneToMany.push(Object.assign({}, options.relationship));
    }

    addTableAsync(options = {}) {
        this.validator.validateTableDescriptors(options);
        this._throwIfTableExist(options.name);

        this.edm.tables.push({
            name: options.name,
            label: options.label,
            pluralLabel: options.pluralLabel,
            decorators: [],
            columns: options.columns
        });

        return resolvedPromise;
    }

    removeColumnAsync(options = {}) {
        this._throwIfTableDoesNotExist(options.tableName);
        this._throwIfColumnDoesNotExist(options.tableName, options.column.name);

        let table = this._getTable(options.tableName);
        let column = this._getColumn(options.tableName, options.column.name);

        if (column.isPrimaryKey && table.columns.length > 1) {
            throw new Error("Cannot remove the primary key.");
        }

        return resolvedPromise;
    }

    removeDecoratorAsync(options = {}) {
        this._throwIfTableDoesNotExist(options.tableName);
        let table = this._getTable(options.tableName);

        let decorator = this._getDecorator(options.tableName, options.decorator.name);

        if (decorator == null) {
            throw new Error(`The ${options.tableName} doesn't have the ${options.decorator.name} to update.`);
        }

        return table.removeDecoratorAync(options.decorator.name);
    }

    removeTableAsync(options = {}) {
        this._throwIfTableDoesNotExist(options.name);

        let index = this.edm.tables.findIndex((table) => {
            return table.name === options.name;
        });

        this.edm.tables.splice(index, 1);

        return resolvedPromise;
    }

    updateColumnAsync(options = {}) {
        let table = this._getTable(options.tableName);
        this._throwIfTableDoesNotExist(options.tableName);
        this._throwIfColumnDoesNotExist(options.tableName, options.column.name);

        let column = this._getColumn(options.tableName, options.column.name);
        let updatedColumn = Object.assign({}, column, options.column);

        this.validator.validateColumn(updatedColumn);

        if (typeof column.isPrimaryKey === "boolean" && column.isPrimaryKey !== updatedColumn.isPrimaryKey) {
            throw new Error("Once a primary key has been set, you cannot remove it as a primary key. You can however rename its name, label, and pluralLabel.");
        }

        Object.assign(column, updatedColumn);

        return resolvedPromise;
    }

    updateDecoratorAsync(options = {}) {
        this._throwIfTableDoesNotExist(options.tableName);

        let table = this._getTable(options.tableName);
        this.validator.validateDecorator(options.decorator);

        let decorator = this._getDecorator(options.tableName, options.decorator.name);

        if (decorator == null) {
            throw new Error(`The ${options.tableName} doesn't have the ${options.decorator.name} to update.`);
        }

        Object.assign(decorator, options.decorator);

        return resolvedPromise;
    }

    updateTableAsync(options = {}) {
        this._throwIfTableDoesNotExist(options.name);

        let table = this._getTable(options.name);
        this.validator.validateTableDescriptors(Object.assign({}, table, options));

        // We want to make sure that the developer doesn't change the columns and decorators here.
        Object.assign(table, options, { decorators: table.decorators, columns: table.columns });

        return resolvedPromise;
    }

}