import Command from "./../migration/Command";

export default class CommandBuilder {
    constructor() {

    }

    _createColumn(column) {
        let command = new Command();
        command.execute.command = "addColumn";
        command.execute.options = {
            type: column.type,
            name: column.name,
            label: column.label,
            isPrimaryKey: typeof column.isPrimaryKey === "boolean" ? column.isPrimaryKey : false,
            isAutoIncrement: typeof column.isAutoIncrement === "boolean" ? column.isAutoIncrement : false,
            isNullable: typeof column.isNullable === "boolean" ? column.isNullable : false,
            isIndexed: typeof column.isIndexed === "boolean" ? column.isIndexed : false
        };

        command.revert.command = "removeColumn";
        command.revert.options = {
            type: column.type,
            name: column.name,
            label: column.label,
            isPrimaryKey: typeof column.isPrimaryKey === "boolean" ? column.isPrimaryKey : false,
            isAutoIncrement: typeof column.isAutoIncrement === "boolean" ? column.isAutoIncrement : false,
            isNullable: typeof column.isNullable === "boolean" ? column.isNullable : false,
            isIndexed: typeof column.isIndexed === "boolean" ? column.isIndexed : false
        };
    }

    _createTableCommand(table) {
        let command = new Command();
        command.execute.command = "addTable";
        command.execute.options = {
            name: table.name,
            label: table.label,
            pluralLabel: table.pluralLabel
        }

        command.revert.command = "removeTable";
        command.revert.options = {
            tableName: table.name
        }
    }

    createCommandsFromEdm(edm) {
        return edm.tables.reduce((accumulator, table) => {

        }, []);
    }
}