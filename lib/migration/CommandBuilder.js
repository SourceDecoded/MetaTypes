"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Command = require("./../migration/Command");

var _Command2 = _interopRequireDefault(_Command);

var _Validator = require("./../edm/Validator");

var _Validator2 = _interopRequireDefault(_Validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandBuilder = function () {
    function CommandBuilder() {
        _classCallCheck(this, CommandBuilder);

        this.edmValidator = new _Validator2.default();
    }

    _createClass(CommandBuilder, [{
        key: "createAddColumnCommand",
        value: function createAddColumnCommand(tableName, column) {
            this.edmValidator.validateColumn(column);

            var command = new _Command2.default();
            var options = {
                tableName: tableName,
                column: column
            };;

            command.execute.action = "addColumn";
            command.execute.options = options;

            command.revert.action = "removeColumn";
            command.revert.options = options;

            return command;
        }
    }, {
        key: "createAddDecoratorCommand",
        value: function createAddDecoratorCommand(tableName, decorator) {
            this.edmValidator.validateDecorator(decorator);

            var command = new _Command2.default();
            var options = {
                tableName: tableName,
                decorator: decorator
            };

            if (typeof options.name != "string") {
                throw new Error("Decorators need to have a name.");
            }

            command.execute.action = "addDecorator";
            command.execute.options = options;

            command.revert.action = "removeDecorator";
            command.revert.options = options;

            return command;
        }
    }, {
        key: "createAddOneToOneRelationshipCommand",
        value: function createAddOneToOneRelationshipCommand(relationship) {
            this.edmValidator.validateOneToOneRelationship(relationship);

            var command = new _Command2.default();
            var options = {
                relationship: relationship
            };

            command.execute.action = "addOneToOneRelationship";
            command.execute.options = options;

            command.revert.action = "removeOneToOneRelationship";
            command.revert.options = options;

            return command;
        }
    }, {
        key: "createAddOneToManyRelationshipCommand",
        value: function createAddOneToManyRelationshipCommand(relationship) {
            this.edmValidator.validateOneToManyRelationship(relationship);

            var command = new _Command2.default();
            var options = {
                relationship: relationship
            };

            command.execute.action = "addOneToManyRelationship";
            command.execute.options = options;

            command.revert.action = "removeOneToManyRelationship";
            command.revert.options = options;

            return command;
        }
    }, {
        key: "createAddTableCommand",
        value: function createAddTableCommand(table) {
            this.edmValidator.validateTableDescriptors(table);

            var command = new _Command2.default();
            var options = table;

            command.execute.action = "addTable";
            command.execute.options = options;

            command.revert.action = "removeTable";
            command.revert.options = options;

            return command;
        }
    }, {
        key: "createRemoveColumnCommand",
        value: function createRemoveColumnCommand(tableName, column) {
            this.edmValidator.validateColumn(column);

            var command = new _Command2.default();
            var options = {
                tableName: tableName,
                column: column
            };

            command.execute.action = "removeColumn";
            command.execute.options = options;

            command.revert.action = "addColumn";
            command.revert.options = options;

            return command;
        }
    }, {
        key: "createRemoveDecoratorCommand",
        value: function createRemoveDecoratorCommand(tableName, decorator) {
            this.edmValidator.validateDecorator(decorator);

            var command = new _Command2.default();
            var options = {
                tableName: tableName,
                decorator: decorator
            };

            if (typeof options.name != "string") {
                throw new Error("Decorators need to have a name.");
            }

            command.execute.action = "removeDecorator";
            command.execute.options = options;

            command.revert.action = "addDecorator";
            command.revert.options = options;

            return command;
        }
    }, {
        key: "createRemoveOneToOneRelationshipCommand",
        value: function createRemoveOneToOneRelationshipCommand(relationship) {
            this.edmValidator.validateOneToOneRelationship(relationship);

            var command = new _Command2.default();
            var options = {
                relationship: relationship
            };

            command.execute.action = "removeOneToOneRelationship";
            command.execute.options = options;

            command.revert.action = "addOneToOneRelationship";
            command.revert.options = options;

            return command;
        }
    }, {
        key: "createRemoveOneToManyRelationshipCommand",
        value: function createRemoveOneToManyRelationshipCommand(relationship) {
            this.edmValidator.validateOneToManyRelationship(relationship);

            var command = new _Command2.default();
            var options = {
                relationship: relationship
            };

            command.execute.action = "removeOneToManyRelationship";
            command.execute.options = options;

            command.revert.action = "addOneToManyRelationship";
            command.revert.options = options;

            return command;
        }
    }, {
        key: "createRemoveTableCommand",
        value: function createRemoveTableCommand(table) {
            this.edmValidator.validateTableDescriptors(table);

            var command = new _Command2.default();
            var options = table;

            command.execute.action = "removeTable";
            command.execute.options = options;

            command.revert.action = "addTable";
            command.revert.options = options;

            return command;
        }
    }, {
        key: "createUpdateColumnCommand",
        value: function createUpdateColumnCommand(tableName, oldColumn, newColumn) {
            this.edmValidator.validateColumn(oldColumn);
            this.edmValidator.validateColumn(newColumn);

            var command = new _Command2.default();

            command.execute.action = "updateColumn";
            command.execute.options = {
                tableName: tableName,
                column: newColumn
            };

            command.revert.action = "updateColumn";
            command.revert.options = {
                tableName: tableName,
                column: oldColumn
            };

            return command;
        }
    }, {
        key: "createUpdateDecoratorCommand",
        value: function createUpdateDecoratorCommand(tableName, oldDecorator, newDecorator) {
            this.edmValidator.validateDecorator(oldDecorator);
            this.edmValidator.validateDecorator(newDecorator);

            var command = new _Command2.default();

            command.execute.action = "updateDecorator";
            command.execute.options = {
                tableName: tableName,
                decorator: newDecorator
            };

            command.revert.action = "updateDecorator";
            command.revert.options = {
                tableName: tableName,
                decorator: oldDecorator
            };;

            return command;
        }
    }, {
        key: "createUpdateOneToOneCommand",
        value: function createUpdateOneToOneCommand(oldOneToOneRelationship, newOneToOneRelationship) {
            this.edmValidator.validateOneToOneRelationship(oldOneToOneRelationship);
            this.edmValidator.validateOneToOneRelationship(newOneToOneRelationship);

            var command = new _Command2.default();

            command.execute.action = "updateOneToOneRelationship";
            command.execute.options = newOneToOneRelationship;

            command.revert.action = "updateOneToOneRelationship";
            command.revert.options = oldOneToOneRelationship;

            return command;
        }
    }, {
        key: "createUpdateOneToManyCommand",
        value: function createUpdateOneToManyCommand(oldOneToManyRelationship, newOneToManyRelationship) {
            this.edmValidator.validateOneToOneRelationship(oldOneToManyRelationship);
            this.edmValidator.validateOneToOneRelationship(newOneToManyRelationship);

            var command = new _Command2.default();

            command.execute.action = "updateOneToManyRelationship";
            command.execute.options = newOneToManyRelationship;

            command.revert.action = "updateOneToManyRelationship";
            command.revert.options = oldOneToManyRelationship;

            return command;
        }
    }, {
        key: "createUpdateTableCommand",
        value: function createUpdateTableCommand(tableName, oldTable, newTable) {
            this.edmValidator.validateTableDescriptors(oldTable);
            this.edmValidator.validateTableDescriptors(newTable);

            var command = new _Command2.default();

            command.execute.action = "updateTable";
            command.execute.options = {
                tableName: tableName,
                table: newTable
            };

            command.revert.action = "updateTable";
            command.revert.options = {
                tableName: tableName,
                table: oldTable
            };;

            return command;
        }
    }, {
        key: "createCommandsFromEdm",
        value: function createCommandsFromEdm(edm) {
            var _this = this;

            var commands = edm.tables.reduce(function (accumulator, table) {
                var tableTemplate = Object.assign({}, table);
                delete tableTemplate.columns;

                accumulator.push(_this.createAddTableCommand(tableTemplate));

                table.columns.forEach(function (column) {
                    accumulator.push(_this.createAddColumnCommand({
                        tableName: table.name,
                        column: column
                    }));
                });
            }, []);

            edm.relationships.oneToOne(function (relationship) {
                accumulator.push(_this.createAddOneToOneRelationshipCommand({
                    relationship: relationship
                }));
            }, commands);

            edm.relationships.oneToMany(function (relationship) {
                accumulator.push(_this.createAddOneToManyRelationshipCommand({
                    relationship: relationship
                }));
            }, commands);

            return commands;
        }
    }]);

    return CommandBuilder;
}();

exports.default = CommandBuilder;
//# sourceMappingURL=CommandBuilder.js.map