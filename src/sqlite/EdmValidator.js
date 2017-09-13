import dataTypeMapping from "./dataTypeMapping";

export default class EdmValidator {
    constructor() {

    }

    validate(edm) {
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

        edm.tables.forEach((table) => {
            this.validateTable(table);
        });

        this.validateRelationships(edm);
    }

    validateColumn(column) {
        if (column.name == null) {
            throw new Error("Column needs to have a name.");
        }

        if (column.label == null) {
            throw new Error("Column needs to hava a label.");
        }

        if (dataTypeMapping[column.type] == null) {
            throw new Error(`Unknown Column Type: ${column.type}.`);
        }

    }


    validateOneToOneRelationship(relationship) {
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

    validateOneToManyRelationship(relationship) {
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

    validateRelationships(edm) {
        if (edm.relationships == null) {
            throw new Error("Edm needs to have a relationships object.");
        }

        if (!Array.isArray(edm.relationships.oneToOne)) {
            throw new Error("Edm needs to have a oneToOne array describing one to one relationships. It can be an empty array.");
        }

        if (!Array.isArray(edm.relationships.oneToMany)) {
            throw new Error("Edm needs to have a oneToMany array describing one to many relationships. It can be an empty array.");
        }

        edm.relationships.oneToOne.forEach((relationship) => {
            this.validateOneToOneRelationship(relationship);
        });

        edm.relationships.oneToMany.forEach((relationship) => {
            this.validateOneToManyRelationship(relationship);
        });
    }

    validateTable(table) {
        if (table.name == null) {
            throw new Error("Table needs to have a name.");
        }

        if (table.label == null) {
            throw new Error("Table needs to have a label.");
        }

        if (table.pluralLabel == null) {
            throw new Error("Table needs to have a pluralLabel.");
        }

        let primaryKeyColumns = table.columns.filter((column) => {
            return column.isPrimaryKey;
        });

        if (primaryKeyColumns.length !== 1) {
            throw new Error("Tables can only have one primary key.");
        }

        table.columns.forEach((column) => {
            this.validateColumn(column);
        });

    }
}