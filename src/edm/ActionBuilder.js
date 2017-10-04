import Action from "./../migration/Action";

export default class ActionBuilder {
    constructor() {

    }

    _createColumn(column) {
        let action = new Action();
        action.execute.action = "addColumn";
        action.execute.options = {
            type: column.type,
            name: column.name,
            label: column.label,
            isPrimaryKey: typeof column.isPrimaryKey === "boolean" ? column.isPrimaryKey : false,
            isAutoIncrement: typeof column.isAutoIncrement === "boolean" ? column.isAutoIncrement : false,
            isNullable: typeof column.isNullable === "boolean" ? column.isNullable : false,
            isIndexed: typeof column.isIndexed === "boolean" ? column.isIndexed : false,
        };
    }

    _createTableAction(table) {
        let action = new Action();
        action.execute.action = "addTable";
        action.execute.options = {
            name: table.name,
            label: table.label,
            pluralLabel: table.pluralLabel
        }

        action.revert.action = "removeTable";
        action.revert.options = {
            tableName: table.name
        }
    }

    createActionsFromEdm(edm) {
        return edm.tables.reduce((accumulator, table) => {

        }, []);
    }
}