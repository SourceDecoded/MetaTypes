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
        [version] [varchar](10),
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
            return result.recordset.map((result) => {
                return JSON.parse(result.json);
            });
        });
    }

    getEdmAsync(name, version) {
        return this.getEdmDbAsync().then((pool) => {
            let req = pool.request();
            req.input("name", name);
            req.input("version", version);
            return req.query(`SELECT * FROM [${this.options.edmSchema}].[${this.options.edmTable}] ` +
                   `WHERE [version]=@version AND [name]=@name`).then((result) => {
                if (result.recordset[0]) {
                    return JSON.parse(result.recordset[0].json);
                } else {
                    return null;
                }
            });
        });
    };

    addEdmAsync(name, version, label = "") {
        var newEdm = new Edm();
        newEdm.name = name;
        newEdm.version = version;
        newEdm.label = label;
        return this.getEdmAsync(name, version).then((edm) => {
            if (edm) {
                return Promise.reject(new Error("An EDM with that name and version already exists"));
            } else {
                return this.getEdmDbAsync().then((pool) => {
                    let req = pool.request();
                    req.input("name", name);
                    req.input("version", version);
                    req.input("json", JSON.stringify(newEdm));
                    return req.query(`INSERT INTO [${this.options.edmSchema}].[${this.options.edmTable}] ` + 
                        `(name, version, json) VALUES (@name, @version, @json)`);
                });
            }
        });
    };

    updateEdmAsync(newEdm) {
        return this.getEdmDbAsync().then((pool) => {
            let req = pool.request();
            req.input('json', JSON.stringify(newEdm));
            req.input('name', newEdm.name);
            req.input('version', newEdm.version);
            return req.query(`UPDATE [${this.options.edmSchema}].[${this.options.edmTable}] `+
                `SET [json]=@json WHERE name=@name AND version=@version`);
        });
    };

    deleteEdmAsync(name, version) {
        return this.getEdmDbAsync().then((pool) => {
            let req = pool.request();
            req.input('version', version);
            req.input('name', name);
            return req.query(`DELETE FROM [${this.options.edmSchema}].[${this.options.edmTable}] ` +
                `WHERE [version]=@version AND [name]=@name`);
        });
    };

    getDatabaseForEdmAsync(edm) {
        return this.getDataDbAsync().then((pool) => {
            return new MsSqlDatabase({
                edm: edm,
                connectionPool: pool,
                schema: this.options.dataSchema
            });
        });
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
            let q = `SELECT * FROM INFORMATION_SCHEMA.TABLES ` + 
            `WHERE TABLE_SCHEMA = '${this.options.edmSchema}' ` +
            `AND TABLE_NAME = '${this.options.edmTable}'`;
            pool.request().query(q).then((result) => {
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
                    let q = generateEdmCreateSql(this.options);
                    return pool.request().query(q).then(() => {
                        return pool;
                    });
                }
            });
        });
    }
}