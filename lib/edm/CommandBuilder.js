"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Command = require("./../migration/Command");

var _Command2 = _interopRequireDefault(_Command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandBuilder = function () {
    function CommandBuilder() {
        _classCallCheck(this, CommandBuilder);
    }

    _createClass(CommandBuilder, [{
        key: "createAddColumn",
        value: function createAddColumn(column) {
            var command = new _Command2.default();
            command.execute.action = "addColumn";
            command.execute.options = {
                type: column.type,
                name: column.name,
                label: column.label,
                isPrimaryKey: typeof column.isPrimaryKey === "boolean" ? column.isPrimaryKey : false,
                isAutoIncrement: typeof column.isAutoIncrement === "boolean" ? column.isAutoIncrement : false,
                isNullable: typeof column.isNullable === "boolean" ? column.isNullable : false,
                isIndexed: typeof column.isIndexed === "boolean" ? column.isIndexed : false
            };

            command.revert.action = "removeColumn";
            command.revert.options = {
                type: column.type,
                name: column.name,
                label: column.label,
                isPrimaryKey: typeof column.isPrimaryKey === "boolean" ? column.isPrimaryKey : false,
                isAutoIncrement: typeof column.isAutoIncrement === "boolean" ? column.isAutoIncrement : false,
                isNullable: typeof column.isNullable === "boolean" ? column.isNullable : false,
                isIndexed: typeof column.isIndexed === "boolean" ? column.isIndexed : false
            };
        }
    }, {
        key: "createAddTableCommand",
        value: function createAddTableCommand(table) {
            var command = new _Command2.default();
            command.execute.action = "addTable";
            command.execute.options = {
                name: table.name,
                label: table.label,
                pluralLabel: table.pluralLabel
            };

            command.revert.action = "removeTable";
            command.revert.options = {
                name: table.name,
                label: table.label,
                pluralLabel: table.pluralLabel
            };
        }
    }, {
        key: "createCommandsFromEdm",
        value: function createCommandsFromEdm(edm) {
            return edm.tables.reduce(function (accumulator, table) {}, []);
        }
    }]);

    return CommandBuilder;
}();

exports.default = CommandBuilder;
//# sourceMappingURL=CommandBuilder.js.map