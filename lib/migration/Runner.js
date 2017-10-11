"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Validator = require("./../edm/Validator");

var _Validator2 = _interopRequireDefault(_Validator);

var _Migrator = require("./../edm/Migrator");

var _Migrator2 = _interopRequireDefault(_Migrator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
    edm: null,
    history: [],
    migrator: null,
    decorators: []
};

var Runner = function () {
    function Runner(options) {
        _classCallCheck(this, Runner);

        options = Object.assign({}, defaultOptions, options);

        this.edm = options.edm;
        this.migrator = options.migrator;
        this.edmValidator = new _Validator2.default();
        this.edmMigrator = new _Migrator2.default();
        this.decorators = options.decorators;

        this._executeCommandAsync = this._executeCommandAsync.bind(this);
        this._revertCommandAsync = this._revertCommandAsync.bind(this);

        this._validateOptions(options);
    }

    _createClass(Runner, [{
        key: "_executeCommandAsync",
        value: function _executeCommandAsync(promise, command, index) {
            var _this = this;

            var actionName = command.execute.action + "Async";
            var options = command.execute.options;
            var edm = this.edm;
            var migratorCommand = this.migrator[actionName];
            var consequentialCommands;

            return promise.then(function () {

                _this._validateCommand(command);

                if (typeof migratorCommand !== "function") {
                    throw new Error("'" + _this.migrator.name + "' migrator doesn't support this command. " + actionName);
                }

                return _this.decorators.reduce(function (promise, decorator) {

                    return promise.then(function () {
                        return _this._invokeMethodAsyncWithRecovery(decorator, actionName, [edm, options]);
                    }).then(function (consequentialCommands) {

                        if (Array.isArray(consequentialCommands) && consequentialCommands.length > 0) {
                            return _this.migrateAsync(consequentialCommands);
                        }
                    });
                }, Promise.resolve());
            }).then(function () {
                return migratorCommand.apply(_this.migrator, [edm, options]);
            }).then(function (commands) {
                consequentialCommands = commands;
                return _this.edmMigrator[actionName](edm, options);
            }).then(function () {
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
        key: "_invokeMethodAsyncWithRecovery",
        value: function _invokeMethodAsyncWithRecovery(obj, methodName, args) {
            if (obj && typeof obj[methodName] === "function") {
                var result = void 0;

                try {
                    result = obj[methodName].apply(obj, args);
                } catch (error) {
                    result = null;
                }

                if (!(result instanceof Promise)) {
                    result = Promise.resolve(result);
                }

                return result.catch(function (error) {
                    return null;
                });
            }

            return Promise.resolve();
        }
    }, {
        key: "_revertCommandAsync",
        value: function _revertCommandAsync(promise, command) {
            var _this2 = this;

            var actionName = command.revert.action + "Async";
            var migratorCommand = this.migrator[actionName];

            return promise.then(function () {
                if (typeof migratorCommand !== "function") {
                    throw new Error("Migrator doesn't support this command. " + actionName);
                }

                return migratorCommand.apply(_this2.migrator, [edm, command.revert.options]);
            }).then(function () {
                return _this2.edmMigrator[actionName](edm, command.revert.options);
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
    }, {
        key: "_validateEdm",
        value: function _validateEdm(edm) {
            this.edmValidator.validate(edm);
        }
    }, {
        key: "_validateOptions",
        value: function _validateOptions(options) {
            this._validateEdm(options.edm);
            this._validateMigrator(options.migrator);
        }
    }, {
        key: "_validateMigrator",
        value: function _validateMigrator(migrator) {
            if (typeof migrator.name !== "string") {
                throw new Error("Illegal Argument: Migrators need a name property.");
            }
        }
    }, {
        key: "migrateAsync",
        value: function migrateAsync(commands) {
            var _this3 = this;

            return commands.reduce(this._executeCommandAsync, Promise.resolve()).catch(function (error) {
                var index = commands.length - error.index;

                var reverseCommands = commands.slice(0, index).reverse();

                return reverseCommands.reduce(_this3._revertCommandAsync, Promise.resolve()).catch(function (error) {
                    var modifiedError = Error("Failed to revert commands on a failed migration. Current edm state is corrupted.");
                    modifiedError.stack = error.stack;

                    throw modifiedError;
                }).then(function () {
                    var modifiedError = new Error("Failed Migration. Successfully reverted commands.");
                    modifiedError.stack = error.stack;

                    throw modifiedError;
                });
            });
        }
    }]);

    return Runner;
}();

exports.default = Runner;
//# sourceMappingURL=Runner.js.map