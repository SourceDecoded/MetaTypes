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
        this.edmMigrator = new Migrator(this.edm);
        this.decorators = options.decorators;

        this._executeCommandAsync = this._executeCommandAsync.bind(this);
        this._revertCommandAsync = this._revertCommandAsync.bind(this);

        this._validateOptions(options);

    }

    _executeCommandAsync(promise, command, consequentialCommands) {
        let actionName = `${command.execute.action}Async`;
        let options = command.execute.options;
        let migratorCommand = this.migrator[actionName];

        return promise.then(() => {

            this._validateCommand(command);

            if (typeof migratorCommand !== "function") {
                throw new Error(`'${this.migrator.name}' migrator doesn't support this command. ${actionName}`);
            }

            return this.decorators.reduce((promise, decorator) => {

                return promise.then(() => {
                    return this._invokeMethodAsyncWithRecovery(decorator, actionName, [this.edm, options])
                }).then((commands) => {

                    if (Array.isArray(commands)) {
                        commands.forEach((command) => {
                            consequentialCommands.push(command);
                        });
                    }

                });

            }, Promise.resolve());

        }).then(() => {
            return this._invokeMethodAsync(this.migrator, actionName, [this.edm, options]);
        }).then((commands) => {

            if (Array.isArray(commands)) {
                commands.forEach((command) => {
                    consequentialCommands.push(command);
                });
            }

            return this._invokeMethodAsync(this.edmMigrator, actionName, [options]);
        }).catch((error) => {
            let executionError = new Error(error.message);
            executionError.inner = error;

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

    _invokeMethodAsync(obj, methodName, args) {
        if (obj && typeof obj[methodName] === "function") {
            let result;

            result = obj[methodName].apply(obj, args);
            
            if (!(result instanceof Promise)) {
                result = Promise.resolve(result);
            }

            return result;
        }

        return Promise.resolve();
    }

    _revertCommandAsync(promise, command) {
        let actionName = `${command.revert.action}Async`;
        let migratorCommand = this.migrator[actionName];

        return promise.then(() => {
            if (typeof migratorCommand !== "function") {
                throw new Error(`The ${this.migrator} migrator doesn't support this command. ${actionName}`);
            }

            return migratorCommand.apply(this.migrator, [command.revert.options]);
        }).then(() => {
            return this.edmMigrator[actionName](command.revert.options);
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
        if (commands.length === 0) {
            return Promise.resolve();
        }

        let commandsCopy = commands.slice();
        let consequentialCommands = [];
        let promise = Promise.resolve();

        while (commandsCopy.length > 0) {
            let command = commandsCopy.shift();

            promise = this._executeCommandAsync(promise, command, consequentialCommands).catch((error) => {
                commandsCopy.unshift(command);
                throw error;
            });
        }

        return promise.then(() => {
            return this.migrateAsync(consequentialCommands);
        }).catch((error) => {

            let index = commands.length - commandsCopy.length;
            let reverseCommands = commands.slice(0, index).reverse();

            return reverseCommands.reduce(this._revertCommandAsync, Promise.resolve()).catch((revertError) => {
                let modifiedError = Error("Failed to revert commands on a failed migration. Current edm state is corrupted.");
                modifiedError.revertError = revertError;
                modifiedError.innerError = error;

                throw modifiedError;
            }).then(() => {
                let modifiedError = new Error("Failed Migration. Successfully reverted commands.");
                modifiedError.innerError = error;

                throw modifiedError;
            });

        });

    }
}