import MigrationRunner from "./../migration/Runner";
import Edm from "./../edm/Edm";
import EdmMigrator from "./../edm/Migrator";
import assert from "assert";
import Command from "./../migration/Command";

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
        addTableAsync: ()=>{
            addTableAsyncCount++;
        }
    };

    let runner = new MigrationRunner({
        edm: edm,
        migrator: migrator
    });

    let command = new Command();
    command.execute.action = "addTable";
    command.execute.options = {
        name: "TestTable",
        label: "Test Table",
        pluralLabel: "Test Tables"
    };

    command.revert.action = "removeTable";
    command.revert.options = {
        name: "TestTable",
        label: "Test Table",
        pluralLabel: "Test Tables"
    };

    return runner.migrateAsync([command]).then(() => {
        assert.equal(edm.tables.length, 1);
        assert.equal(edm.tables[0].name, "TestTable");
        assert.equal(addTableAsyncCount, 1);
    });
}