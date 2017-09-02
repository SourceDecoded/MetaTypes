const metaEdm = {
    "name": "Meta Edm",
    "version": "1.0.0",
    "tables": [
        {
            "name": "Edm",
            "label": "Edm",
            "pluralLabel": "Edms",
            "decorators": [],
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
                    "name": "json",
                    "label": "JSON"
                },
                {
                    "type": "String",
                    "name": "name",
                    "label": "Name"
                },
                {
                    "type": "String",
                    "name": "version",
                    "label": "Version"
                },
                {
                    "type": "String",
                    "name": "createdBy",
                    "label": "Created By"
                }
            ]
        }
    ],
    "relationships": {
        "oneToOne": [],
        "oneToMany": []
    }
};


export default metaEdm;