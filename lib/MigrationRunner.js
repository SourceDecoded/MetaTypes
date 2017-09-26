"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EdmValidator = require("./EdmValidator");

var _EdmValidator2 = _interopRequireDefault(_EdmValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
    edm: null,
    history: [],
    migrator: null
};

var edmValidator = new _EdmValidator2.default();

var MigrationRunner = function () {
    function MigrationRunner(options) {
        _classCallCheck(this, MigrationRunner);

        Object.assign({}, defaultOptions, options);
        this._validateOptions(options);

        this.edm = options.edm;
        this.history = options.history;
        this.migrator = options.migrator;
    }

    _createClass(MigrationRunner, [{
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
            edmValidator.validate(edm);
        }
    }, {
        key: "_validateHistory",
        value: function _validateHistory(history) {
            var _this = this;

            history.forEach(function (action) {
                _this._validateAction(action);
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
        key: "migrate",
        value: function migrate(actions) {
            var passedActionIndex = -1;

            try {

                for (var index = 0; index < actions.length; index++) {
                    var action = actions[index];
                    this._validateAction(action);

                    var actionName = action.execute.action;
                    var migratorAction = this.migrator[actionName];

                    if (typeof migratorAction !== "function") {
                        throw new Error("'" + this.migrator.name + "' migrator doesn't support this action. " + actionName);
                    }

                    var consequentialActions = migratorAction.apply(this.migrator, [edm, action.execute.options]);

                    if (Array.isArray(consequentialActions) && consequentialActions.length > 0) {
                        this.migrate(consequentialActions);
                    }

                    passedActionIndex = index;
                }
            } catch (error) {

                try {

                    for (var _index = passedActionIndex; passedActionIndex > 0; passedActionIndex--) {
                        var _action = actions[_index];
                        var _actionName = _action.revert.action;
                        var _migratorAction = this.migrator[_actionName];

                        if (typeof _migratorAction !== "function") {
                            throw new Error("Migrator doesn't support this action. " + _actionName);
                        }

                        _migratorAction.apply(this.migrator, [edm, _action.revert.options]);
                    }
                } catch (error) {
                    var _modifiedError = Error("Failed to revert actions on a failed migration.");
                    _modifiedError.stack = error.stack;

                    throw _modifiedError;
                }

                var modifiedError = new Error("Successfully reverted actions on a failed mirgration.");
                modifiedError.stack = error.stack;

                throw modifiedError;
            }
        }
    }]);

    return MigrationRunner;
}();

exports.default = MigrationRunner;
//# sourceMappingURL=MigrationRunner.js.map