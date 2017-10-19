// GlassDb
// Manages a set of GlassPanes
import GlassPane from "../glassPane/GlassPane";
import MigrationRunner from "../migration/Runner";
import MetaDatabase from "../meta/Database";
import MsSqlDriver from "../dbDriver/MsSqlDriver";
import SqliteDriver from "../dbDriver/SqliteDriver";

supportedDrivers = {
    "sqlite": SqliteDriver,
    "mssql": MsSqlDriver
};

supportedFilesystems = {};

supportedDoors = {
    "express": "../glassDoor/ExpressDoor"
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

        if (Object.keys(supportedDrivers).find(dbDriver.name) === -1) {
            throw new Error(`Unsupported dbDriver: ${dbDriver.name}`);
        }
        
        let driver = new supportedDrivers[dbDriver.name](dbDriver.options);

        driver.getEdmListAsync().then((edms) => {
            return _buildPanesAsync(edms);
        }).then(() => {
            return _openDoorsAsync(options.doors);
        });
        
    }

    _buildPanesAsync(edms) {
        return edms.reduce((previous, current) => {
            return previous.then(() => {
                return driver.getDatabaseForEdmAsync(current).then((db) => {
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
                        migrationRunner: new MigrationRunner({migrator:driver.getMigrator()}),
                        edm: current
                    };
                    this.glassPanes[edm.name + edm.version] = new GlassPane(paneOptions);
                });
            });
        }, Promise.resolve());
    }

    _openDoorsAsync(doorsConfig) {
        if (doorsConfig.length === 0) {
            console.warn("GlassDB is running, but there is no way to access it. Include one or more doors in the options.");
        }
        doorsConfig.forEach((doorConfig) => {
            doorConfig.options['glass'] = this;
            let door = new require(supportedDoors[door.name])(door.options);
            this.glassDoors.push(door);
        });
    }

}