import assert from "assert";
import Database from "../mssql/Database";
import edm from "../mock/edm";
import mssql from "mssql";
import MsSqlDatabase from "../dbDriver/MsSqlDriver";

let dbConfig = {
    user: "home_user",
    password: "3XV%t*oMeVF$79qZuW",
    server: "lgutsql01",
    database: "Home"
};

exports["mssql.Database can connect"] = () => {
    mssql.connect(dbConfig).then((pool) => {
        // success!
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