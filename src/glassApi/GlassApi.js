// GlassDb
// Manages a set of GlassPanes
import GlassPane from "../glassPane/GlassPane";
import MigrationRunner from "../migration/Runner";
import MetaDatabase from "../meta/Database";
import MsSqlDriver from "../dbDriver/MsSqlDriver";
import SqliteDriver from "../dbDriver/SqliteDriver";
import ExpressDoor from "../glassDoor/GlassExpressDoor";
import LocalFileSystem from "../util/LocalFileSystem";
import EventEmitter from "events";

let supportedDrivers = {
    "sqlite": SqliteDriver,
    "mssql": MsSqlDriver
};

let supportedFileSystems = {
    "localFileSystem": LocalFileSystem
};

let supportedDoors = {
    "express": ExpressDoor
};

/*
{
    "dbDriver": {
        "name": "mssql" || "sqlite",
        "options": {(driver-specific options)}
    },
    "fileSystem": {
        "name": "fsDriverName",
        "options": {(fs driver-specific options)}
    },
    "doors": [
        {
            "name": "express",
            "options": {
                "address":"0.0.0.0",
                "port":"9000"
            }
        }
    ],
    "authenticator": (iAuthenticator),
    "actions":[
        {
            "name":"actionName",
            "scope": "api" || "edm" || "table" || "entity",
            "match": {
                "edm":"edmName",
                "version":"versionString" || "*",
                "table":"post"
            },
            "executeAsync":(actionOptions)
        }
    ]
}

actionOptions {
    "metaDatabase": metaDatabase || undefined,
    "edm":edm || undefined,
    "tableName": "name" || undefined,
    "entity": entity || undefined,
    "body": requestBody || undefined,
    "query": requestQuery || undefined,
    "user": user
}
*/

export default class extends EventEmitter {
    constructor(options = {}) {
        super();
        this.glassPanes = {};
        this.glassDoors = [];
        this.authenticator =  options.authenticator;
        this.decorators = options.decorators || [];
        this.actions = {"api":{}, "edm":{}, "table":{}, "entity":{}};

        if (!options.dbDriver) {
            throw new Error("Need dbDriver info");
        }

        let dbDriver = options.dbDriver;

        if (Object.keys(supportedDrivers).indexOf(dbDriver.name) === -1) {
            throw new Error(`Unsupported dbDriver: ${dbDriver.name}`);
        }
        
        this._driver = new supportedDrivers[dbDriver.name](dbDriver.options);

        this._fileSystem = new supportedFileSystems[options.fileSystem.name](options.fileSystem.options);

        if (options.actions) {
            options.actions.forEach((action) => {
                this.registerAction(action);
            });
        }
        
        this._driver.getEdmListAsync().then((edms) => {
            return this._buildPanesAsync(edms);
        }).then(() => {
            return this._openDoorsAsync(options.doors);
        }).then(() => {
            this.emit("ready");
        }).catch((error) => {
            this.emit("error", error);
        });
    }

    dispose() {
        this.glassDoors.forEach((door) => {
            if (typeof door.dispose === "function") {
                door.dispose();
            }
        });
        
        Object.keys(this.glassPanes).forEach((key) => {
            this.glassPanes[key].dispose();
        });
    }

    getEdmAsync(name, version) {
        return this._driver.getEdmAsync(name, version);
    }

    addEdmAsync(name, version, label) {
        return this._driver.addEdmAsync(name, version, label).then(() => {
            return this._driver.getEdmAsync(name, version);
        }).then((edm) => {
            return this._buildPaneAsync(edm);
        }).then((pane) => {
            Object.keys(this.glassDoors).map((key) => this.glassDoors[key]).forEach((door) => {
                door.addPane(pane);
            });
        });
    }

    deleteEdmAsync(name, version) {
        let thePane = this.glassPanes[name + version];
        if (!thePane) {
            return Promise.reject(`Not an active EDM: ${name} ${version}`);
        }
        return this._driver.deleteEdmAsync(name, version).then(() => {
            this.glassPanes[name + version].dispose();
            delete this.glassPanes[name + version];
        });
    }

    updateEdmAsync(newEdm) {
        let {name, version} = newEdm;
        let thePane = this.glassPanes[name + version];
        if (!thePane) {
            return Promise.reject(`Not an active EDM: ${name} ${version}`);
        }
        return this._driver.updateEdmAsync(newEdm);
    }

