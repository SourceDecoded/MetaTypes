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

var isEqualTo = function isEqualTo(left, right) {
    var leftKeys = Object.keys(left);
    var rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    return leftKeys.every(function (key) {
        left[key] === right[key];
    });
};

var Migrator = function () {
    function Migrator(edm) {
        _classCallCheck(this, Migrator);

        this.validator = new _Validator2.default();
        this.name = "Edm Migrator";
        this.edm = edm;
    }

    _createClass(Migrator, [{
        key: "_doesTableHavePrimaryKey",
        value: function _doesTableHavePrimaryKey(tableName) {
            var table = this._getTable(tableName);

            return table.columns.find(function (column) {
                return column.isPrimaryKey;
            }) != null;
        }
    }, {
        key: "_getColumn",
        value: function _getColumn(tableName, columnName) {
            this._throwIfTableDoesNotExist(tableName);

            var columns = this._getTable(tableName).columns;

            return columns.find(function (column) {
                return column.name === columnName;
            });
        }
    }, {
        key: "_getDecorator",
        value: function _getDecorator(tableName, decoratorName) {
            this._throwIfTableDoesNotExist(tableName);
            var table = this._getTable(tableName);

            return table.decorators.find(function (decorator) {
                return decorator.name === decoratorName;
            });
        }
    }, {
        key: "_getTable",
        value: function _getTable(name) {
            var tables = this.edm.tables;

            return tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "_hasDecorator",
        value: function _hasDecorator(tableName, decoratorName) {
            return this._getDecorator(tableName, decoratorName) != null;
        }
    }, {
        key: "_isEmptyString",
        value: function _isEmptyString(string) {
            return string == null || typeof string !== "string" || string === "";
        }
    }, {
        key: "_setColumn",
        value: function _setColumn(tableName, columnName, column) {
            this._throwIfColumnDoesNotExist();
            var columns = this._getTable(table).column;

            var index = columns.findIndex(function (column) {
                column.name === columnName;
            });

            columns.splice(index, 1, column);
        }
    }, {
        key: "_setDecorator",
        value: function _setDecorator(decorators, decoratorName, decorator) {
            var index = decorators.findIndex(function (decorator) {
                decorator.name === decoratorName;
            });

            decorators.splice(index, 1, decorator);
        }
    }, {
        key: "_replaceOneToOneRelationship",
        value: function _replaceOneToOneRelationship(oldRelationship, newRelationship) {}
    }, {
        key: "_replaceOneToManyRelationship",
        value: function _replaceOneToManyRelationship(oldRelationship, newRelationship) {}
    }, {
        key: "_throwIfColumnExist",
        value: function _throwIfColumnExist(tableName, columnName) {
            var column = this._getColumn(tableName, columnName);

            if (column != null) {
                throw new Error("'" + columnName + "' column already exists.");
            }
        }
    }, {
        key: "_throwIfColumnDoesNotExist",
        value: function _throwIfColumnDoesNotExist(tableName, columnName) {
            var column = this._getColumn(tableName, columnName);

            if (column == null) {
                throw new Error("'" + columnName + "' column doesn't exists.");
            }
        }
    }, {
        key: "_throwIfTableExist",
        value: function _throwIfTableExist(name) {
            var table = this._getTable(name);

            if (table != null) {
                throw new Error("'" + name + "' table already exists.");
            }
        }
    }, {
        key: "_throwIfTableDoesNotExist",
        value: function _throwIfTableDoesNotExist(name) {
            var table = this._getTable(name);

            if (table == null) {
                throw new Error("'" + name + "' table doesn't exists.");
            }
        }
    }, {
        key: "addColumnAsync",
        value: function addColumnAsync() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var table = this._getTable(options.tableName);

            this._throwIfColumnExist(options.tableName, options.column.name);
            this.validator.validateColumn(options.column);

            if (table.columns.length === 0 && !options.column.isPrimaryKey) {
                throw new Error("First column to a table needs to be a primary key.");
            }

            if (this._doesTableHavePrimaryKey(options.tableName) && options.column.isPrimaryKey) {
                throw new Error("The " + options.tableName + " can only have one primary key.");
            }

            table.columns.push(Object.assign({}, options.column));

            return resolvedPromise;
        }
    }, {
        key: "addDecoratorAsync",
        value: function addDecoratorAsync() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this._throwIfTableDoesNotExist(options.tableName);
            var table = this._getTable(options.tableName);

            this.validator.validateDecorator(options.decorator);

            if (this._hasDecorator(table.name, options.decorator.name)) {
                throw new Error("The '" + options.decorator.name + "' decorator already exists on the '" + options.tableName + "' table.");
            }

            table.decorators.push(Object.assign({}, options.decorator));

            return resolvedPromise;
        }
    }, {
        key: "addOneToOneRelationshipAsync",
        value: function addOneToOneRelationshipAsync(options) {
            this.validator.validateOneToOneRelationship(options.relationship);
            this.edm.relationships.oneToOne.push(Object.assign({}, options.relationship));
        }
    }, {
        key: "addOneToManyRelationshipAsync",
        value: function addOneToManyRelationshipAsync(options) {
            this.validator.validateOneToManyRelationship(options.relationship);
            this.edm.relationships.oneToMany.push(Object.assign({}, options.relationship));
        }
    }, {
        key: "addTableAsync",
        value: function addTableAsync() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.validator.validateTableDescriptors(options);
            this._throwIfTableExist(options.name);

            this.edm.tables.push({
                name: options.name,
                label: options.label,
                pluralLabel: options.pluralLabel,
                decorators: [],
                columns: options.columns
            });

            return resolvedPromise;
        }
    }, {
        key: "removeColumnAsync",
        value: function removeColumnAsync() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this._throwIfTableDoesNotExist(options.tableName);
            this._throwIfColumnDoesNotExist(options.tableName, options.column.name);

            var table = this._getTable(options.tableName);
            var column = this._getColumn(options.tableName, options.column.name);

            if (column.isPrimaryKey && table.columns.length > 1) {
                throw new Error("Cannot remove the primary key.");
            }

            return resolvedPromise;
        }
    }, {
        key: "removeDecoratorAsync",
        value: function removeDecoratorAsync() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this._throwIfTableDoesNotExist(options.tableName);
            var table = this._getTable(options.tableName);

            var decorator = this._getDecorator(options.tableName, options.decorator.name);

            if (decorator == null) {
                throw new Error("The " + options.tableName + " doesn't have the " + options.decorator.name + " to update.");
            }

            var index = table.decorators.findIndex(function (decorator) {
                return decorator.name === options.decorator.name;
            });

            table.decorators.splice(index, 1);

            return resolvedPromise;
        }
    }, {
        key: "removeTableAsync",
        value: function removeTableAsync() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this._throwIfTableDoesNotExist(options.name);

            var index = this.edm.tables.findIndex(function (table) {
                return table.name === options.name;
            });

            this.edm.tables.splice(index, 1);

            return resolvedPromise;
        }
    }, {
        key: "updateColumnAsync",
        value: function updateColumnAsync() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var table = this._getTable(options.tableName);
            this._throwIfTableDoesNotExist(options.tableName);
            this._throwIfColumnDoesNotExist(options.tableName, options.column.name);

            var column = this._getColumn(options.tableName, options.column.name);
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
        value: function updateDecoratorAsync() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this._throwIfTableDoesNotExist(options.tableName);

            var table = this._getTable(options.tableName);
            this.validator.validateDecorator(options.decorator);

            var decorator = this._getDecorator(options.tableName, options.decorator.name);

            if (decorator == null) {
                throw new Error("The " + options.tableName + " doesn't have the " + options.decorator.name + " to update.");
            }

            Object.assign(decorator, options.decorator);

            return resolvedPromise;
        }
    }, {
        key: "updateTableAsync",
        value: function updateTableAsync() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this._throwIfTableDoesNotExist(options.name);

            var table = this._getTable(options.name);
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