import Command from "./../migration/Command";

export default class CommandBuilder {
    constructor() {

    }

    createAddColumn(column) {
        let command = new Command();
        command.execute.action = "addColumn";
        command.execute.options = {
            type: column.type,
            name: column.name,
            label: column.label,
            isPrimaryKey: typeof column.isPrimaryKey === "boolean" ? column.isPrimaryKey : false,
            isAutoIncrement: typeof column.isAutoIncrement === "boolean" ? column.isAutoIncrement : false,
            isNullable: typeof column.isNullable === "boolean" ? column.isNullable : false,
            isIndexed: typeof column.isIndexed === "boolean" ? column.isIndexed : false
        };

        command.revert.action = "removeColumn";
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

    createAddTableCommand(table) {
        let command = new Command();
        command.execute.action = "addTable";
        command.execute.options = {
            name: table.name,
            label: table.label,
            pluralLabel: table.pluralLabel
        }

        command.revert.action = "removeTable";
        command.revert.options = {
            name: table.name,
            label: table.label,
            pluralLabel: table.pluralLabel
        }
    }

    createCommandsFromEdm(edm) {
        return edm.tables.reduce((accumulator, table) => {

        }, []);
    }
}