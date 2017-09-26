export default class EdmMigrator {
    constructor() {
    }

    _getTable(tables, name) {
        return this.tables.find((table) => {
            return table.name === name;
        });
    }

    _throwIfTableExist(name) {
        let index = edm.tables.findIndex((table) => {
            return table.name === name;
        });

        if (index > -1) {
            throw new Error(`'${name}' table already exists.`);
        }
    }

    _throwIfTableDoesNotExist(name) {
        let index = edm.tables.findIndex((table) => {
            return table.name === name;
        });

        if (index === -1) {
            throw new Error(`'${name}' table doesn't exists.`);
        }
    }

    _validateNewTableOptions(options) {
        if (typeof options.name !== "string") {
            throw new Error(`Illegal Argument: options.name needs to be a string.`);
        }

        if (typeof options.label !== "string") {
            throw new Error(`Illegal Argument: options.label needs to be a string.`);
        }

        if (typeof options.pluralLabel !== "string") {
            throw new Error(`Illegal Argument: options.pluralLabel needs to be a string.`);
        }
    }

    _validateUpdateTableOptions(options) {
        if (options.name != null && typeof options.name !== "string") {
            throw new Error(`Illegal Argument: options.name needs to be a string.`);
        }

        if (options.label != null && typeof options.label !== "string") {
            throw new Error(`Illegal Argument: options.label needs to be a string.`);
        }

        if (options.pluralLabel != null && typeof options.pluralLabel !== "string") {
            throw new Error(`Illegal Argument: options.pluralLabel needs to be a string.`);
        }
    }

    addTableAsync(edm, options) {
        this._validateNewTableOptions(options);
        this._throwIfTableExist(options.name);

        edm.tables.push({
            name: options.name,
            label: options.label,
            pluralLabel: options.pluralLabel,
            decorators: []
        });
    }

    updateTableAsync(edm, options) {
        this._validateUpdateTableOptions(options);
        this._throwIfTableDoesNotExist(options.name);

        let table = this._getTable(edm.tables, options.name);
        table.name = options.update.name != null ? options.update.name : table.name;
        table.label = options.update.label != null ? options.update.label : table.label;
        table.pluralLabel = options.update.pluralLabel != null ? options.update.pluralLabel : table.pluralLabel;
    }

    removeTableAsync(edm, options) {
        this._throwIfTableDoesNotExist(options.name);

        let index = edm.tables.findIndex((table) => {
            return table.name === options.name;
        });

        edm.tables.splice(index, 1);
    }
}