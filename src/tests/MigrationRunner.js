import MigrationRunner from "./../MigrationRunner";
import assert from "assert";

exports["MigrationRunner.constructor: empty options"] = () => {
    assert.throws(() => {
        let runner = new MigrationRunner();
    });
}

exports["MigrationRunner.constructor: null edm."] = () => {
    assert.throws(() => {
        let runner = new MigrationRunner({
            edm: null
        });
    });
}

exports["MigrationRunner.constructor: invalid history."] = () => {
    assert.throws(() => {
        let runner = new MigrationRunner({
            history: "blah"
        });
    });
}
