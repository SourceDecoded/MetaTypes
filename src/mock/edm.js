const edm = {
    "name": "MockData",
    "label":"Mock Data",
    "version": "0.0.1",
    "tables": [
        {
            "name": "Source",
            "label": "Source",
            "pluralLabel": "Sources",
            "decorators": [{
                name: "Governance",
                options: {}
            }],
            "columns": [
                {
                    "type": "Integer",
                    "name": "id",
                    "label": "Identifier",
                    "isPrimaryKey": true,
                    "isAutoIncrement": true,
                    "isNullable": false
                },
                {
                    "type": "String",
                    "name": "string",
                    "label": "String",
                    "defaultStringValue": ""
                },
                {
                    "type": "Number",
                    "name": "number",
                    "label": "Number",
                    "defaultNumberValue": 1
                },
                {
                    "type": "Date",
                    "name": "date",
                    "label": "Date",
                    "defaultDateValue": new Date(1900, 0, 1)
                },
                {
                    "type": "Boolean",
                    "name": "boolean",
                    "label": "Boolean",
                    "defaultBooleanValue": false
                },
                {
                    "type": "Float",
                    "name": "float",
                    "label": "Float",
                    "defaultFloatValue": 0.00
                }
            ]
        },
        {
            "name": "Foreign",
            "label": "Foreign",
            "pluralLabel": "Foreigners",
            "columns": [
                {
                    "type": "Integer",
                    "name": "id",
                    "label": "Identifier",
                    "isPrimaryKey": true,
                    "isAutoIncrement": true,
                    "isNullable": false
                },
                {
                    "type": "Integer",
                    "name": "foreignKey",
                    "label": "ForeignKey"
                }
            ]
        },
        {
            "name": "OtherForeign",
            "label": "Other Foreigner",
            "pluralLabel": "Other Foreigners",
            "columns": [
                {
                    "type": "Integer",
                    "name": "id",
                    "label": "Identifier",
                    "isPrimaryKey": true,
                    "isAutoIncrement": true,
                    "isNullable": false
                },
                {
                    "type": "Integer",
                    "name": "foreignKey",
                    "label": "ForeignKey"
                },
                {
                    "type": "String",
                    "name": "string",
                    "label": "String"
                }
            ]
        }
    ],
    "relationships": {
        "oneToOne": [{
            "id": 1,
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
            "id": 1,
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


export default edm;