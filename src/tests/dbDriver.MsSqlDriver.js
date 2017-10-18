import assert from "assert";
import edm from "../mock/edm";
import mssql from "mssql";
import MsSqlDriver from "../dbDriver/MsSqlDriver";

let dbConfig = {
    user: "home_user",
    password: "3XV%t*oMeVF$79qZuW",
    server: "lgutsql01",
    database: "Home",
    dataDb: "Home",
    edmDb: "Home",
    edmSchema: "dbo",
    dataSchema: "dbo"
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

