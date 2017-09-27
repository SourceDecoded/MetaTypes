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

        this._executeActionAsync = this._executeActionAsync.bind(this);
        this._revertActionAsync = this._revertActionAsync.bind(this);
        this._recoverMigrationAsync = this._recoverMigrationAsync.bind(this);
    }

    _createClass(Runner, [{
        key: "_executeActionAsync",
        value: function _executeActionAsync(promise, action, index) {
            var _this = this;

            return promise.then(function () {
                _this._validateAction(action);

                var actionName = action.execute.action;
                var migratorAction = _this.migrator[actionName];

                if (typeof migratorAction !== "function") {
                    throw new Error("'" + _this.migrator.name + "' migrator doesn't support this action. " + actionName);
                }

                return migratorAction.apply(_this.migrator, [edm, action.execute.options]);
            }).then(function (consequentialActions) {
                if (Array.isArray(consequentialActions) && consequentialActions.length > 0) {
                    return _this.migrateAsync(consequentialActions);
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
            var index = actions.length - error.index;

            var reverseActions = actions.slice().reverse();

            return reverseActions.reduce(this._revertActionAsync, Promise.resolve()).catch(function (error) {
                var modifiedError = Error("Failed to revert actions on a failed migration.");
                modifiedError.stack = error.stack;

                throw modifiedError;
            }).then(function () {
                var modifiedError = new Error("Failed Migration. Successfully reverted actions.");
                modifiedError.stack = error.stack;

                throw modifiedError;
            });
        }
    }, {
        key: "_revertActionAsync",
        value: function _revertActionAsync(promise, action) {
            var _this2 = this;

            return promise.then(function () {
                var actionName = action.revert.action;
                var migratorAction = _this2.migrator[actionName];

                if (typeof migratorAction !== "function") {
                    throw new Error("Migrator doesn't support this action. " + actionName);
                }

                return migratorAction.apply(_this2.migrator, [edm, action.revert.options]);
            });
        }
    }, {
        key: "_validateAction",
        value: function _validateAction(action) {
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
    }, {
        key: "_validateEdm",
        value: function _validateEdm(edm) {
            this.edmValidator.validate(edm);
        }
    }, {
        key: "_validateHistory",
        value: function _validateHistory(history) {
            var _this3 = this;

            history.forEach(function (action) {
                _this3._validateAction(action);
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
            All actions return an array of other actions.
        */

    }, {
        key: "migrateAsync",
        value: function migrateAsync(actions) {
            return actions.reduce(this._executeActionAsync, Promise.resolve()).catch(this._recoverMigrationAsync);
        }
    }]);

    return Runner;
}();

exports.default = Runner;
//# sourceMappingURL=Runner.js.map