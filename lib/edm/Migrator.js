"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Validator = require("./Validator");

var _Validator2 = _interopRequireDefault(_Validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var resolvedPromise = Promise.resolve;

var Migrator = function () {
    function Migrator() {
        _classCallCheck(this, Migrator);

        this.validator = new _Validator2.default();
        this.name = "Edm Migrator";
    }

    _createClass(Migrator, [{
        key: "_doesTableHavePrimaryKey",
        value: function _doesTableHavePrimaryKey(table) {
            return table.columns.find(function (column) {
                return column.isPrimaryKey;
            }) != null;
        }
    }, {
        key: "_getColumn",
        value: function _getColumn(columns, name) {
            return columns.find(function (column) {
                return column.name === name;
            });
        }
    }, {
        key: "_getDecorator",
        value: function _getDecorator(table, decoratorName) {
            return table.decorators.find(function (decorator) {
                return decorator.name === decoratorName;
            });
        }
    }, {
        key: "_getTable",
        value: function _getTable(tables, name) {
            return tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "_hasDecorator",
        value: function _hasDecorator(table, decoratorName) {
            return this._getDecorator(table, decoratorName) != null;
        }
    }, {
        key: "_isEmptyString",
        value: function _isEmptyString(string) {
            return string == null || typeof string !== "string" || string === "";
        }
    }, {
        key: "_throwIfColumnExist",
        value: function _throwIfColumnExist(edm, columns, columnName) {
            var column = this._getColumn(columns, columnName);

            if (column != null) {
                throw new Error("'" + columnName + "' column already exists.");
            }
        }
    }, {
        key: "_throwIfColumnDoesNotExist",
        value: function _throwIfColumnDoesNotExist(edm, columns, columnName) {
            var column = this._getColumn(columns, columnName);

            if (column == null) {
                throw new Error("'" + columnName + "' column doesn't exists.");
            }
        }
    }, {
        key: "_throwIfTableExist",
        value: function _throwIfTableExist(edm, name) {
            var table = this._getTable(edm.tables, name);

            if (table != null) {
                throw new Error("'" + name + "' table already exists.");
            }
        }
    }, {
        key: "_throwIfTableDoesNotExist",
        value: function _throwIfTableDoesNotExist(edm, name) {
            var table = this._getTable(edm.tables, name);

            if (table == null) {
                throw new Error("'" + name + "' table doesn't exists.");
            }
        }
    }, {
        key: "addColumnAsync",
        value: function addColumnAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var table = this._getTable(edm.tables, options.tableName);
            this._throwIfColumnExist(edm, table.columns, options.column.name);

            this.validator.validateColumn(options.column);

            if (table.columns.length === 0 && !options.column.isPrimaryKey) {
                throw new Error("First column to a table needs to be a primary key.");
            }

            if (this._doesTableHavePrimaryKey(table) && options.column.isPrimaryKey) {
                throw new Error("The " + options.table + " can only have one primary key.");
            }

            table.columns.push(options.column);

            return resolvedPromise;
        }
    }, {
        key: "addDecoratorAsync",
        value: function addDecoratorAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var table = this._getTable(edm.tables, options.tableName);
            this._throwIfTableDoesNotExist(edm, options.tableName);

            this.validator.validateDecorator(options.decorator);

            if (this._hasDecorator(table, options.decorator.name)) {
                throw new Error("The '" + options.decorator.name + "' decorator already exists on the '" + options.tableName + "' table.");
            }

            table.decorators.push(options.decorator);

            return resolvedPromise;
        }
    }, {
        key: "addOneToOnRelationship",
        value: function addOneToOnRelationship(edm, options) {
            this.validator.validateOneToOneRelationship(options.relationship);
            edm.relationships.oneToOne.push(options.relationship);
        }
    }, {
        key: "addOneToManyRelationship",
        value: function addOneToManyRelationship(edm, options) {
            this.validator.validateOneToManyRelationship(options.relationship);
            edm.relationships.oneToMany.push(options.relationship);
        }
    }, {
        key: "addTableAsync",
        value: function addTableAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this.validator.validateTableDescriptors(options);
            this._throwIfTableExist(edm, options.name);

            edm.tables.push({
                name: options.name,
                label: options.label,
                pluralLabel: options.pluralLabel,
                decorators: [],
                columns: []
            });

            return resolvedPromise;
        }
    }, {
        key: "removeColumnAsync",
        value: function removeColumnAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var table = this._getTable(edm.tables, options.tableName);
            this._throwIfTableDoesNotExist(edm, table.columns, options.columnName);

            var column = this._getColumn(table.columns, options.columnName);

            if (column.isPrimaryKey) {
                throw new Error("Cannot remove the primary key.");
            }

            return resolvedPromise;
        }
    }, {
        key: "removeDecoratorAsync",
        value: function removeDecoratorAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var table = this._getTable(edm.tables, options.tableName);
            this._throwIfTableDoesNotExist(edm, options.tableName);

            var decorator = this._getDecorator(table, options.decoratorName);

            if (decorator == null) {
                throw new Error("The " + options.tableName + " doesn't have the " + options.decorator.name + " to update.");
            }

            var index = table.decorators.findIndex(function (decorator) {
                return decorator.name === options.decoratorName;
            });

            table.decorators.splice(index, 1);

            return resolvedPromise;
        }
    }, {
        key: "removeTableAsync",
        value: function removeTableAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this._throwIfTableDoesNotExist(edm, options.tableName);

            var index = edm.tables.findIndex(function (table) {
                return table.name === options.tableName;
            });

            edm.tables.splice(index, 1);

            return resolvedPromise;
        }
    }, {
        key: "updateColumnAsync",
        value: function updateColumnAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var table = this._getTable(edm.tables, options.tableName);
            this._throwIfTableDoesNotExist(edm, table.columns, options.columnName);

            var column = this._getColumn(table.columns, options.columnName);
            var updatedColumn = Object.assign({}, column, options.column);

            this.validator.validateColumn(updatedColumn);

            if (typeof column.isPrimaryKey === "boolean" && column.isPrimaryKey !== updatedColumn.isPrimaryKey) {
                throw new Error("Once a primary key has been set, you cannot remove it as a primary key. You can however rename its name, label, and pluralLabel.");
            }

            Object.assign(column, updatedColumn);

            return resolvedPromise;
        }
    }, {
        key: "updateDecoratorAsync",
        value: function updateDecoratorAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var table = this._getTable(edm.tables, options.tableName);
            this._throwIfTableDoesNotExist(edm, options.tableName);

            this.validator.validateDecorator(options.decorator);

            var decorator = this._getDecorator(table, options.decorator.name);

            if (decorator == null) {
                throw new Error("The " + options.tableName + " doesn't have the " + options.decorator.name + " to update.");
            }

            Object.assign(decorator, options.decorator);

            return resolvedPromise;
        }
    }, {
        key: "updateTableAsync",
        value: function updateTableAsync(edm) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this._throwIfTableDoesNotExist(edm, options.name);

            var table = this._getTable(edm.tables, options.name);
            this.validator.validateTableDescriptors(Object.assign({}, table, options));

            // We want to make sure that the developer doesn't change the columns and decorators here.
            Object.assign(table, options, { decorators: table.decorators, columns: table.columns });

            return resolvedPromise;
        }
    }]);

    return Migrator;
}();

exports.default = Migrator;
//# sourceMappingURL=Migrator.js.map