    registerAction(action) {
        if (action.scope === "api") {
            this.actions.api[action.name] = action;
        } else if (action.scope === "edm") {
            this.actions.edm[action.match.edm] = this.actions.edm[action.match.edm] || {};
            this.actions.edm[action.match.edm][action.match.version] = this.actions.edm[action.match.edm][action.match.version] || {};
            this.actions.edm[action.match.edm][action.match.version][action.name] = action;
        } else if (action.scope === "table") {
            this.actions.table[action.match.edm] = this.actions.table[action.match.edm] || {};
            this.actions.table[action.match.edm][action.match.version] = this.actions.table[action.match.edm][action.match.version] || {};
            this.actions.table[action.match.edm][action.match.version][action.match.table] = this.actions.table[action.match.edm][action.match.version][action.match.table] || {};
            this.actions.table[action.match.edm][action.match.version][action.match.table][action.name] = action;
        } else if (action.scope === "entity") {
            this.actions.entity[action.match.edm] = this.actions.table[action.match.edm] || {};
            this.actions.entity[action.match.edm][action.match.version] = this.actions.entity[action.match.edm][action.match.version] || {};
            this.actions.entity[action.match.edm][action.match.version][action.match.table] = this.actions.entity[action.match.edm][action.match.version][action.match.table] || {};
            this.actions.entity[action.match.edm][action.match.version][action.match.table][action.name] = action;
        }
    }

    executeApiActionAsync(actionName, options) {
        if (!this.actions.api[actionName]) {
            return Promise.reject("API action not found: " + actionName);
        }
        return this.actions.api[actionName].executeAsync(options);
    }

    _buildPanesAsync(edms) {
        return edms.reduce((previous, current) => {
            return previous.then(() => {
                return this._buildPaneAsync(current);
            });
        }, Promise.resolve());
    }

    _buildPaneAsync(edm) {
        return this._driver.getDatabaseForEdmAsync(edm).then((db) => {
            let actions = {"edm":{}, "table":{}, "entity":{}};

            if (this.actions.edm[edm.name] && this.actions.edm[edm.name][edm.version]) {
                Object.assign(actions.edm, this.actions.edm[edm.name][edm.version]);
            }
            if (this.actions.edm[edm.name] && this.actions.edm[edm.name]["*"]) {
                Object.assign(actions.edm, this.actions.edm[edm.name]["*"]);
            }

            if (this.actions.table[edm.name] && this.actions.table[edm.name][edm.version]) {
                Object.assign(actions.table, this.actions.table[edm.name][edm.version]);
            }
            if (this.actions.table[edm.name] && this.actions.table[edm.name]["*"]) {
                Object.assign(actions.table, this.actions.table[edm.name]["*"]);
            }

            if (this.actions.entity[edm.name] && this.actions.entity[edm.name][edm.version]) {
                Object.assign(actions.entity, this.actions.entity[edm.name][edm.version]);
            }
            if (this.actions.entity[edm.name] && this.actions.entity[edm.name]["*"]) {
                Object.assign(actions.entity, this.actions.entity[edm.name]["*"]);
            }

            let metaOptions = {
                database: db,
                decorators: this.decorators,
                fileSystem: this._fileSystem
            };

            let metaDatabase = new MetaDatabase(metaOptions);

            let paneOptions = {
                metaDatabase: metaDatabase,
                migrationRunner: new MigrationRunner({edm:edm, migrator: db.getMigrator(metaDatabase)}),
                edm: edm,
                actions: actions
            };

            let pane = new GlassPane(paneOptions);
            this.glassPanes[edm.name + edm.version] = pane;
            return pane; 
        });
    }

    _openDoorsAsync(doorsConfig = []) {
        if (doorsConfig.length === 0) {
            console.warn("GlassDB is running, but there is no way to access it. Include one or more doors in the options.");
        }
        doorsConfig.forEach((doorConfig) => {
            doorConfig.options['glass'] = this;
            let door = new supportedDoors[doorConfig.name](doorConfig.options);
            Object.keys(this.glassPanes).map((key) => this.glassPanes[key]).forEach((pane) => {
                door.addPane(pane);
            });
            this.glassDoors.push(door);
        });
    }

}