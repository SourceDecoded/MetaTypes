import assert from "assert";
import EdmValidator from "./../EdmValidator";

exports["EdmValidator.validate: Empty."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
        validator.validate();
    }, /Invalid Argument: Edm cannot be null/);
}

exports["EdmValidator.validate: Bad edm name."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
        validator.validate({
            name: {}
        });
    }, /Invalid Argument: Edm needs to have a name of type string/);
}

exports["EdmValidator.validate: Bad edm label."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
        validator.validate({
            name: "edm",
            label: {}
        });
    }, /Invalid Argument: Edm needs to have a label of type string/);
}

exports["EdmValidator.validate: Bad edm version."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: {}
        });
    }, /Invalid Argument: Edm needs to have a version of type string/);
}

exports["EdmValidator.validate: Bad edm tables."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            table: {}
        });
    }, /Invalid Argument: Edm needs an array of tables/);
}

exports["EdmValidator.validate: A null table."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [null]
        });
    }, /Invalid Argument: Table cannot be null or undefined/);
}

exports["EdmValidator.validate: An invalid table as an array."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [[]]
        });
    }, /Invalid Argument: Table needs to be an object/);
}

exports["EdmValidator.validate: An invalid table name."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [{
                name: {}
            }]
        });
    }, /Invalid Argument: Table needs to have a name/);
}

exports["EdmValidator.validate: An invalid table label."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
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
}

exports["EdmValidator.validate: An invalid table pluralLabel."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
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
}

exports["EdmValidator.validate: An invalid columns."] = () => {
    let validator = new EdmValidator();

    assert.throws(() => {
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
}

exports["EdmValidator.validate: Valid empty column table."] = () => {
    let validator = new EdmValidator();

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
}

exports["EdmValidator.validate: Invalid column name."] = () => {
    let validator = new EdmValidator();
    assert.throws(() => {
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

}

exports["EdmValidator.validate: Invalid column label."] = () => {
    let validator = new EdmValidator();
    assert.throws(() => {
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

}

exports["EdmValidator.validate: Invalid table with no primary key."] = () => {
    let validator = new EdmValidator();
    assert.throws(() => {
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

}

exports["EdmValidator.validate: Valid table with valid columns."] = () => {
    let validator = new EdmValidator();
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

}

exports["EdmValidator.validate: Invalid table with no primary key."] = () => {
    let validator = new EdmValidator();
    assert.throws(() => {
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

}

exports["EdmValidator.validate: Invalid oneToOne type."] = () => {
    let validator = new EdmValidator();
    assert.throws(() => {
        validator.validate({
            name: "edm",
            label: "Edm",
            version: "0.0.1",
            tables: [],
            relationships: {
                oneToOne: [{
                    type: {},
                }],
                oneToMany: []
            }
        });
    }, /Invalid Argument: One to one relationships needs to have a type property/);

}

exports["EdmValidator.validate: Invalid oneToOne hasKey."] = () => {
    let validator = new EdmValidator();
    assert.throws(() => {
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

}