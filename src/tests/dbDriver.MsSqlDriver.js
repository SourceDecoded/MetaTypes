import assert from "assert";
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
    dataSchema: "dbo",
    edmTable: "edm"
};

let cleanEdmDbAsync = function(dbDriver){
    return dbDriver.getEdmDbAsync().then((pool) => {
        return pool.request().query(`DELETE FROM [${dbConfig.edmSchema}].[${dbConfig.edmTable}]`);
    });
};

exports["dbDriver.MsSqlDriver can connect"] = () => {
    
    mssql.connect(dbConfig).then((pool) => {
        return true;
    }).catch((e) => {
        return false;
    }).then((connected) => {
        mssql.close();
        assert(connected);
    });

};

exports["dbDriver.MsSqlDriver()"] = () => {
    var dbDriver = new MsSqlDriver(dbConfig);
    assert(dbDriver);
    dbDriver.dispose();
};

exports["dbDriver.MsSqlDriver.getEdmDbAsync"] = () => {
    var dbDriver = new MsSqlDriver(dbConfig);
    dbDriver.getEdmDbAsync().then((db) => {
        assert(db);
        dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};

exports["dbDriver.MsSqlDriver.getDataDbAsync"] = () => {
    var dbDriver = new MsSqlDriver(dbConfig);
    dbDriver.getDataDbAsync().then((db) => {
        assert(db);
        dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};

exports["dbDriver.MsSqlDriver._verifyEdmTableAsync"] = () => {
    var dbDriver = new MsSqlDriver(dbConfig);
    dbDriver._verifyEdmTableAsync().then((pool) => {
        assert(pool);
        dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};

exports["dbDriver.MsSqlDriver.getEdmListAsync"] = () => {
    var dbDriver = new MsSqlDriver(dbConfig);
    dbDriver.getEdmListAsync().then((edmList) => {
        assert(typeof edmList.length !== "undefined");
        dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};

exports["dbDriver.MsSqlDriver.getDatabaseForEdmAsync"] = () => {
    var dbDriver = new MsSqlDriver(dbConfig);
    dbDriver.getDatabaseForEdmAsync(edm).then((idb) => {
        assert(idb);
        dbDriver.dispose();
    }).catch((e) => {
        assert.fail(e.message);
    });
};

exports["dbDriver.MsSqlDriver add and get EDM"] = () => {
    var dbDriver = new MsSqlDriver(dbConfig);
    cleanEdmDbAsync(dbDriver).then(() => {
        dbDriver.addEdmAsync("testEDM", "0.0.1", "a label").then(() => {
            return dbDriver.getEdmAsync("testEDM", "0.0.1").then((edm) => {
                assert(edm);
            });
        }).catch((e) => {
            assert.fail(e.message);
        }).then(() => {
            dbDriver.deleteEdmAsync("testEDM", "0.0.1").then(() => {
                dbDriver.dispose();
            });
        });
    });
};

exports["dbDriver.MsSqlDriver add duplicate EDM"] = () => {
    var dbDriver = new MsSqlDriver(dbConfig);
    dbDriver.addEdmAsync("dupetest", "0.0.1", "label").then(() => {
        return dbDriver.addEdmAsync("dupetest", "0.0.1").then(() => {});
    }).then(() => {
        assert.fail("Duplicate EDM allowed to be added");
    }).catch((e) => {
        assert.equal(e.message, "An EDM with that name and version already exists");
    }).then(() => {
        return dbDriver.deleteEdmAsync("dupetest", "0.0.1");
    }).then(() => {
        dbDriver.dispose();
    });
}
