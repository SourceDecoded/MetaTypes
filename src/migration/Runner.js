import Validator from "./../edm/Validator";

const defaultOptions = {
    edm: null,
    history: [],
    migrator: null
};

export default class Runner {
    constructor(options) {
        Object.assign({}, defaultOptions, options);

        this._validateOptions(options);

        this.edm = options.edm;
        this.migrator = options.migrator;
        this.edmValidator = new Validator();

        this._executeCommandAsync = this._executeCommandAsync.bind(this);
        this._revertCommandAsync = this._revertCommandAsync.bind(this);
        this._recoverMigrationAsync = this._recoverMigrationAsync.bind(this);
    }

    _executeCommandAsync(promise, command, index) {
        return promise.then(() => {
            this._validateCommand(command);

            let commandName = command.execute.command;
            let migratorCommand = this.migrator[commandName + "Async"];

            if (typeof migratorCommand !== "function") {
                throw new Error(`'${this.migrator.name}' migrator doesn't support this command. ${commandName}`);
            }

            return migratorCommand.apply(this.migrator, [edm, command.execute.options]);


        }).then((consequentialCommands) => {
            if (Array.isArray(consequentialCommands) && consequentialCommands.length > 0) {
                return this.migrateAsync(consequentialCommands);
            }
        }).catch((error) => {
            let executionError = new Error(error.message);
            executionError.stack = error.stack;
            executionError.index = index;

            throw executionError;
        });
    }

    _recoverMigrationAsync(error) {
        let index = commands.length - error.index;

        let reverseCommands = commands.slice().reverse();

        return reverseCommands.reduce(this._revertCommandAsync, Promise.resolve()).catch((error) => {
            let modifiedError = Error("Failed to revert commands on a failed migration.");
            modifiedError.stack = error.stack;

            throw modifiedError;
        }).then(() => {
            let modifiedError = new Error("Failed Migration. Successfully reverted commands.");
            modifiedError.stack = error.stack;

            throw modifiedError;
        });

    }

    _revertCommandAsync(promise, command) {
        return promise.then(() => {
            let commandName = command.revert.command;
            let migratorCommand = this.migrator[commandName + "Async"];

            if (typeof migratorCommand !== "function") {
                throw new Error(`Migrator doesn't support this command. ${commandName}`);
            }

            return migratorCommand.apply(this.migrator, [edm, command.revert.options]);
        });
    }

    _validateCommand(command) {
        if (typeof command.id !== "string") {
            throw new Error("Commands require an id.");
        }

        if (command.execute == null) {
            throw new Error("Commands require an execute object.");
        }

        if (typeof commands.execute.command !== "string") {
            throw new Error("Commands require an execute object with an command property of type string.");
        }

        if (command.revert == null) {
            throw new Error("Commands require an revert object.");
        }

        if (typeof commands.revert.command !== "string") {
            throw new Error("Commands require an revert object with an command property of type string.");
        }
    }

    _validateEdm(edm) {
        this.edmValidator.validate(edm);
    }

    _validateHistory(history) {
        history.forEach((command) => {
            this._validateCommand(command);
        });
    }

    _validateOptions(options) {
        this._validateEdm(options.edm);
        this._validateHistory(options.history);
        this._validateMigrator(options.migrator);
    }

    _validateMigrator(migrator) {
        if (typeof migrator.name !== "string") {
            throw new Error("Illegal Argument: Migrators need a name property.");
        }
    }

    /*
        All commands return an array of other commands.
    */
    migrateAsync(commands) {
        return commands.reduce(this._executeCommandAsync, Promise.resolve()).catch(this._recoverMigrationAsync);
    }
}