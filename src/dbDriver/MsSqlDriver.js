// SqlServerDriver.js
import mssql from "mssql";
import MsSqlDatabase from "../mssql/Database";
import MsSqlMigrator  from "../mssql/Migrator";
import Edm from "../edm/Edm";

let generateEdmCreateSql = function(options) {
    return `CREATE TABLE ${options.edmSchema}.${options.edmTable}(
        [id] [int] IDENTITY(1,1) NOT NULL,
        [json] [text] NOT NULL,
        [name] [varchar](100) NOT NULL,
        [version] [int],
     CONSTRAINT [PK_edm.edm] PRIMARY KEY CLUSTERED 
    (
        [id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]`;
}

let generateGetEdmsQuery = function(options) {
    return `SELECT [id], [json], [name], [version] 
    FROM ${options.edmSchema}.${options.edmTable}`;
}

export default class {

    constructor(options = {}) {
        if (!options.user) {
            throw new Error("MsSqlDriver requires a user");
        }
        if (!options.password) {
            throw new Error("MsSqlDriver requires a password");
        }
        if (!options.server) {
            throw new Error("MsSqlDriver requires a server");
        }

        options.edmDb = options.edmDb || "GLASS_edm";
        options.edmSchema = options.edmSchema || "dbo";
        options.edmTable = options.edmTable || "edm";
        options.dataSchema = options.dataSchema || "dbo";
        options.dataDb = options.dataDb || "GLASS_data";

        this.options = options;

        this._edmPool = new mssql.ConnectionPool({
            user: options.user,
            password: options.password,
            server: options.server,
            database: options.edmDb
        });
        this._edmPool.on("error", (e) => {
            console.error(e);
        });
        this._edmPoolPromise = this._edmPool.connect();

        this._dataPool = new mssql.ConnectionPool({
            user: options.user,
            password: options.password,
            server: options.server,
            database: options.dataDb
        });
        this._dataPool.on("error", (e) => {
            console.error(e);
        });
        this._dataPoolPromise = this._dataPool.connect();

    }

    getEdmDbAsync() {
        return this._edmPoolPromise.then(() => this._edmPool);
    }

    getDataDbAsync() {
        return this._dataPoolPromise.then(() => this._dataPool);
    }

    getEdmListAsync() {
        return this._verifyEdmTableAsync().then((pool) => {
            return pool.request().query(generateGetEdmsQuery(this.options));
        }).then((result) => {
            return result.recordset;
        });
    }

    getEdmAsync(name, version) {
        return this._getEdmDbAsync().then((pool) => {
            return pool.request().query(`SELECT * FROM [${this.options.edmSchema}].[${this.options.edmTable}] WHERE
            [version]=${version} AND [name]='${name}'`).then((result) => {
                return result.recordset[0];
            });
        });
    };

    addEdmAsync(name, version) {
        var newEdm = new Edm();
        return this._getEdmDbAsync().then((pool) => {
            return pool.request().query(`INSERT INTO [${this.options.edmSchema}].[${this.options.edmTable}] 
            (name, version, json) VALUES ('${name}', '${version}', '${JSON.stringify(newEdm)}')`).then((result) => {
                return;
            });
        });
    };

    deleteEdmAsync(name, version) {
        return this._getEdmDbAsync().then((pool) => {
            return pool.request().query(`DELETE FROM [${this.options.edmSchema}].[${this.options.edmTable}]
            WHERE [version]=${version} AND [name]='${name}'`).then(() => {
                return;
            });
        });
    };

    getDatabaseForEdmAsync(edm) {
        return this.getDataDbAsync().then((pool) => {
            return new MsSqlDatabase({
                edm: edm,
                mssqlDatabase: pool,
                schema: this.options.dataSchema
            });
        });
    }

    getMigrator() {
        return new MsSqlMigrator(this._edmPoolPromise);
    }

    dispose() {
        this.getEdmDbAsync().then((pool) => {
            pool.close();
        });
        this.getDataDbAsync().then((pool) => {
            pool.close();
        });
    }

    _checkEdmDbExistsAsync(pool) {
        return new Promise((resolve, reject) => {
            pool.request().query(`SELECT * FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = '${this.options.edmSchema}' 
            AND TABLE_NAME = '${this.options.edmTable}'`).then((result) => {
                if (result.recordset.length === 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    _verifyEdmTableAsync() {
        return this.getEdmDbAsync().then((pool) => {
            return this._checkEdmDbExistsAsync(pool).then((exists) => {
                if (exists) {
                    return pool;
                } else {
                    return pool.query(generateEdmCreateSql(this.options)).then(() => {
                        return pool;
                    });
                }
            });
        });
    }
}