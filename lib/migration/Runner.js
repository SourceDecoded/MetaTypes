"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Validator = require("./../edm/Validator");

var _Validator2 = _interopRequireDefault(_Validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
    edm: null,
    history: [],
    migrator: null
};

var Runner = function () {
    function Runner(options) {
        _classCallCheck(this, Runner);

        Object.assign({}, defaultOptions, options);

        this._validateOptions(options);

        this.edm = options.edm;
        this.migrator = options.migrator;
        this.edmValidator = new _Validator2.default();

        this._executeCommandAsync = this._executeCommandAsync.bind(this);
        this._revertCommandAsync = this._revertCommandAsync.bind(this);
        this._recoverMigrationAsync = this._recoverMigrationAsync.bind(this);
    }

    _createClass(Runner, [{
        key: "_executeCommandAsync",
        value: function _executeCommandAsync(promise, command, index) {
            var _this = this;

            return promise.then(function () {
                _this._validateCommand(command);

                var commandName = command.execute.command;
                var migratorCommand = _this.migrator[commandName + "Async"];

                if (typeof migratorCommand !== "function") {
                    throw new Error("'" + _this.migrator.name + "' migrator doesn't support this command. " + commandName);
                }

                return migratorCommand.apply(_this.migrator, [edm, command.execute.options]);
            }).then(function (consequentialCommands) {
                if (Array.isArray(consequentialCommands) && consequentialCommands.length > 0) {
                    return _this.migrateAsync(consequentialCommands);
                }
            }).catch(function (error) {
                var executionError = new Error(error.message);
                executionError.stack = error.stack;
                executionError.index = index;

                throw executionError;
            });
        }
    }, {
        key: "_recoverMigrationAsync",
        value: function _recoverMigrationAsync(error) {
            var index = commands.length - error.index;

            var reverseCommands = commands.slice().reverse();

            return reverseCommands.reduce(this._revertCommandAsync, Promise.resolve()).catch(function (error) {
                var modifiedError = Error("Failed to revert commands on a failed migration.");
                modifiedError.stack = error.stack;

                throw modifiedError;
            }).then(function () {
                var modifiedError = new Error("Failed Migration. Successfully reverted commands.");
                modifiedError.stack = error.stack;

                throw modifiedError;
            });
        }
    }, {
        key: "_revertCommandAsync",
        value: function _revertCommandAsync(promise, command) {
            var _this2 = this;

            return promise.then(function () {
                var commandName = command.revert.command;
                var migratorCommand = _this2.migrator[commandName + "Async"];

                if (typeof migratorCommand !== "function") {
                    throw new Error("Migrator doesn't support this command. " + commandName);
                }

                return migratorCommand.apply(_this2.migrator, [edm, command.revert.options]);
            });
        }
    }, {
        key: "_validateCommand",
        value: function _validateCommand(command) {
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
    }, {
        key: "_validateEdm",
        value: function _validateEdm(edm) {
            this.edmValidator.validate(edm);
        }
    }, {
        key: "_validateHistory",
        value: function _validateHistory(history) {
            var _this3 = this;

            history.forEach(function (command) {
                _this3._validateCommand(command);
            });
        }
    }, {
        key: "_validateOptions",
        value: function _validateOptions(options) {
            this._validateEdm(options.edm);
            this._validateHistory(options.history);
            this._validateMigrator(options.migrator);
        }
    }, {
        key: "_validateMigrator",
        value: function _validateMigrator(migrator) {
            if (typeof migrator.name !== "string") {
                throw new Error("Illegal Argument: Migrators need a name property.");
            }
        }

        /*
            All commands return an array of other commands.
        */

    }, {
        key: "migrateAsync",
        value: function migrateAsync(commands) {
            return commands.reduce(this._executeCommandAsync, Promise.resolve()).catch(this._recoverMigrationAsync);
        }
    }]);

    return Runner;
}();

exports.default = Runner;
//# sourceMappingURL=Runner.js.map