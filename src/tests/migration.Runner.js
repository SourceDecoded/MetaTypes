import MigrationRunner from "./../migration/Runner";
import Edm from "./../edm/Edm";
import EdmMigrator from "./../edm/Migrator";
import assert from "assert";
import CommandBuilder from "./../migration/CommandBuilder";
import Command from "./../migration/Command";

let commandBuilder = new CommandBuilder();

exports["migration.Runner.constructor: empty options"] = () => {
    assert.throws(() => {
        let runner = new MigrationRunner();
    });
};

exports["migration.Runner.constructor: null edm."] = () => {
    assert.throws(() => {
        let runner = new MigrationRunner({
            edm: null
        });
    });
};

exports["migration.Runner.constructor: Invalid Migrator."] = () => {
    let edm = new Edm();
    edm.name = "Test";
    edm.version = "0.0.1";

    assert.throws(() => {
        let runner = new MigrationRunner({
            edm: edm,
            migrator: {
                name: null
            }
        });
    });
};

exports["migration.Runner.migrateAction: addTableAsync"] = () => {
    let addTableAsyncCount = 0;

    let edm = new Edm();
    edm.name = "Test";
    edm.label = "Test";
    edm.version = "0.0.1";

    let migrator = {
        name: "mockMigrator",
        addTableAsync() {
            addTableAsyncCount++;
        }
    };

    let runner = new MigrationRunner({
        edm: edm,
        migrator: migrator
    });

    let command = commandBuilder.createAddTableCommand({
        name: "Person",
        label: "Person",
        pluralLabel: "People"
    });

    return runner.migrateAsync([command]).then(() => {
        assert.equal(edm.tables.length, 1);
        assert.equal(edm.tables[0].name, "Person");
        assert.equal(edm.tables[0].label, "Person");
        assert.equal(edm.tables[0].pluralLabel, "People");
        assert.equal(addTableAsyncCount, 1);
    });
}

exports["migration.Runner.migrateAction: addTableAsync and addColumnAsync"] = () => {
    let addTableAsyncCount = 0;
    let addColumnAsyncCount = 0;

    let edm = new Edm();
    edm.name = "Test";
    edm.label = "Test";
    edm.version = "0.0.1";

    let migrator = {
        name: "mockMigrator",
        addTableAsync() {
            addTableAsyncCount++;
        },
        addColumnAsync() {
            addColumnAsyncCount++;
        }
    };

    let runner = new MigrationRunner({
        edm: edm,
        migrator: migrator
    });

    let tableCommand = commandBuilder.createAddTableCommand({
        name: "Person",
        label: "Person",
        pluralLabel: "People"
    });

    let columnCommand = commandBuilder.createAddColumnCommand("Person", {
        type: "Integer",
        name: "id",
        label: "Identifier",
        isPrimaryKey: true
    });

    return runner.migrateAsync([tableCommand, columnCommand]).then(() => {
        assert.equal(edm.tables.length, 1);
        assert.equal(addTableAsyncCount, 1);
        assert.equal(addColumnAsyncCount, 1);

        let personTable = edm.tables[0];
        let idColumn = personTable.columns[0];

        assert.equal(personTable.name, "Person");
        assert.equal(personTable.label, "Person");
        assert.equal(personTable.pluralLabel, "People");
        assert.equal(idColumn.name, "id");
        assert.equal(idColumn.label, "Identifier");

    });
}

exports["migration.Runner.migrateAction: addTableAsync, addColumnAsync and with a invalid action and successfully rollback."] = () => {
    let addTableAsyncCount = 0;
    let addColumnAsyncCount = 0;

    let edm = new Edm();
    edm.name = "Test";
    edm.label = "Test";
    edm.version = "0.0.1";

    let migrator = {
        name: "mockMigrator",
        addTableAsync() {
            addTableAsyncCount++;
        },
        addColumnAsync() {
            addColumnAsyncCount++;
        },
        removeTableAsync() {
            addTableAsyncCount--;
        },
        removeColumnAsync() {
            addColumnAsyncCount--;
        }
    };

    let runner = new MigrationRunner({
        edm: edm,
        migrator: migrator
    });

    let tableCommand = commandBuilder.createAddTableCommand({
        name: "Person",
        label: "Person",
        pluralLabel: "People"
    });

    let columnCommand = commandBuilder.createAddColumnCommand("Person", {
        type: "Integer",
        name: "id",
        label: "Identifier",
        isPrimaryKey: true,
        isIndexed: false
    });

    let invalidCommand = new Command();
    invalidCommand.execute.action = "badAction";
    invalidCommand.revert.action = "anotherBadAction";

    return runner.migrateAsync([tableCommand, columnCommand, invalidCommand]).then(() => {
        assert.ok(false, "Supposed to fail with invalid action.");
    }).catch((error) => {
        assert.equal(edm.tables.length, 0);
        assert.equal(addTableAsyncCount, 0);
        assert.equal(addColumnAsyncCount, 0);
    });
}

exports["migration.Runner.migrateAction: addTableAsync, addColumnAsync with consequential commands and with a invalid action and successfully rollback."] = () => {
    let addTableAsyncCount = 0;
    let addColumnAsyncCount = 0;
    let updateColumnAsyncCount = 0;

    let edm = new Edm();
    edm.name = "Test";
    edm.label = "Test";
    edm.version = "0.0.1";

    let migrator = {
        name: "mockMigrator",
        addTableAsync() {
            addTableAsyncCount++;
        },
        addColumnAsync(options) {
            addColumnAsyncCount++;

            let newColumn = Object.assign({}, options.column, {
                isIndexed: true
            });

            let invalidCommand = new Command();
            invalidCommand.execute.action = "badAction";
            invalidCommand.revert.action = "anotherBadAction";

            return [
                commandBuilder.createUpdateColumnCommand(options.tableName, options.column, newColumn),
                invalidCommand
            ];
        },
        removeTableAsync() {
            addTableAsyncCount--;
        },
        removeColumnAsync() {
            addColumnAsyncCount--;
        },
        updateColumnAsync(options) {
            if (updateColumnAsyncCount === 0) {
                assert.equal(options.column.isIndexed, true);
            } else if (updateColumnAsyncCount === 1) {
                assert.equal(options.column.isIndexed, false);
            }
            updateColumnAsyncCount++;
        }
    };

    let runner = new MigrationRunner({
        edm: edm,
        migrator: migrator
    });

    let tableCommand = commandBuilder.createAddTableCommand({
        name: "Person",
        label: "Person",
        pluralLabel: "People"
    });

    let columnCommand = commandBuilder.createAddColumnCommand("Person", {
        type: "Integer",
        name: "id",
        label: "Identifier",
        isPrimaryKey: true
    });

    return runner.migrateAsync([tableCommand, columnCommand]).then(() => {
        assert.ok(false, "Supposed to fail with invalid action.");
    }).catch((error) => {
        assert.equal(edm.tables.length, 0);
        assert.equal(addTableAsyncCount, 0);
        assert.equal(addColumnAsyncCount, 0);
        assert.equal(updateColumnAsyncCount % 2, 0);
    });
}