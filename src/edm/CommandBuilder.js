import Command from "./../migration/Command";
import Validator from "./../edm/Validator";

export default class CommandBuilder {
    constructor() {
        this.edmValidator = new Validator();
    }

    createAddColumnCommand(column) {
        this.edmValidator.validateColumn(column);

        let command = new Command();
        let options = column;

        command.execute.action = "addColumn";
        command.execute.options = options

        command.revert.action = "removeColumn";
        command.revert.options = options;

        return command;
    }

    createAddDecoratorCommand(decorator) {
        this.edmValidator.validateDecorator(decorator);

        let command = new Command();
        let options = decorator;

        if (typeof options.name != "string") {
            throw new Error("Decorators need to have a name.");
        }

        command.execute.action = "addDecorator";
        command.execute.options = options;

        command.revert.action = "removeDecorator";
        command.revert.options = options;

        return command;
    }

    createAddOneToOneRelationshipCommand(relationship) {
        this.edmValidator.validateOneToOneRelationship(relationship);

        let command = new Command();
        let options = relationship;

        command.execute.action = "addOneToOneRelationship";
        command.execute.options = options;

        command.revert.action = "removeOneToOneRelationship";
        command.revert.options = options;

        return command;
    }

    createAddOneToManyRelationshipCommand(relationship) {
        this.edmValidator.validateOneToManyRelationship(relationship);

        let command = new Command();
        let options = relationship;

        command.execute.action = "addOneToManyRelationship";
        command.execute.options = options;

        command.revert.action = "removeOneToManyRelationship";
        command.revert.options = options;

        return command;
    }

    createAddTableCommand(table) {
        this.edmValidator.validateTableDescriptors(table);

        let command = new Command();
        let options = table;

        command.execute.action = "addTable";
        command.execute.options = options;

        command.revert.action = "removeTable";
        command.revert.options = options;

        return command;
    }

    createRemoveColumnCommand(column) {
        this.edmValidator.validateColumn(column);

        let command = new Command();
        let options = column;

        command.execute.action = "removeColumn";
        command.execute.options = options

        command.revert.action = "addColumn";
        command.revert.options = options;

        return command;
    }

    createRemoveDecoratorCommand(decorator) {
        this.edmValidator.validateDecorator(decorator);

        let command = new Command();
        let options = decorator;

        if (typeof options.name != "string") {
            throw new Error("Decorators need to have a name.");
        }

        command.execute.action = "removeDecorator";
        command.execute.options = options;

        command.revert.action = "addDecorator";
        command.revert.options = options;

        return command;
    }

    createRemoveOneToOneRelationshipCommand(relationship) {
        this.edmValidator.validateOneToOneRelationship(relationship);

        let command = new Command();
        let options = relationship;

        command.execute.action = "removeOneToOneRelationship";
        command.execute.options = options;

        command.revert.action = "addOneToOneRelationship";
        command.revert.options = options;

        return command;
    }

    createRemoveOneToManyRelationshipCommand(relationship) {
        this.edmValidator.validateOneToManyRelationship(relationship);

        let command = new Command();
        let options = relationship;

        command.execute.action = "removeOneToManyRelationship";
        command.execute.options = options;

        command.revert.action = "addOneToManyRelationship";
        command.revert.options = options;

        return command;
    }

    createRemoveTableCommand(table) {
        this.edmValidator.validateTableDescriptors(table);

        let command = new Command();
        let options = table;

        command.execute.action = "removeTable";
        command.execute.options = options;

        command.revert.action = "addTable";
        command.revert.options = options;

        return command;
    }

    createUpdateColumnCommand(oldColumn, newColumn) {
        this.edmValidator.validateColumn(oldColumn);
        this.edmValidator.validateColumn(newColumn);

        let command = new Command();

        command.execute.action = "updateColumn";
        command.execute.options = newColumn

        command.revert.action = "updateColumn";
        command.revert.options = oldColumn;

        return command;
    }

    createUpdateDecoratorCommand(oldDecorator, newDecorator) {
        this.edmValidator.validateDecorator(oldDecorator);
        this.edmValidator.validateDecorator(newDecorator);

        let command = new Command();

        command.execute.action = "updateDecorator";
        command.execute.options = newDecorator;

        command.revert.action = "updateDecorator";
        command.revert.options = oldDecorator;

        return command;
    }

    createUpdateOneToOneCommand(oldOneToOneRelationship, newOneToOneRelationship) {
        this.edmValidator.validateOneToOneRelationship(oldOneToOneRelationship);
        this.edmValidator.validateOneToOneRelationship(newOneToOneRelationship);

        let command = new Command();

        command.execute.action = "updateOneToOneRelationship";
        command.execute.options = newOneToOneRelationship;

        command.revert.action = "updateOneToOneRelationship";
        command.revert.options = oldOneToOneRelationship;

        return command;
    }

    createUpdateOneToManyCommand(oldOneToManyRelationship, newOneToManyRelationship) {
        this.edmValidator.validateOneToOneRelationship(oldOneToManyRelationship);
        this.edmValidator.validateOneToOneRelationship(newOneToManyRelationship);

        let command = new Command();

        command.execute.action = "updateOneToManyRelationship";
        command.execute.options = newOneToManyRelationship;

        command.revert.action = "updateOneToManyRelationship";
        command.revert.options = oldOneToManyRelationship;

        return command;
    }

    createUpdateTableCommand(oldTable, newTable) {
        this.edmValidator.validateTableDescriptors(oldTable);
        this.edmValidator.validateTableDescriptors(newTable);

        let command = new Command();
        let options = table;

        command.execute.action = "removeTable";
        command.execute.options = newTable;

        command.revert.action = "addTable";
        command.revert.options = oldTable;

        return command;
    }

    createCommandsFromEdm(edm) {
        return edm.tables.reduce((accumulator, table) => {

        }, []);
    }
}