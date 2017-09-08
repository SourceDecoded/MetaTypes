"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataTypeMapping = require("./dataTypeMapping");

var _dataTypeMapping2 = _interopRequireDefault(_dataTypeMapping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EdmValidator = function () {
    function EdmValidator() {
        _classCallCheck(this, EdmValidator);
    }

    _createClass(EdmValidator, [{
        key: "validate",
        value: function validate(edm) {
            var _this = this;

            if (!Array.isArray(edm.tables)) {
                throw new Error("Edm needs to have at least one table.");
            }

            if (edm.name == null) {
                throw new Error("Edm needs to have a name.");
            }

            if (edm.version == null) {
                throw new Error("Edm needs to have a version.");
            }

            if (edm.label == null) {
                throw new Error("Edm needs to have a label.");
            }

            edm.tables.forEach(function (table) {
                _this.validateTable(table);
            });

            this.validateRelationships(edm);
        }
    }, {
        key: "validateColumn",
        value: function validateColumn(column) {
            if (column.name == null) {
                throw new Error("Column needs to have a name.");
            }

            if (column.label == null) {
                throw new Error("Column needs to hava a label.");
            }

            if (_dataTypeMapping2.default[column.type] == null) {
                throw new Error("Unknown Column Type: " + column.type + ".");
            }
        }
    }, {
        key: "validateOneToOneRelationship",
        value: function validateOneToOneRelationship(relationship) {
            if (relationship.type == null) {
                throw new Error("One to one relationships needs to have a type property.");
            }

            if (relationship.hasKey == null) {
                throw new Error("One to one relationships needs to have a hasKey property.");
            }

            if (relationship.hasOne == null) {
                throw new Error("One to one relationships needs to have a hasOne property.");
            }

            if (relationship.hasOneLabel == null) {
                throw new Error("One to one relationships needs to have a hasOneLabel property.");
            }

            if (relationship.ofType == null) {
                throw new Error("One to one relationships needs to have a ofType property.");
            }

            if (relationship.withKey == null) {
                throw new Error("One to one relationships needs to have a withKey property.");
            }

            if (relationship.withForeignKey == null) {
                throw new Error("One to one relationships needs to have a withForeignKey property.");
            }

            if (relationship.withOne == null) {
                throw new Error("One to one relationships needs to have a withOne property.");
            }

            if (relationship.withOneLabel == null) {
                throw new Error("One to one relationships needs to have a withOneLabel property.");
            }
        }
    }, {
        key: "validateOneToManyRelationship",
        value: function validateOneToManyRelationship(relationship) {
            if (relationship.type == null) {
                throw new Error("One to many relationships needs to have a type property.");
            }

            if (relationship.hasKey == null) {
                throw new Error("One to many relationships needs to have a hasKey property.");
            }

            if (relationship.hasMany == null) {
                throw new Error("One to many relationships needs to have a hasMany property.");
            }

            if (relationship.hasManyLabel == null) {
                throw new Error("One to many relationships needs to have a hasManyLabel property.");
            }

            if (relationship.ofType == null) {
                throw new Error("One to many relationships needs to have a ofType property.");
            }

            if (relationship.withKey == null) {
                throw new Error("One to many relationships needs to have a withKey property.");
            }

            if (relationship.withForeignKey == null) {
                throw new Error("One to many relationships needs to have a withForeignKey property.");
            }

            if (relationship.withOne == null) {
                throw new Error("One to many relationships needs to have a withOne property.");
            }

            if (relationship.withOneLabel == null) {
                throw new Error("One to many relationships needs to have a withOneLabel property.");
            }
        }
    }, {
        key: "validateRelationships",
        value: function validateRelationships(edm) {
            var _this2 = this;

            if (edm.relationships == null) {
                throw new Error("Edm needs to have a relationships object.");
            }

            if (!Array.isArray(edm.relationships.oneToOne)) {
                throw new Error("Edm needs to have a oneToOne array describing one to one relationships. It can be an empty array.");
            }

            if (!Array.isArray(edm.relationships.oneToMany)) {
                throw new Error("Edm needs to have a oneToMany array describing one to many relationships. It can be an empty array.");
            }

            edm.relationships.oneToOne.forEach(function (relationship) {
                _this2.validateOneToOneRelationship(relationship);
            });

            edm.relationships.oneToMany.forEach(function (relationship) {
                _this2.validateOneToManyRelationship(relationship);
            });
        }
    }, {
        key: "validateTable",
        value: function validateTable(table) {
            var _this3 = this;

            if (table.name == null) {
                throw new Error("Table needs to have a name.");
            }

            if (table.label == null) {
                throw new Error("Table needs to have a label.");
            }

            if (table.pluralLabel == null) {
                throw new Error("Table needs to have a pluralLabel.");
            }

            var primaryKeyColumns = table.columns.filter(function (column) {
                return column.isPrimaryKey;
            });

            if (primaryKeyColumns.length !== 1) {
                throw new Error("Tables can only have one primary key.");
            }

            table.columns.forEach(function (column) {
                _this3.validateColumn(column);
            });
        }
    }]);

    return EdmValidator;
}();

exports.default = EdmValidator;
//# sourceMappingURL=EdmValidator.js.map