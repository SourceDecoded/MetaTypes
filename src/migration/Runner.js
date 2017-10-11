import Validator from "./../edm/Validator";
import Migrator from "./../edm/Migrator";

const defaultOptions = {
    edm: null,
    history: [],
    migrator: null,
    decorators: []
};

export default class Runner {
    constructor(options) {
        options = Object.assign({}, defaultOptions, options);

        this.edm = options.edm;
        this.migrator = options.migrator;
        this.edmValidator = new Validator();
        this.edmMigrator = new Migrator();
        this.decorators = options.decorators;

        this._executeCommandAsync = this._executeCommandAsync.bind(this);
        this._revertCommandAsync = this._revertCommandAsync.bind(this);

        this._validateOptions(options);

    }

    _executeCommandAsync(promise, command, index) {
        let actionName = `${command.execute.action}Async`;
        let options = command.execute.options;
        let edm = this.edm;
        let migratorCommand = this.migrator[actionName];
        var consequentialCommands;

        return promise.then(() => {

            this._validateCommand(command);

            if (typeof migratorCommand !== "function") {
                throw new Error(`'${this.migrator.name}' migrator doesn't support this command. ${actionName}`);
            }

            return this.decorators.reduce((promise, decorator) => {

                return promise.then(() => {
                    return this._invokeMethodAsyncWithRecovery(decorator, actionName, [edm, options])
                }).then((consequentialCommands) => {

                    if (Array.isArray(consequentialCommands) && consequentialCommands.length > 0) {
                        return this.migrateAsync(consequentialCommands);
                    }

                });

            }, Promise.resolve());

        }).then(() => {
            return migratorCommand.apply(this.migrator, [edm, options]);
        }).then((commands) => {
            consequentialCommands = commands;
            return this.edmMigrator[actionName](edm, options);
        }).then(() => {
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

    _invokeMethodAsyncWithRecovery(obj, methodName, args) {
        if (obj && typeof obj[methodName] === "function") {
            let result;

            try {
                result = obj[methodName].apply(obj, args);
            } catch (error) {
                result = null;
            }

            if (!(result instanceof Promise)) {
                result = Promise.resolve(result);
            }

            return result.catch((error) => {
                return null;
            });
        }

        return Promise.resolve();
    }

    _revertCommandAsync(promise, command) {
        let edm = this.edm;
        let actionName = `${command.revert.action}Async`;
        let migratorCommand = this.migrator[actionName];

        return promise.then(() => {
            if (typeof migratorCommand !== "function") {
                throw new Error(`Migrator doesn't support this command. ${actionName}`);
            }

            return migratorCommand.apply(this.migrator, [edm, command.revert.options]);
        }).then(() => {
            return this.edmMigrator[actionName](edm, command.revert.options);
        });
    }

    _validateCommand(command) {
        if (typeof command.id !== "string") {
            throw new Error("Commands require an id.");
        }

        if (command.execute == null) {
            throw new Error("Commands require an execute object.");
        }

        if (typeof command.execute.action !== "string") {
            throw new Error("Commands require an execute object with an command property of type string.");
        }

        if (command.revert == null) {
            throw new Error("Commands require an revert object.");
        }

        if (typeof command.revert.action !== "string") {
            throw new Error("Commands require an revert object with an command property of type string.");
        }
    }

    _validateEdm(edm) {
        this.edmValidator.validate(edm);
    }

    _validateOptions(options) {
        this._validateEdm(options.edm);
        this._validateMigrator(options.migrator);
    }

    _validateMigrator(migrator) {
        if (typeof migrator.name !== "string") {
            throw new Error("Illegal Argument: Migrators need a name property.");
        }
    }

    migrateAsync(commands) {
        return commands.reduce(this._executeCommandAsync, Promise.resolve()).catch((error) => {
            let index = error.index;

            let reverseCommands = commands.slice(0, index).reverse();

            return reverseCommands.reduce(this._revertCommandAsync, Promise.resolve()).catch((error) => {
                let modifiedError = Error("Failed to revert commands on a failed migration. Current edm state is corrupted.");
                modifiedError.stack = error.stack;

                throw modifiedError;
            }).then(() => {
                let modifiedError = new Error("Failed Migration. Successfully reverted commands.");
                modifiedError.stack = error.stack;

                throw modifiedError;
            });

        });
    }
}