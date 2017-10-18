import assert from "assert";
import Database from "../mssql/Database";
import edm from "../mock/edm";
import mssql from "mssql";
import MsSqlDriver from "../dbDriver/MsSqlDriver";

let dbConfig = {
    user: "home_user",
    password: "3XV%t*oMeVF$79qZuW",
    server: "lgutsql01",
    database: "Home"
};

exports["mssql.Database can connect"] = () => {

    mssql.connect(dbConfig).then((pool) => {
        return true;
    }).catch((e) => {
        return false;
    }).then((connected) => {
        assert(connected);
    });

};

exports["mssql.Database"] = () => {
    let dbDriver = new MsSqlDriver(dbConfig);
    dbDriver.getDatabaseForEdmAsync(edm).then((dbConnection) => {
        let config = {
            mssqlDatabase: dbConnection,
            edm: edm,
            schema: "dbo"
        };
        
        let db = new Database();

        assert(db);
    });
    
};

exports ["mssql.Database._getTableBuildOrder"] = () => {
    let db = MsSqlDatabase
    let options = {
        mssqlDatabase: "",
        edm: edm,
        schema: "dbo"
    };
};