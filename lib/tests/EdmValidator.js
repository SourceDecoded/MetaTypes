"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _EdmValidator = require("./../EdmValidator");

var _EdmValidator2 = _interopRequireDefault(_EdmValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["EdmValidator.validate: Empty."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate();
    }, /Invalid Argument: Edm cannot be null/);
};

exports["EdmValidator.validate: Bad edm name."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate({
            name: {}
        });
    }, /Invalid Argument: Edm needs to have a name of type string/);
};

exports["EdmValidator.validate: Bad edm label."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: {}
        });
    }, /Invalid Argument: Edm needs to have a label of type string/);
};

exports["EdmValidator.validate: Bad edm version."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: {}
        });
    }, /Invalid Argument: Edm needs to have a version of type string/);
};

exports["EdmValidator.validate: Bad edm tables."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            table: {}
        });
    }, /Invalid Argument: Edm needs an array of tables/);
};

exports["EdmValidator.validate: A null table."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [null]
        });
    }, /Invalid Argument: Table cannot be null or undefined/);
};

exports["EdmValidator.validate: An invalid table as an array."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [[]]
        });
    }, /Invalid Argument: Table needs to be an object/);
};

exports["EdmValidator.validate: An invalid table name."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [{
                name: {}
            }]
        });
    }, /Invalid Argument: Table needs to have a name/);
};

exports["EdmValidator.validate: An invalid table label."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [{
                name: "table",
                label: {}
            }]
        });
    }, /Invalid Argument: Table needs to have a label/);
};

exports["EdmValidator.validate: An invalid table pluralLabel."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [{
                name: "table",
                label: "Table",
                pluralLabel: {}
            }]
        });
    }, /Invalid Argument: Table needs to have a pluralLabel/);
};

exports["EdmValidator.validate: An invalid columns."] = function () {
    var validator = new _EdmValidator2.default();

    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [{
                name: "table",
                label: "Table",
                pluralLabel: "Tables",
                columns: null
            }]
        });
    }, /Invalid Argument: Table needs to have an array of columns/);
};

exports["EdmValidator.validate: Valid empty column table."] = function () {
    var validator = new _EdmValidator2.default();

    validator.validate({
        name: "edm",
        label: "Edm",
        version: "0.0.1",
        tables: [{
            name: "table",
            label: "Table",
            pluralLabel: "Tables",
            columns: []
        }],
        relationships: {
            oneToOne: [],
            oneToMany: []
        }
    });
};

exports["EdmValidator.validate: Invalid column name."] = function () {
    var validator = new _EdmValidator2.default();
    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [{
                name: "table",
                label: "Table",
                pluralLabel: "Tables",
                columns: [{
                    name: {}
                }]
            }],
            relationships: {
                oneToOne: [],
                oneToMany: []
            }
        });
    }, /Invalid Argument: Column needs to have a name/);
};

exports["EdmValidator.validate: Invalid column label."] = function () {
    var validator = new _EdmValidator2.default();
    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [{
                name: "table",
                label: "Table",
                pluralLabel: "Tables",
                columns: [{
                    name: "column",
                    label: {}
                }]
            }],
            relationships: {
                oneToOne: [],
                oneToMany: []
            }
        });
    }, /Invalid Argument: Column needs to hava a label/);
};

exports["EdmValidator.validate: Invalid table with no primary key."] = function () {
    var validator = new _EdmValidator2.default();
    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [{
                name: "table",
                label: "Table",
                pluralLabel: "Tables",
                columns: [{
                    type: "Integer",
                    name: "column"
                }]
            }],
            relationships: {
                oneToOne: [],
                oneToMany: []
            }
        });
    }, /Invalid Argument: Tables can only have one primary key/);
};

exports["EdmValidator.validate: Valid table with valid columns."] = function () {
    var validator = new _EdmValidator2.default();
    validator.validate({
        name: "edm",
        label: "Edm",
        version: "0.0.1",
        tables: [{
            name: "table",
            label: "Table",
            pluralLabel: "Tables",
            columns: [{
                type: "Integer",
                name: "column",
                label: "Column",
                isPrimaryKey: true
            }, {
                type: "String",
                name: "column1",
                label: "Column1"
            }]
        }],
        relationships: {
            oneToOne: [],
            oneToMany: []
        }
    });
};

exports["EdmValidator.validate: Invalid table with no primary key."] = function () {
    var validator = new _EdmValidator2.default();
    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [{
                name: "table",
                label: "Table",
                pluralLabel: "Tables",
                columns: [{
                    type: "String",
                    name: "column",
                    label: "Identifier",
                    isPrimaryKey: true
                }]
            }],
            relationships: {
                oneToOne: [],
                oneToMany: []
            }
        });
    }, /Invalid Argument: If the column is the primary key, it needs to be of typex Integer/);
};

exports["EdmValidator.validate: Invalid oneToOne type."] = function () {
    var validator = new _EdmValidator2.default();
    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [],
            relationships: {
                oneToOne: [{
                    type: {}
                }],
                oneToMany: []
            }
        });
    }, /Invalid Argument: One to one relationships needs to have a type property/);
};

exports["EdmValidator.validate: Invalid oneToOne hasKey."] = function () {
    var validator = new _EdmValidator2.default();
    _assert2.default.throws(function () {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [],
            relationships: {
                oneToOne: [{
                    type: "String",
                    hasKey: {}
                }],
                oneToMany: []
            }
        });
    }, /Invalid Argument: One to one relationships needs to have a hasKey property/);
};
//# sourceMappingURL=EdmValidator.js.map