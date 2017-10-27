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
        this.edmMigrator = new _Migrator2.default(this.edm);
        this.decorators = options.decorators;

        this._executeCommandAsync = this._executeCommandAsync.bind(this);
        this._revertCommandAsync = this._revertCommandAsync.bind(this);

        this._validateOptions(options);
    }

    _createClass(Runner, [{
        key: "_executeCommandAsync",
        value: function _executeCommandAsync(promise, command, consequentialCommands) {
            var _this = this;

            var actionName = command.execute.action + "Async";
            var options = command.execute.options;
            var migratorCommand = this.migrator[actionName];

            return promise.then(function () {

                _this._validateCommand(command);

                if (typeof migratorCommand !== "function") {
                    throw new Error("'" + _this.migrator.name + "' migrator doesn't support this command. " + actionName);
                }

                return _this.decorators.reduce(function (promise, decorator) {

                    return promise.then(function () {
                        return _this._invokeMethodAsyncWithRecovery(decorator, actionName, [options]);
                    }).then(function (commands) {

                        if (Array.isArray(commands)) {
                            commands.forEach(function (command) {
                                consequentialCommands.push(command);
                            });
                        }
                    });
                }, Promise.resolve());
            }).then(function () {
                return migratorCommand.apply(_this.migrator, [_this.edm, options]);
            }).then(function (commands) {

                if (Array.isArray(commands)) {
                    commands.forEach(function (command) {
                        consequentialCommands.push(command);
                    });
                }

                return _this.edmMigrator[actionName](options);
            }).catch(function (error) {
                var executionError = new Error(error.message);
                executionError.inner = error;

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
                    throw new Error("The " + _this2.migrator + " migrator doesn't support this command. " + actionName);
                }

                return migratorCommand.apply(_this2.migrator, [command.revert.options]);
            }).then(function () {
                return _this2.edmMigrator[actionName](command.revert.options);
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

            if (commands.length === 0) {
                return Promise.resolve();
            }

            var commandsCopy = commands.slice();
            var consequentialCommands = [];
            var promise = Promise.resolve();

            var _loop = function _loop() {
                var command = commandsCopy.shift();

                promise = _this3._executeCommandAsync(promise, command, consequentialCommands).catch(function (error) {
                    commandsCopy.unshift(command);
                    throw error;
                });
            };

            while (commandsCopy.length > 0) {
                _loop();
            }

            return promise.then(function () {
                return _this3.migrateAsync(consequentialCommands);
            }).catch(function (error) {

                var index = commands.length - commandsCopy.length;
                var reverseCommands = commands.slice(0, index).reverse();

                return reverseCommands.reduce(_this3._revertCommandAsync, Promise.resolve()).catch(function (revertError) {
                    var modifiedError = Error("Failed to revert commands on a failed migration. Current edm state is corrupted.");
                    modifiedError.revertError = revertError;
                    modifiedError.innerError = error;

                    throw modifiedError;
                }).then(function () {
                    var modifiedError = new Error("Failed Migration. Successfully reverted commands.");
                    modifiedError.innerError = error;

                    throw modifiedError;
                });
            });
        }
    }]);

    return Runner;
}();

exports.default = Runner;
//# sourceMappingURL=Runner.js.map