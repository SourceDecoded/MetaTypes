"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EdmMigrator = function () {
    function EdmMigrator() {
        _classCallCheck(this, EdmMigrator);
    }

    _createClass(EdmMigrator, [{
        key: "_getTable",
        value: function _getTable(tables, name) {
            return this.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "_throwIfTableExist",
        value: function _throwIfTableExist(name) {
            var index = edm.tables.findIndex(function (table) {
                return table.name === name;
            });

            if (index > -1) {
                throw new Error("'" + name + "' table already exists.");
            }
        }
    }, {
        key: "_throwIfTableDoesNotExist",
        value: function _throwIfTableDoesNotExist(name) {
            var index = edm.tables.findIndex(function (table) {
                return table.name === name;
            });

            if (index === -1) {
                throw new Error("'" + name + "' table doesn't exists.");
            }
        }
    }, {
        key: "_validateNewTableOptions",
        value: function _validateNewTableOptions(options) {
            if (typeof options.name !== "string") {
                throw new Error("Illegal Argument: options.name needs to be a string.");
            }

            if (typeof options.label !== "string") {
                throw new Error("Illegal Argument: options.label needs to be a string.");
            }

            if (typeof options.pluralLabel !== "string") {
                throw new Error("Illegal Argument: options.pluralLabel needs to be a string.");
            }
        }
    }, {
        key: "_validateUpdateTableOptions",
        value: function _validateUpdateTableOptions(options) {
            if (options.name != null && typeof options.name !== "string") {
                throw new Error("Illegal Argument: options.name needs to be a string.");
            }

            if (options.label != null && typeof options.label !== "string") {
                throw new Error("Illegal Argument: options.label needs to be a string.");
            }

            if (options.pluralLabel != null && typeof options.pluralLabel !== "string") {
                throw new Error("Illegal Argument: options.pluralLabel needs to be a string.");
            }
        }
    }, {
        key: "addTableAsync",
        value: function addTableAsync(edm, options) {
            this._validateNewTableOptions(options);
            this._throwIfTableExist(options.name);

            edm.tables.push({
                name: options.name,
                label: options.label,
                pluralLabel: options.pluralLabel,
                decorators: []
            });
        }
    }, {
        key: "updateTableAsync",
        value: function updateTableAsync(edm, options) {
            this._validateUpdateTableOptions(options);
            this._throwIfTableDoesNotExist(options.name);

            var table = this._getTable(edm.tables, options.name);
            table.name = options.update.name != null ? options.update.name : table.name;
            table.label = options.update.label != null ? options.update.label : table.label;
            table.pluralLabel = options.update.pluralLabel != null ? options.update.pluralLabel : table.pluralLabel;
        }
    }, {
        key: "removeTableAsync",
        value: function removeTableAsync(edm, options) {
            this._throwIfTableDoesNotExist(options.name);

            var index = edm.tables.findIndex(function (table) {
                return table.name === options.name;
            });

            edm.tables.splice(index, 1);
        }
    }]);

    return EdmMigrator;
}();

exports.default = EdmMigrator;
//# sourceMappingURL=EdmMigrator.js.map