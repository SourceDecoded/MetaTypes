// SqlServerDriver.js
import mssql from "mssql";

generateEdmCreateSql = function(options) {
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

generateGetEdmsQuery = function(options) {
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

        this._edmPoolPromse = mssql.connect({
            user: options.user,
            password: options.password,
            server: options.server,
            database: options.edmDb
        });

        this._dataPoolPromise = mssql.connect({
            user: options.user,
            password: options.password,
            server: options.server,
            database: options.edmDb
        });
    }

    getEdmDbAsync() {
        return this._edmPoolPromse;
    }

    getDataDbAsync() {
        return this._dataPoolPromise;
    }

    getEdmListAsync() {
        return _verifyEdmTableAsync().then((pool) => {
            return pool.query(generateGetEdmsQuery(this.options));
        });
    }

    getDatabaseForEdmAsync(edm) {
        return this.getDataDbAsync().then((pool) => {
            return new MsSqlDatabase({
                edm: edm,
                mssqlDatabase: pool
            });
        });
    }

    _checkEdmDbExistsAsync(pool) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = ${this.options.edmSchema} 
            AND  TABLE_NAME = ${this.options.edmTable}`).then((result) => {
                if (result.length === 1) {
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
            this._checkEdmDbExistsAsync(pool).then((exists) => {
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