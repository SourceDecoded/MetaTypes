"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var edm = {
    "name": "MockData",
    "label": "Mock Data",
    "version": "0.0.1",
    "tables": [{
        "name": "Source",
        "label": "Source",
        "pluralLabel": "Sources",
        "decorators": [{
            name: "Test",
            options: {
                option1: true
            }
        }],
        "columns": [{
            "type": "Integer",
            "name": "id",
            "label": "Identifier",
            "isPrimaryKey": true,
            "isAutoIncrement": true,
            "isNullable": false
        }, {
            "type": "String",
            "name": "string",
            "label": "String",
            "defaultStringValue": ""
        }, {
            "type": "Number",
            "name": "number",
            "label": "Number",
            "defaultNumberValue": 1
        }, {
            "type": "Date",
            "name": "date",
            "label": "Date",
            "defaultDateValue": new Date(1900, 0, 1)
        }, {
            "type": "Boolean",
            "name": "boolean",
            "label": "Boolean",
            "defaultBooleanValue": false
        }, {
            "type": "Float",
            "name": "float",
            "label": "Float",
            "defaultFloatValue": 0.00
        }]
    }, {
        "name": "Foreign",
        "label": "Foreign",
        "pluralLabel": "Foreigners",
        "columns": [{
            "type": "Integer",
            "name": "id",
            "label": "Identifier",
            "isPrimaryKey": true,
            "isAutoIncrement": true,
            "isNullable": false
        }, {
            "type": "Integer",
            "name": "foreignKey",
            "label": "ForeignKey"
        }]
    }, {
        "name": "OtherForeign",
        "label": "Other Foreigner",
        "pluralLabel": "Other Foreigners",
        "columns": [{
            "type": "Integer",
            "name": "id",
            "label": "Identifier",
            "isPrimaryKey": true,
            "isAutoIncrement": true,
            "isNullable": false
        }, {
            "type": "Integer",
            "name": "foreignKey",
            "label": "ForeignKey"
        }, {
            "type": "String",
            "name": "string",
            "label": "String"
        }, {
            "type": "Integer",
            "name": "indexedColumn",
            "label": "Indexed Column",
            "isIndexed": true
        }]
    }],
    "relationships": {
        "oneToOne": [{
            "type": "Source",
            "hasKey": "id",
            "hasOneLabel": "Foreigner",
            "hasOne": "foreigner",
            "ofType": "OtherForeign",
            "withKey": "id",
            "withForeignKey": "foreignKey",
            "withOne": "source",
            "withOneLabel": "Source"
        }],
        "oneToMany": [{
            "type": "Source",
            "hasKey": "id",
            "hasManyLabel": "Foreigners",
            "hasMany": "foreigners",
            "ofType": "Foreign",
            "withKey": "id",
            "withForeignKey": "foreignKey",
            "withOne": "source",
            "withOneLabel": "Source"
        }]
    }
};

exports.default = edm;
//# sourceMappingURL=edm.js.map