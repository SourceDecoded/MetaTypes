// GlassDb
// Manages a set of GlassPanes
import GlassPane from "../glassPane/GlassPane";
import MigrationRunner from "../migration/Runner";
import MetaDatabase from "../meta/Database";
import MsSqlDriver from "../dbDriver/MsSqlDriver";
import SqliteDriver from "../dbDriver/SqliteDriver";
import ExpressDoor from "../glassDoor/GlassExpressDoor";

let supportedDrivers = {
    "sqlite": SqliteDriver,
    "mssql": MsSqlDriver
};

let supportedFilesystems = {};

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
    ]
}
*/

export default class {
    constructor(options = {}) {
        this.glassPanes = {};
        this.glassDoors = [];

        if (!options.dbDriver) {
            throw new Error("Need dbDriver info");
        }

        let dbDriver = options.dbDriver;

        if (Object.keys(supportedDrivers).indexOf(dbDriver.name) === -1) {
            throw new Error(`Unsupported dbDriver: ${dbDriver.name}`);
        }
        
        this._driver = new supportedDrivers[dbDriver.name](dbDriver.options);

        this._driver.getEdmListAsync().then((edms) => {
            return this._buildPanesAsync(edms);
        }).then(() => {
            return this._openDoorsAsync(options.doors);
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

    _buildPanesAsync(edms) {
        return edms.reduce((previous, current) => {
            return previous.then(() => {
                return this._buildPaneAsync(current);
            });
        }, Promise.resolve());
    }

    _buildPaneAsync(edm) {
        return this._driver.getDatabaseForEdmAsync(edm).then((db) => {
            // TODO: instantiate decorators
            let decorators = [];

            // TODO: instantiate filesystem
            let fileSystem = {};

            let metaOptions = {
                database: db,
                decorators: decorators,
                fileSystem: fileSystem
            };

            let metaDatabase = new MetaDatabase(metaOptions);

            let paneOptions = {
                metaDatabase: metaDatabase,
                migrationRunner: new MigrationRunner({edm:edm, migrator:this._driver.getMigrator()}),
                edm: edm
            };

            let pane = new GlassPane(paneOptions);
            this.glassPanes[edm.name + edm.version] = pane;
            return pane; 
        });
    }

    _openDoorsAsync(doorsConfig) {
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