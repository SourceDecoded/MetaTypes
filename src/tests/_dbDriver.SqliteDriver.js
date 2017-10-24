import assert from "assert";
import SqliteDriver from "../dbDriver/SqliteDriver";

let fileConfig = {
    "storageMode": "file",
    "path": "",
    "edmDb": "edm.sqlite",
    "dataDb": "data.sqlite"
};

let memoryConfig = {
    "storageMode": "memory"
};

exports["SqliteDriver in memory mode"] = () => {
    let driver = new SqliteDriver(memoryConfig);
    assert(driver);
};

exports["SqliteDriver.getEdmDbAsync"] = () => {
    let driver = new SqliteDriver(memoryConfig);
    driver.getEdmDbAsync().then((db) => {
        assert(db);
    }).catch((e) => {
        assert.fail(e);
    }).then(() => {
        driver.dispose();
    });
};

exports["SqliteDriver.getDataDbAsync"] = () => {
    let driver = new SqliteDriver(memoryConfig);
    driver.getDataDbAsync().then((db) => {
        assert(db);
    }).catch((e) => {
        assert.fail(e);
    }).then(() => {
        driver.dispose();
    });
};

exports["SqliteDriver.getEdmListAsync"] = () => {
    let driver = new SqliteDriver(memoryConfig);
    driver.getEdmListAsync().then((edms) => {
        assert(typeof edms.length !== "undefined");
    }).catch((e) => {
        assert.fail(e);
    }).then(() => {
        driver.dispose();
    });
};

