"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var metaEdm = {
    "name": "MetaEdm",
    "label": "Meta Edm",
    "version": "1.0.0",
    "tables": [{
        "name": "Edm",
        "label": "Edm",
        "pluralLabel": "Edms",
        "decorators": [],
        "columns": [{
            "type": "Integer",
            "name": "id",
            "label": "Identifier",
            "isPrimaryKey": true,
            "isAutoIncrement": true,
            "isNullable": false
        }, {
            "type": "String",
            "name": "edm",
            "label": "Edm"
        }, {
            "type": "String",
            "name": "decoratedEdm",
            "label": "Decorated Edm"
        }, {
            "type": "String",
            "name": "name",
            "label": "Name"
        }, {
            "type": "String",
            "name": "version",
            "label": "Version"
        }, {
            "type": "String",
            "name": "createdBy",
            "label": "Created By"
        }]
    }],
    "relationships": {
        "oneToOne": [],
        "oneToMany": []
    }
};

exports.default = metaEdm;
//# sourceMappingURL=metaEdm.js.map