// GlassDb
// Manages a set of GlassPanes
import GlassPane from "../glassPane/GlassPane";
//import MsSqlDriver from "../dbDriver/MsSqlDriver";
//import SqliteDriver from "../dbDriver/SqliteDriver";

supportedDrivers = {
    "sqlite": "../dbDriver/SqliteDriver",
    "mssql": "../dbDriver/MsSqlDriver"
};

supportedDoors = {
    "express": "../glassDoor/ExpressDoor"
};

/*
{
    "dbDriver": {
        "name": "mssql" || "sqlite",
        "options": {(driver-specific options)}
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
        
        let driver = new require(supportedDrivers[dbDriver.name])(dbDriver.options);
        
        // Let's make some panes!
        driver.getEdmListAsync().then((edms) => {
            return edms.reduce((previous, current) => {
                return previous.then(() => {
                    return driver.getDatabaseForEdmAsync(current).then((db) => {
                        // TODO: build GlassPane
                        this.glassPanes[edm.name + edm.version] = (new GlassPane({db:db}));
                    });
                });
            }, Promise.resolve());
        }).then(() => {

        });
        
        // Throw open the doors!
        options.doors.forEach((door) => {
            door.options['glass'] = this;
            let door = new require(supportedDoors[door.name])(door.options);
            this.glassDoors.push(door);
        });
    }

}