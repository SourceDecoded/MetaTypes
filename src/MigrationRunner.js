import EdmValidator from "./EdmValidator";

const defaultOptions = {
    edm: null,
    history: [],
    migrator: null
};

export default class MigrationRunner {
    constructor(options) {
        Object.assign({}, defaultOptions, options);
        this._validateOptions(options);

        this.edm = options.edm;
        this.history = options.history;
        this.migrator = options.migrator;

        this._executeActionAsync = this._executeActionAsync.bind(this);
        this._revertAction = this._revertAction.bind(this);
        this.edmValidator = new EdmValidator();
    }

    _executeActionAsync(promise, action, index) {
        return promise.then(() => {
            this._validateAction(action);

            let actionName = action.execute.action;
            let migratorAction = this.migrator[actionName];

            if (typeof migratorAction !== "function") {
                throw new Error(`'${this.migrator.name}' migrator doesn't support this action. ${actionName}`);
            }

            return migratorAction.apply(this.migrator, [edm, action.execute.options]);


        }).then((consequentialActions) => {
            if (Array.isArray(consequentialActions) && consequentialActions.length > 0) {
                return this.migrateAsync(consequentialActions);
            }
        }).catch((error) => {
            let executionError = new Error(error.message);
            executionError.stack = error.stack;
            executionError.index = index;

            throw executionError;
        });
    }

    _revertAction(promise, action, index) {
        return promise.then(() => {
            let actionName = action.revert.action;
            let migratorAction = this.migrator[actionName];

            if (typeof migratorAction !== "function") {
                throw new Error(`Migrator doesn't support this action. ${actionName}`);
            }

            return migratorAction.apply(this.migrator, [edm, action.revert.options]);
        });
    }

    _validateAction(action) {
        if (typeof action.id !== "string") {
            throw new Error("Actions require an id.");
        }

        if (action.execute == null) {
            throw new Error("Actions require an execute object.");
        }

        if (typeof actions.execute.action !== "string") {
            throw new Error("Actions require an execute object with an action property of type string.");
        }

        if (action.revert == null) {
            throw new Error("Actions require an revert object.");
        }

        if (typeof actions.revert.action !== "string") {
            throw new Error("Actions require an revert object with an action property of type string.");
        }
    }

    _validateEdm(edm) {
        this.edmValidator.validate(edm);
    }

    _validateHistory(history) {
        history.forEach((action) => {
            this._validateAction(action);
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
        All actions return an array of other actions.
    */
    migrateAsync(actions) {
        let passedActionIndex = -1;

        return actions.reduce(this._executeActionAsync, Promise.resolve()).catch((error) => {
            let index = actions.length - error.index;
            return actions.slice().reverse().reduce(this._revertAction, Promise.resolve());
        }).catch((error) => {
            let modifiedError = Error("Failed to revert actions on a failed migration.");
            modifiedError.stack = error.stack;

            throw modifiedError;
        }).then(() => {
            let modifiedError = new Error("Successfully reverted actions on a failed mirgration.");
            modifiedError.stack = error.stack;

            throw modifiedError;
        });

    }
}