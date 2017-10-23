import assert from "assert";
import Database from "../mssql/Database";
import edm from "../mock/edm";
import mssql from "mssql";
import MsSqlDriver from "../dbDriver/MsSqlDriver";

let dbConfig = {
    user: process.env.META_DB_TEST_USER,
    password: process.env.META_DB_TEST_PW,
    server: process.env.META_DB_TEST_SERVER,
    database: process.env.META_DB_TEST_DB,
    dataDb: process.env.META_DB_TEST_DB_DATA,
    edmDb: process.env.META_DB_TEST_DB_EDM,
    edmSchema: "dbo",
    dataSchema: "dbo"
};

let setupAsync = () => {
    return new Promise((resolve, reject) => {
        let dbDriver = new MsSqlDriver(dbConfig);
        dbDriver.getDatabaseForEdmAsync(edm).then((db) => {           
            resolve({
                dbDriver: dbDriver,
                instance: db
            });
        });
    });
    
};

exports["mssql.Database constructor"] = () => {
    setupAsync().then((setup) => {
        assert(setup.instance);
        setup.dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};

exports["mssql.Database._createTables"] = () => {
    setupAsync().then((setup) => {
        setup.instance._createTables();
        setup.dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};

exports["mssql.Database._getTableFromEdm"] = () => {
    setupAsync().then((setup) => {
        let table = setup.instance._getTableFromEdm("Source");
        assert(table);
        setup.dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};

exports["mssql.Database._getTableBuildOrder"] = () => {
    setupAsync().then((setup) => {
        let buildOrder = setup.instance._getTableBuildOrder();
        assert(buildOrder.length > 0);
        setup.dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};

exports["mssql.Database.createAsync"] = () => {
    setupAsync().then((setup) => {
        setup.instance.createAsync().then(() => {
            assert(true);
        }).catch((e) => {
            assert.fail((e.message));
        }).then(() => {
            setup.dbDriver.dispose();
        });
    }).catch(() => {
        assert.fail(e.message);
    });
};

exports["mssql.Database.dropAsync"] = () => {
    setupAsync().then((setup) => {
        setup.instance.dropAsync().then(() => {
            assert(true);
        }).catch((e) => {
            assert.fail(e.message);
        }).then(() => {
            setup.dbDriver.dispose();
        });
    }).catch(() => {
        assert.fail(e.message);
    });
};

exports["mssql.Database.getTable"] = () => {
    setupAsync().then((setup) => {
        let table = setup.instance.getTable("Source");
        assert(table);
        setup.dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};

exports["mssql.Database.getTables"] = () => {
    setupAsync().then((setup) => {
        let tables = setup.instance.getTables();
        assert(tables.length > 0);
        setup.dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};
