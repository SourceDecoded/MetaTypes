const defaultDataTypeMapping = {
    "String": "String",
    "Number": "Number",
    "Boolean": "Boolean",
    "Float": "Float",
    "Decimal": "Decimal",
    "Double": "Double",
    "Integer": "Integer",
    "Date": "Date",
    "Enum": "Enum"
};

export default class Validator {
    constructor(dataTypeMapping) {
        this.dataTypeMapping = dataTypeMapping || defaultDataTypeMapping;
    }

    _isEmptyString(string) {
        return string == null || typeof string !== "string" || string === "";
    }

    validate(edm) {
        if (edm == null) {
            throw new Error("Invalid Argument: Edm cannot be null.");
        }

        if (this._isEmptyString(edm.name)) {
            throw new Error("Invalid Argument: Edm needs to have a name of type string.");
        }

        if (this._isEmptyString(edm.label)) {
            throw new Error("Invalid Argument: Edm needs to have a label of type string.");
        }

        if (this._isEmptyString(edm.version)) {
            throw new Error("Invalid Argument: Edm needs to have a version of type string.");
        }

        if (!Array.isArray(edm.tables)) {
            throw new Error("Invalid Argument: Edm needs an array of tables.");
        }

        edm.tables.forEach((table) => {
            this.validateTable(table);
        });

        this.validateRelationships(edm);
    }

    validateColumn(column) {
        if (this._isEmptyString(column.name)) {
            throw new Error("Invalid Argument: Column needs to have a name.");
        }

        if (this._isEmptyString(column.label)) {
            throw new Error("Invalid Argument: Column needs to hava a label.");
        }

        if (this.dataTypeMapping[column.type] == null) {
            throw new Error(`Invalid Argument: Unknown Column Type: ${column.type}.`);
        }

        if (column.isPrimaryKey && column.type !== "Integer") {
            throw new Error("Invalid Argument: If the column is the primary key, it needs to be of typex Integer.");
        }

    }

    validateDecorator(decorator) {
        if (this._isEmptyString(decorator.name)) {
            throw new Error("Invalid Argument: Decorators need to have a name property.");
        }
    }

    validateOneToOneRelationship(relationship) {
        if (this._isEmptyString(relationship.type)) {
            throw new Error("Invalid Argument: One to one relationships needs to have a type property.");
        }

        if (this._isEmptyString(relationship.hasKey)) {
            throw new Error("Invalid Argument: One to one relationships needs to have a hasKey property.");
        }

        if (this._isEmptyString(relationship.hasOne)) {
            throw new Error("Invalid Argument: One to one relationships needs to have a hasOne property.");
        }

        if (this._isEmptyString(relationship.hasOneLabel)) {
            throw new Error("Invalid Argument: One to one relationships needs to have a hasOneLabel property.");
        }

        if (this._isEmptyString(relationship.ofType)) {
            throw new Error("Invalid Argument: One to one relationships needs to have a ofType property.");
        }

        if (this._isEmptyString(relationship.withKey)) {
            throw new Error("Invalid Argument: One to one relationships needs to have a withKey property.");
        }

        if (this._isEmptyString(relationship.withForeignKey)) {
            throw new Error("Invalid Argument: One to one relationships needs to have a withForeignKey property.");
        }

        if (this._isEmptyString(relationship.withOne)) {
            throw new Error("Invalid Argument: One to one relationships needs to have a withOne property.");
        }

        if (this._isEmptyString(relationship.withOneLabel)) {
            throw new Error("Invalid Argument: One to one relationships needs to have a withOneLabel property.");
        }
    }

    validateOneToManyRelationship(relationship) {
        if (this._isEmptyString(relationship.type)) {
            throw new Error("Invalid Argument: One to many relationships needs to have a type property.");
        }

        if (this._isEmptyString(relationship.hasKey)) {
            throw new Error("Invalid Argument: One to many relationships needs to have a hasKey property.");
        }

        if (this._isEmptyString(relationship.hasMany)) {
            throw new Error("Invalid Argument: One to many relationships needs to have a hasMany property.");
        }

        if (this._isEmptyString(relationship.hasManyLabel)) {
            throw new Error("Invalid Argument: One to many relationships needs to have a hasManyLabel property.");
        }

        if (this._isEmptyString(relationship.ofType)) {
            throw new Error("Invalid Argument: One to many relationships needs to have a ofType property.");
        }

        if (this._isEmptyString(relationship.withKey)) {
            throw new Error("Invalid Argument: One to many relationships needs to have a withKey property.");
        }

        if (this._isEmptyString(relationship.withForeignKey)) {
            throw new Error("Invalid Argument: One to many relationships needs to have a withForeignKey property.");
        }

        if (this._isEmptyString(relationship.withOne)) {
            throw new Error("Invalid Argument: One to many relationships needs to have a withOne property.");
        }

        if (this._isEmptyString(relationship.withOneLabel)) {
            throw new Error("Invalid Argument: One to many relationships needs to have a withOneLabel property.");
        }
    }

    validateRelationships(edm) {
        if (edm.relationships == null) {
            throw new Error("Invalid Argument: Edm needs to have a relationships object.");
        }

        if (!Array.isArray(edm.relationships.oneToOne)) {
            throw new Error("Invalid Argument: Edm needs to have a oneToOne array describing one to one relationships. It can be an empty array.");
        }

        if (!Array.isArray(edm.relationships.oneToMany)) {
            throw new Error("Invalid Argument: Edm needs to have a oneToMany array describing one to many relationships. It can be an empty array.");
        }

        edm.relationships.oneToOne.forEach((relationship) => {
            this.validateOneToOneRelationship(relationship);
        });
        edm.relationships.oneToMany.forEach((relationship) => {
            this.validateOneToManyRelationship(relationship);
        });
    }

    validateTable(table) {
        this.validateTableDescriptors(table);

        if (!Array.isArray(table.columns)) {
            throw new Error("Invalid Argument: Table needs to have an array of columns.");
        }

        if (Array.isArray(table.decorators)) {
            table.decorators.forEach((decorator) => {
                this.validateDecorator(decorator);
            });
        }

        let primaryKeyColumns = table.columns.filter((column) => {
            return column.isPrimaryKey;
        });

        table.columns.forEach((column) => {
            this.validateColumn(column);
        });

        if (table.columns.length > 0 && primaryKeyColumns.length !== 1) {
            throw new Error("Invalid Argument: Tables can only have one primary key.");
        }

    }

    validateTableDescriptors(table) {
        if (table == null) {
            throw new Error("Invalid Argument: Table cannot be null or undefined.");
        }

        if (typeof table !== "object" || Array.isArray(table)) {
            throw new Error("Invalid Argument: Table needs to be an object.");
        }

        if (this._isEmptyString(table.name)) {
            throw new Error("Invalid Argument: Table needs to have a name.");
        }

        if (this._isEmptyString(table.label)) {
            throw new Error("Invalid Argument: Table needs to have a label.");
        }

        if (this._isEmptyString(table.pluralLabel)) {
            throw new Error("Invalid Argument: Table needs to have a pluralLabel.");
        }

    }
}