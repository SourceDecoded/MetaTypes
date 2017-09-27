import MigrationRunner from "./../migration/Runner";
import assert from "assert";

exports["migration.Runner.constructor: empty options"] = () => {
    assert.throws(() => {
        let runner = new MigrationRunner();
    });
}

exports["migration.Runner.constructor: null edm."] = () => {
    assert.throws(() => {
        let runner = new MigrationRunner({
            edm: null
        });
    });
}

exports["migration.Runner.constructor: invalid history."] = () => {
    assert.throws(() => {
        let runner = new MigrationRunner({
            history: "blah"
        });
    });
}
